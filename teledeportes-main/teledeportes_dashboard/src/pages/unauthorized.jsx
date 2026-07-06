import { Link } from 'react-router-dom';

import './styles/unauthorized.css';

export default function UnauthorizedPage() {
    return (
        <div className="unauthorized">
            <h1 className="unauthorized__title">Sin permisos</h1>
            <p className="unauthorized__text">
                No tienes acceso a esta página. Si crees que es un error, contacta al administrador.
            </p>
            <div className="unauthorized__actions">
                <Link to="/admin/profile" className="unauthorized__link">Ir a mi perfil</Link>
                <Link to="/logout" className="unauthorized__link unauthorized__link--secondary">Cerrar sesión</Link>
            </div>
        </div>
    );
}
