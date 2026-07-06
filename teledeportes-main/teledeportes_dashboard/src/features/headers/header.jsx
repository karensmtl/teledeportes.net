import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../../global/contexts/auth/auth';
import { meta } from '../../global/config/api';

import './styles/header.css';

// TSS vite/05 — menu definition. `can/canAny` is permitted OUTSIDE JSX
// (here, in a builder that produces a filtered array). Inline can() in
// JSX is forbidden; use <Gate> for that.
//
// Each item may declare `domain` (single) or `any` (array of codes).
// Items with no permission requirement are visible to every authenticated user.
const MENU = [
    { title: 'Dashboard', link: '/admin/dashboard' },
    { title: 'Items',      link: '/admin/example',            any: ['items:read', 'items:write'] },
    { title: 'Categorías', link: '/admin/example/categories', domain: 'items:read' },
    { title: 'Mi perfil',  link: '/admin/profile' },
    { title: 'Cerrar sesión', link: '/logout' },
];

function isVisible(item, can, canAny) {
    if (item.domain) return can(item.domain);
    if (item.any && item.any.length) return canAny(...item.any);
    return true;
}

export default function Header({ title }) {
    const { pathname } = useLocation();
    const { isAuthenticated, can, canAny } = useAuth();
    const [openMenu, setOpenMenu] = useState(false);

    const visibleMenu = useMemo(
        () => (isAuthenticated ? MENU.filter(item => isVisible(item, can, canAny)) : []),
        [isAuthenticated, can, canAny],
    );

    return (
        <header className="header">
            <div className="header__brand">
                <Link to="/" className="header__brand-link">
                    <img className="header__logo" src="/logo.jpeg" alt={meta.projectName} />
                </Link>
                {title && <span className="header__route">{title}</span>}
            </div>

            <nav className="header__nav">
                <button
                    className="header__hamburger"
                    onClick={() => setOpenMenu(v => !v)}
                    aria-label="Menú"
                    aria-expanded={openMenu}
                >
                    {openMenu ? '✖' : '☰'}
                </button>

                <ul className={`header__menu ${openMenu ? 'header__menu--open' : ''}`}>
                    {visibleMenu.map((item) => (
                        <li
                            key={item.link}
                            className={`header__item ${pathname.startsWith(item.link) ? 'header__item--active' : ''}`}
                        >
                            <Link to={item.link} className="header__link">{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
