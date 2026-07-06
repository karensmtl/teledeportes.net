import { Link } from 'react-router-dom';

import { IconHeart } from '../../common/icons';
import { meta } from '../../global/config/api';
import CHANGELOG from './changelog';

import './styles/footer.css';

const CURRENT_VERSION = CHANGELOG[0].version;
const CURRENT_YEAR = new Date().getFullYear();
const CONTACT_EMAIL = 'contacto@teledeportes.net';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__top">
                <div className="footer__brand">
                    <img className="footer__logo" src="/logo.jpeg" alt={meta.projectName} />
                    <p className="footer__tagline">
                        Fútbol en vivo y catálogo deportivo bajo demanda.
                    </p>
                </div>

                <nav className="footer__col" aria-label="Navegación">
                    <span className="footer__col-title">Explorar</span>
                    <Link to="/" className="footer__link">Inicio</Link>
                    <Link to="/" className="footer__link">Canales en vivo</Link>
                    <Link to="/" className="footer__link">Catálogo</Link>
                </nav>

                <nav className="footer__col" aria-label="Cuenta">
                    <span className="footer__col-title">Cuenta</span>
                    <Link to="/login" className="footer__link">Iniciar sesión</Link>
                    <Link to="/admin" className="footer__link">Panel de administración</Link>
                </nav>

                <nav className="footer__col" aria-label="Legal y soporte">
                    <span className="footer__col-title">Legal y soporte</span>
                    <Link to="/terminos" className="footer__link">Términos de uso</Link>
                    <Link to="/privacidad" className="footer__link">Política de privacidad</Link>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="footer__link">Contacto</a>
                </nav>
            </div>

            <div className="footer__bottom">
                <span className="footer__copy">
                    © {CURRENT_YEAR} {meta.projectName}. Todos los derechos reservados.
                </span>
                <span className="footer__made">
                    Desarrollado con <IconHeart /> por Trianametria Software
                </span>
                <Link to="/admin/changelog" className="footer__version">{CURRENT_VERSION}</Link>
            </div>
        </footer>
    );
}
