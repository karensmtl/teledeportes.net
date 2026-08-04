import { Link } from 'react-router-dom';

import { IconMapPin, IconBroadcast, IconMessageCircle, IconMail } from '../../../common/icons';
import { NAV_SECTIONS } from '../utils/format';

// Site footer, ported from the prototype. `onNavigate(key)` reuses the in-page
// section switcher for the "Secciones" links.
export default function SiteFooter({ onNavigate }) {
    const year = new Date().getFullYear();
    return (
        <footer className="rj_footer">
            <div className="rj_footer_inner">
                <div className="rj_footer_brand">
                    <img
                        src="/logo.png"
                        alt="TELEDEPORTES"
                        className="rj_footer_logo"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <p className="rj_footer_desc">
                        La voz de TELEDEPORTES. Informamos, entretenemos y conectamos a nuestra
                        comunidad con lo que más importa: noticias locales, deportes, cultura y
                        política al instante.
                    </p>
                    <div className="rj_footer_social">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0f172a" /></svg>
                        </a>
                        <Link to="/contacto" title="Contacto">
                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4m0-2a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Z" /></svg>
                        </Link>
                    </div>
                </div>

                <div>
                    <div className="rj_footer_col_title">Secciones</div>
                    <ul className="rj_footer_links">
                        {NAV_SECTIONS.map(({ key, label }) => (
                            <li key={key}><a onClick={() => onNavigate(key)}>{label === 'TODAS' ? 'Todas las noticias' : label.charAt(0) + label.slice(1).toLowerCase()}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="rj_footer_col_title">Contacto</div>
                    <div className="rj_footer_contact_item">
                        <span className="rj_footer_contact_icon"><IconMapPin /></span>
                        <span className="rj_footer_contact_text">CALI, Valle del Cauca, Colombia</span>
                    </div>
                    <div className="rj_footer_contact_item">
                        <span className="rj_footer_contact_icon"><IconBroadcast size={16} /></span>
                        <span className="rj_footer_contact_text">Transmisión en vivo · FM</span>
                    </div>
                    <div className="rj_footer_contact_item">
                        <span className="rj_footer_contact_icon"><IconMessageCircle /></span>
                        <span className="rj_footer_contact_text">
                            <Link to="/contacto">Escríbenos</Link>
                        </span>
                    </div>
                    <div className="rj_footer_contact_item">
                        <span className="rj_footer_contact_icon"><IconMail /></span>
                        <span className="rj_footer_contact_text">
                            <a href="mailto:info@teledeportes.net">info@teledeportes.net</a>
                        </span>
                    </div>
                </div>

                <div>
                    <div className="rj_footer_col_title">Legal</div>
                    <ul className="rj_footer_links">
                        <li><Link to="/contacto">Contacto</Link></li>
                        <li><Link to="/terminos">Términos y condiciones</Link></li>
                        <li><Link to="/privacidad">Política de privacidad</Link></li>
                    </ul>
                </div>
            </div>

            <div className="rj_footer_divider">
                <span className="rj_footer_copy">© {year} <span>TELEDEPORTES</span> · Todos los derechos reservados</span>
                <span className="rj_footer_badge">En vivo · 24/7</span>
            </div>
        </footer>
    );
}
