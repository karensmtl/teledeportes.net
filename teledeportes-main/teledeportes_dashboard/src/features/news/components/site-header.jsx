import { Link } from 'react-router-dom';

import { IconSearch, IconUser } from '../../../common/icons';
import { NAV_SECTIONS } from '../utils/format';

// Public site masthead — single bar (RTVE-Play style): logo + tagline on the
// left, section nav inline, and search / account / contact on the right.
// `activeKey` marks the current section; `onNavigate(key)` switches the view.
export default function SiteHeader({ activeKey, onNavigate }) {
    return (
        <header className="site-hd">
            <div className="site-hd__inner">
                <a className="site-hd__brand" onClick={() => onNavigate('home')}>
                    <img
                        className="site-hd__logo"
                        src="/logo.png"
                        alt="TELEDEPORTES"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span className="site-hd__tag">teledeportes en directo</span>
                </a>

                {/* Una entrada con `children` es un grupo: el submenú se abre por
                    :hover y :focus-within, sin estado en JS. Eso lo hace
                    alcanzable también con teclado y con el D-pad del control
                    remoto — al enfocar el botón, el grupo entra en focus-within
                    y los hijos pasan a ser visibles (y por tanto enfocables). */}
                <nav className="site-hd__nav">
                    {NAV_SECTIONS.map(({ key, label, to, children }) => (
                        children
                            ? (
                                <div className="site-hd__group" key={key}>
                                    <button
                                        type="button"
                                        className={`site-hd__group-btn${activeKey === key ? ' active' : ''}`}
                                        aria-haspopup="true"
                                    >
                                        {label}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                                    </button>
                                    <div className="site-hd__menu">
                                        {children.map(child => (
                                            <Link key={child.key} to={child.to} className="site-hd__menu-item">
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                            : (
                                <Link key={key} to={to} className={activeKey === key ? 'active' : undefined}>
                                    {label}
                                </Link>
                            )
                    ))}
                </nav>

                <div className="site-hd__actions">
                    <button type="button" className="site-icon-btn" aria-label="Buscar" title="Buscar">
                        <IconSearch size={19} />
                    </button>
                    <Link to="/admin" className="site-icon-btn" aria-label="Cuenta" title="Cuenta">
                        <IconUser size={20} />
                    </Link>
                    <Link to="/contacto" className="bnt_contac">CONTÁCTANOS</Link>
                </div>
            </div>
        </header>
    );
}
