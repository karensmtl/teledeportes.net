import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../global/contexts/auth/auth';

import './styles/login.css';

// TSS vite/05 — login flow. Backend sets the httpOnly session cookie
// + csrf_token cookie on a successful POST /auth/login.

export default function LoginPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate('/admin', { replace: true });
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (params.get('logout') === 'true') toast.success('Sesión cerrada');
    }, [params]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setSubmitting(true);
        try {
            // Backend contract (core/05): POST /auth/login → { email, password }.
            await login({ email, password });
            navigate('/admin', { replace: true });
        } catch (err) {
            toast.error(err?.message || 'Credenciales inválidas');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login">
            <form className="login__card" onSubmit={handleSubmit}>
                <Link to="/" className="login__brand">
                    <img className="login__logo" src="/logo.jpeg" alt="TeleDeportes" />
                </Link>
                <h1 className="login__title">Iniciar sesión</h1>

                <label className="login__field">
                    <span>Correo</span>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </label>

                <label className="login__field">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="login__submit"
                    disabled={submitting || !email || !password}
                >
                    {submitting ? 'Ingresando...' : 'Ingresar'}
                </button>

                <Link to="/" className="login__back">← Volver al inicio</Link>
            </form>
        </div>
    );
}
