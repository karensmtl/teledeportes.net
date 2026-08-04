import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconMail, IconMapPin, IconMessageCircle, IconBroadcast } from '../../../common/icons';
import { ORGANIZATION as ORG, whatsappUrl } from '../../../core/constants/organization';
import SiteLayout from '../../news/layouts/site-layout';

import './styles/contact.css';

// Página de contacto.
//
// El backend no expone endpoint de mensajes, así que el formulario NO simula un
// envío: compone un `mailto:` con lo escrito y lo abre en el cliente de correo
// de la persona. Es honesto (el mensaje sale de verdad) y no requiere servidor.
// Cuando exista `POST /public/contact`, este es el único sitio que cambia.
export default function Contact() {
    const navigate = useNavigate();
    const goSection = (key) => navigate(key === 'home' ? '/' : `/?s=${key}`);

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [touched, setTouched] = useState(false);

    useEffect(() => { window.scrollTo({ top: 0 }); }, []);

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    const complete = form.name.trim() && form.email.trim() && form.message.trim();

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!complete) return;

        const subject = form.subject.trim() || `Contacto desde ${ORG.site}`;
        const body = [
            `Nombre: ${form.name}`,
            `Correo: ${form.email}`,
            '',
            form.message,
        ].join('\n');

        window.location.href =
            `mailto:${ORG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const wa = whatsappUrl(`Hola, escribo desde ${ORG.site}`);

    return (
        <SiteLayout onNavigate={goSection}>
            <div className="contact">
                <header className="contact__head">
                    <span className="contact__rule" aria-hidden="true" />
                    <h1 className="contact__title">Contacto</h1>
                    <p className="contact__lead">
                        ¿Tienes una noticia, una propuesta o un problema con la transmisión?
                        Escríbenos y te respondemos.
                    </p>
                </header>

                <div className="contact__grid">
                    <section className="contact__channels" aria-label="Canales de contacto">
                        <a className="contact__channel" href={`mailto:${ORG.email}`}>
                            <span className="contact__icon"><IconMail /></span>
                            <span className="contact__channel-body">
                                <span className="contact__channel-label">Correo</span>
                                <span className="contact__channel-value">{ORG.email}</span>
                            </span>
                        </a>

                        {/* Sin número configurado no se pinta el canal: más vale
                            ausente que un enlace que no lleva a nadie. */}
                        {wa && (
                            <a className="contact__channel" href={wa} target="_blank" rel="noopener noreferrer">
                                <span className="contact__icon"><IconMessageCircle /></span>
                                <span className="contact__channel-body">
                                    <span className="contact__channel-label">WhatsApp</span>
                                    <span className="contact__channel-value">Escríbenos por WhatsApp</span>
                                </span>
                            </a>
                        )}

                        <div className="contact__channel contact__channel--static">
                            <span className="contact__icon"><IconMapPin /></span>
                            <span className="contact__channel-body">
                                <span className="contact__channel-label">Dónde estamos</span>
                                <span className="contact__channel-value">{ORG.city}, {ORG.country}</span>
                            </span>
                        </div>

                        <div className="contact__channel contact__channel--static">
                            <span className="contact__icon"><IconBroadcast size={18} /></span>
                            <span className="contact__channel-body">
                                <span className="contact__channel-label">Transmisión</span>
                                <span className="contact__channel-value">En vivo, 24/7</span>
                            </span>
                        </div>

                        <div className="contact__social">
                            <span className="contact__channel-label">Síguenos</span>
                            <div className="contact__social-links">
                                <a href={ORG.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a href={ORG.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href={ORG.social.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
                            </div>
                        </div>
                    </section>

                    <section className="contact__form-wrap" aria-label="Formulario de contacto">
                        <form className="contact__form" onSubmit={submit} noValidate>
                            <label className="contact__field">
                                <span>Nombre *</span>
                                <input value={form.name} onChange={set('name')} autoComplete="name" />
                                {touched && !form.name.trim() && <em className="contact__error">Escribe tu nombre</em>}
                            </label>

                            <label className="contact__field">
                                <span>Correo *</span>
                                <input type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                                {touched && !form.email.trim() && <em className="contact__error">Escribe tu correo</em>}
                            </label>

                            <label className="contact__field">
                                <span>Asunto</span>
                                <input value={form.subject} onChange={set('subject')} placeholder="Sobre qué nos escribes" />
                            </label>

                            <label className="contact__field">
                                <span>Mensaje *</span>
                                <textarea rows={6} value={form.message} onChange={set('message')} />
                                {touched && !form.message.trim() && <em className="contact__error">Escribe tu mensaje</em>}
                            </label>

                            <button type="submit" className="contact__submit">Enviar mensaje</button>
                            <p className="contact__note">
                                Al enviar se abrirá tu aplicación de correo con el mensaje ya escrito,
                                listo para que lo mandes. Si prefieres, escríbenos directamente a{' '}
                                <a href={`mailto:${ORG.email}`}>{ORG.email}</a>.
                            </p>
                        </form>
                    </section>
                </div>
            </div>
        </SiteLayout>
    );
}
