import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { IconBroadcast } from '../../../common/icons';
import SiteLayout from '../../news/layouts/site-layout';

import './styles/rapichontico.css';

// Marcador de posición de la página dedicada de Rapichontico.
//
// Existe a propósito aunque el contenido esté pendiente: el enlace ya está en el
// menú, y sin ruta caería en el catch-all y devolvería a la portada sin decir
// nada — el mismo fallo silencioso que arrastraban /terminos y /privacidad.
// Cuando llegue el contenido real, se sustituye este layout y la ruta no cambia.
export default function Rapichontico() {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo({ top: 0 }); }, []);

    return (
        <SiteLayout activeKey="entretenimiento" onNavigate={(key) => navigate(key === 'home' ? '/' : '/')}>
            <div className="rapi">
                <span className="rapi__icon"><IconBroadcast size={40} /></span>
                <h1 className="rapi__title">Rapichontico</h1>
                <p className="rapi__text">
                    Estamos preparando esta página. Muy pronto encontrarás aquí todo
                    el contenido de Rapichontico.
                </p>
                <div className="rapi__actions">
                    <Link to="/vivo" className="rapi__cta">Ver canales en vivo</Link>
                    <Link to="/" className="rapi__link">Volver al inicio</Link>
                </div>
            </div>
        </SiteLayout>
    );
}
