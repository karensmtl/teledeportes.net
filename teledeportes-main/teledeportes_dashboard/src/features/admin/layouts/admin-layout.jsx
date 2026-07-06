import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../global/contexts/auth/auth';
import { IconGrid, IconTag, IconVideo, IconBroadcast, IconCamera, IconNews, IconLogout } from '../../../common/icons';

import './styles/admin-layout.css';

// TSS vite/05 — menu built outside JSX with can/canAny (allowed there).
const NAV = [
    { to: '/admin', label: 'Dashboard', Icon: IconGrid, end: true },
    { to: '/admin/news', label: 'Noticias', Icon: IconNews, any: ['noticias:read', 'noticias:write'] },
    { to: '/admin/channels', label: 'Canales', Icon: IconBroadcast, any: ['channels:read', 'channels:write'] },
    { to: '/admin/studio', label: 'Estudio', Icon: IconCamera, any: ['channels:write'] },
    { to: '/admin/categories', label: 'Categorías', Icon: IconTag, any: ['categories:read', 'categories:write'] },
    { to: '/admin/videos', label: 'Videos', Icon: IconVideo, any: ['videos:read', 'videos:write'] },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const { user, canAny, logout } = useAuth();

    const items = NAV.filter(item => (item.any ? canAny(...item.any) : true));

    const handleLogout = async () => {
        await logout();
        navigate('/login?logout=true', { replace: true });
    };

    return (
        <div className="admin">
            <aside className="admin__sidebar">
                <NavLink to="/" className="admin__brand">
                    <img className="admin__logo" src="/logo.jpeg" alt="TeleDeportes" />
                </NavLink>

                <nav className="admin__nav">
                    {items.map(({ to, label, Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `admin__link ${isActive ? 'admin__link--active' : ''}`}
                        >
                            <span className="admin__link-icon"><Icon size={18} /></span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin__user">
                    <div className="admin__user-info">
                        <span className="admin__user-name">{user?.name || 'Usuario'}</span>
                        <span className="admin__user-role">{user?.role}</span>
                    </div>
                    <button className="btn btn--ghost btn--sm" onClick={handleLogout} title="Cerrar sesión">
                        <IconLogout size={16} />
                    </button>
                </div>
            </aside>

            <main className="admin__content">
                <Outlet />
            </main>
        </div>
    );
}
