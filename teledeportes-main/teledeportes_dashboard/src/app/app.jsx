import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, AuthRoute, ProtectedRoute, useAuth } from '../global/contexts/auth/auth';
import { queryClient } from '../core/network/query-client';
import Footer from '../features/footer/footer';
import AdminLayout from '../features/admin/layouts/admin-layout';

import HomePage from '../pages/home';
import WatchPage from '../pages/watch';
import LoginPage from '../pages/login';
import UnauthorizedPage from '../pages/unauthorized';
import DashboardPage from '../pages/admin/dashboard';
import CategoriesPage from '../pages/admin/categories';
import VideosPage from '../pages/admin/videos';
import ChannelsPage from '../pages/admin/channels';
import StudioPage from '../pages/admin/studio';
import NewsPage from '../pages/admin/news';
import LivePage from '../pages/vivo';
import LiveWatchPage from '../pages/vivo-watch';

// TSS vite/01 — app shell. Wires providers, router, layout chrome.
// TSS vite/03 §"Provider composition order" — Router → Auth → QueryClient → cross-app providers.

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <AppGate>
                        <AppShell />
                    </AppGate>
                    <Toaster position="top-right" />
                </QueryClientProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

// Blocks rendering until the auth bootstrap resolves so guarded routes
// never flash unauthorized content during the initial /auth/me call.
function AppGate({ children }) {
    const { initializing } = useAuth();
    if (initializing) {
        return (
            <div className="boot-loader">
                <div className="boot-loader__spinner" />
                <span className="boot-loader__text">Verificando sesión...</span>
            </div>
        );
    }
    return children;
}

// The public surfaces (news home + live) are full-bleed and ship their own
// site header/footer, so we drop the shell padding and the global Footer there.
function AppShell() {
    const { pathname } = useLocation();
    const isPublicSite = pathname === '/' || pathname === '/vivo' || pathname.startsWith('/vivo/');

    return (
        <div className="app-shell">
            <main className={`app-shell__main${isPublicSite ? ' app-shell__main--bleed' : ''}`}>
                <AppRoutes />
            </main>
            {!isPublicSite && <Footer />}
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public surfaces — the app no longer forces /login on boot. */}
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:slug" element={<WatchPage />} />
            <Route path="/vivo" element={<LivePage />} />
            <Route path="/vivo/:slug" element={<LiveWatchPage />} />

            {/* Pre-auth surfaces — TSS vite/01 §"Pages by audience". */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/logout" element={<Navigate to="/login?logout=true" replace />} />

            {/* Admin CMS — authenticated shell with nested feature pages. */}
            <Route path="/admin" element={<AuthRoute><AdminLayout /></AuthRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="news" element={
                    <ProtectedRoute any={['noticias:read', 'noticias:write']}><NewsPage /></ProtectedRoute>
                } />
                <Route path="channels" element={
                    <ProtectedRoute any={['channels:read', 'channels:write']}><ChannelsPage /></ProtectedRoute>
                } />
                <Route path="studio" element={
                    <ProtectedRoute domain="channels:write"><StudioPage /></ProtectedRoute>
                } />
                <Route path="categories" element={
                    <ProtectedRoute any={['categories:read', 'categories:write']}><CategoriesPage /></ProtectedRoute>
                } />
                <Route path="videos" element={
                    <ProtectedRoute any={['videos:read', 'videos:write']}><VideosPage /></ProtectedRoute>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
