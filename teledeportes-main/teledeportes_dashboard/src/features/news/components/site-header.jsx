import { NAV_SECTIONS } from '../utils/format';

// Public site masthead: logo, contact CTA, and the section nav. `activeKey`
// marks the current section; `onNavigate(key)` switches the in-page view.
export default function SiteHeader({ activeKey, onNavigate }) {
    return (
        <header>
            <div className="header_top">
                <div className="logo_top">
                    <a className="logo_area" onClick={() => onNavigate('home')}>
                        <img
                            src="/logo.png"
                            alt="TELEDEPORTES"
                            className="logo_img"
                            style={{ height: 80, width: 'auto', maxWidth: 260 }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </a>
                </div>
                <div className="colecctions">
                    <a href="https://web.whatsapp.com/" className="bnt_contac" target="_blank" rel="noopener noreferrer">CONTÁCTANOS</a>
                </div>
            </div>
            <nav className="links_navegation">
                <div className="nav_inner">
                    <ul className="nav_linka">
                        {NAV_SECTIONS.map(({ key, label }) => (
                            <li className="nav_list" key={key}>
                                <a
                                    className={activeKey === key ? 'active' : undefined}
                                    onClick={() => onNavigate(key)}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
