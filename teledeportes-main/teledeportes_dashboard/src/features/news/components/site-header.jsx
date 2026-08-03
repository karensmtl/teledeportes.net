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

                <nav className="site-hd__nav">
                    {NAV_SECTIONS.map(({ key, label }) => (
                        <a
                            key={key}
                            className={activeKey === key ? 'active' : undefined}
                            onClick={() => onNavigate(key)}
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="site-hd__actions">
                    <button type="button" className="site-icon-btn" aria-label="Buscar" title="Buscar">
                        <IconSearch size={19} />
                    </button>
                    <Link to="/admin" className="site-icon-btn" aria-label="Cuenta" title="Cuenta">
                        <IconUser size={20} />
                    </Link>
                    <a href="https://web.whatsapp.com/" className="bnt_contac" target="_blank" rel="noopener noreferrer">CONTÁCTANOS</a>
                </div>
            </div>
        </header>
    );
}
