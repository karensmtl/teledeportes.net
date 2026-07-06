// TSS vite/05 — session helpers.
//
// With the cookie+CSRF transport, the session JWT lives in an httpOnly
// cookie that JS cannot read. The only JS-readable token is csrf_token,
// which the api interceptor needs on every mutating request.
//
// The cookie is set by the backend on /auth/login and cleared on /auth/logout.

const CSRF_COOKIE = 'csrf_token';

export function readCsrfCookie() {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

// Forces every other tab to log out. The interceptor (or AuthProvider)
// flips this key when it detects a 401 or after a /auth/logout call.
// Per TSS vite/05 §"Logout-everywhere and session invalidation".
export function broadcastLogout() {
    try {
        localStorage.setItem('logout_signal', String(Date.now()));
    } catch {
        // localStorage may be unavailable (private mode, quota); ignore.
    }
}

// Same-tab "session expired" signal. The 401 interceptor dispatches this
// instead of doing a hard window.location redirect, which would discard
// React state and re-trigger the very bootstrap that produced the 401
// (the infinite reload loop). AuthProvider listens and clears the user;
// the route guards then redirect to /login client-side. No reload, no loop.
export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

export function notifySessionExpired() {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    broadcastLogout(); // keep cross-tab logout
}
