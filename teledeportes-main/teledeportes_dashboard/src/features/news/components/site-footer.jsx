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
                        <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                        </a>
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
                            <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a>
                        </span>
                    </div>
                    <div className="rj_footer_contact_item">
                        <span className="rj_footer_contact_icon"><IconMail /></span>
                        <span className="rj_footer_contact_text">
                            <a href="mailto:info@teledeportes.net">info@teledeportes.net</a>
                        </span>
                    </div>
                </div>
            </div>

            <div className="rj_footer_divider">
                <span className="rj_footer_copy">© {year} <span>TELEDEPORTES</span> · Todos los derechos reservados</span>
                <span className="rj_footer_badge">En vivo · 24/7</span>
            </div>
        </footer>
    );
}
