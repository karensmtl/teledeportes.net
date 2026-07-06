import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Navigate } from 'react-router-dom';

import { api } from '../../../core/network/api';
import { broadcastLogout, SESSION_EXPIRED_EVENT } from '../../../core/network/session';

// TSS vite/05 — Authentication context. Cookie+CSRF transport.
//
// The JWT lives in an httpOnly cookie set by the backend on /auth/login.
// JS never sees it. csrf_token (the JS-readable companion) is read by
// the api interceptor and echoed in X-CSRF-Token on mutating requests.
//
// This file owns: session state, permission set, permission refresh,
// route guards, and the <Gate> component.

const EMPTY_SET = new Set();
const AuthContext = createContext(null);

// Mirrors the backend authorize() matcher: '*' grants everything, a
// 'resource:*' grant covers any 'resource:<level>', otherwise exact match.
function permissionMatches(granted, required) {
    if (granted === '*' || granted === required) return true;
    if (granted.endsWith(':*')) return required.startsWith(granted.slice(0, -1));
    return false;
}

function hasPermission(permissions, required) {
    if (!required) return true;
    for (const granted of permissions) {
        if (permissionMatches(granted, required)) return true;
    }
    return false;
}

export function AuthProvider({ children }) {
    const [user, setUser]                 = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [permissions, setPermissions]   = useState(EMPTY_SET);
    const [denied, setDenied]             = useState(EMPTY_SET);

    const refreshTimer = useRef(null);

    const applyPermissions = useCallback((payload) => {
        const list   = Array.isArray(payload?.permissions) ? payload.permissions : [];
        const denied = Array.isArray(payload?.denied)      ? payload.denied      : [];
        setPermissions(new Set(list));
        setDenied(new Set(denied));
    }, []);

    const refreshPermissions = useCallback(async () => {
        try {
            const perms = await api.get('auth/permissions').then(r => r.data);
            applyPermissions(perms);
        } catch {
            // Silent — refresh on 403 is opportunistic.
        }
    }, [applyPermissions]);

    // Bootstrap: read /auth/me + /auth/permissions once at mount.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [me, perms] = await Promise.all([
                    api.get('auth/me').then(r => r.data),
                    api.get('auth/permissions').then(r => r.data),
                ]);
                if (cancelled) return;
                setUser(me?.user || me);
                applyPermissions(perms);
            } catch {
                if (cancelled) return;
                setUser(null);
            } finally {
                if (!cancelled) setInitializing(false);
            }
        })();
        return () => { cancelled = true; };
    }, [applyPermissions]);

    // Refresh on window focus + on the auth:permissions-refresh signal
    // emitted by the api interceptor when a 403 lands.
    useEffect(() => {
        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                clearTimeout(refreshTimer.current);
                refreshTimer.current = setTimeout(refreshPermissions, 250);
            }
        };
        const onRefresh = () => refreshPermissions();

        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('auth:permissions-refresh', onRefresh);
        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('auth:permissions-refresh', onRefresh);
            clearTimeout(refreshTimer.current);
        };
    }, [refreshPermissions]);

    // Multi-tab logout sync — TSS vite/05 §"Logout-everywhere".
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'logout_signal') {
                setUser(null);
                setPermissions(EMPTY_SET);
                setDenied(EMPTY_SET);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Same-tab session expiry — the 401 interceptor dispatches this when a
    // non-auth request comes back 401 (expired JWT). Clearing the user lets
    // the route guards redirect to /login on the next render — no reload.
    useEffect(() => {
        const onExpired = () => {
            setUser(null);
            setPermissions(EMPTY_SET);
            setDenied(EMPTY_SET);
        };
        window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
    }, []);

    const login = useCallback(async (credentials) => {
        const res = await api.post('auth/login', credentials).then(r => r.data);
        const user = res?.user || res;
        setUser(user);
        // Login returns the user with its permissions; gate immediately
        // instead of waiting for the /auth/permissions refresh.
        applyPermissions({ permissions: user?.permissions });
    }, [applyPermissions]);

    const logout = useCallback(async () => {
        // Always clear local state, even if the network call fails.
        try { await api.post('auth/logout'); } catch { /* ignore */ }
        setUser(null);
        setPermissions(EMPTY_SET);
        setDenied(EMPTY_SET);
        broadcastLogout();
    }, []);

    const can = useCallback((domain) => {
        if (!domain) return true;
        return hasPermission(permissions, domain);
    }, [permissions]);

    const canAny = useCallback((...domains) => {
        if (!domains.length) return true;
        return domains.some(d => hasPermission(permissions, d));
    }, [permissions]);

    const canAll = useCallback((...domains) => {
        if (!domains.length) return true;
        return domains.every(d => hasPermission(permissions, d));
    }, [permissions]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        initializing,
        permissions,
        denied,
        can, canAny, canAll,
        refreshPermissions,
        login, logout,
    }), [user, initializing, permissions, denied, can, canAny, canAll, refreshPermissions, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

// <Gate> — TSS vite/05 §"UI gating — <Gate> only".
// The ONLY way to conditional-render JSX by permission. Inline can() in
// JSX is forbidden; use can/canAny/canAll only outside JSX.
export function Gate({ domain, any, all, fallback = null, children }) {
    const { can, canAny, canAll } = useAuth();

    let allowed = true;
    if (domain) allowed = can(domain);
    else if (any && any.length) allowed = canAny(...any);
    else if (all && all.length) allowed = canAll(...all);

    return allowed ? <>{children}</> : <>{fallback}</>;
}

// Route guards — TSS vite/05 §"Route guards".

export function ProtectedRoute({ children, domain, any }) {
    const { isAuthenticated, initializing, can, canAny } = useAuth();

    if (initializing) return <BootLoader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (domain && !can(domain)) return <Navigate to="/unauthorized" replace />;
    if (any && any.length && !canAny(...any)) return <Navigate to="/unauthorized" replace />;
    return children;
}

export function AuthRoute({ children }) {
    const { isAuthenticated, initializing } = useAuth();
    if (initializing) return <BootLoader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

function BootLoader() {
    return (
        <div className="boot-loader">
            <div className="boot-loader__spinner" />
            <span className="boot-loader__text">Verificando sesión...</span>
        </div>
    );
}
