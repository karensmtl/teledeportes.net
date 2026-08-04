import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LEGAL_UPDATED_AT } from '../../../core/constants/organization';
import { formatNewsDate } from '../../news/utils/format';
import SiteLayout from '../../news/layouts/site-layout';

import './styles/legal.css';

// Renderiza un documento legal a partir de los datos de utils/documents.js.
// Ambas páginas comparten este layout para que no puedan divergir de estilo.
export default function LegalPage({ document: doc, siblingTo, siblingLabel }) {
    const navigate = useNavigate();
    const goSection = (key) => navigate(key === 'home' ? '/' : `/?s=${key}`);

    // Se llega aquí desde el pie de página, casi siempre con scroll abajo.
    useEffect(() => { window.scrollTo({ top: 0 }); }, [doc.slug]);

    return (
        <SiteLayout onNavigate={goSection}>
            <article className="legal">
                <header className="legal__head">
                    <span className="legal__rule" aria-hidden="true" />
                    <h1 className="legal__title">{doc.title}</h1>
                    <p className="legal__updated">
                        Última actualización: <time dateTime={LEGAL_UPDATED_AT}>{formatNewsDate(LEGAL_UPDATED_AT)}</time>
                    </p>
                    <p className="legal__lead">{doc.lead}</p>
                </header>

                {doc.sections.map(section => (
                    <section className="legal__section" key={section.heading}>
                        <h2 className="legal__heading">{section.heading}</h2>
                        {section.paragraphs?.map(text => (
                            <p className="legal__text" key={text}>{text}</p>
                        ))}
                        {section.list && (
                            <ul className="legal__list">
                                {section.list.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        )}
                    </section>
                ))}

                <footer className="legal__foot">
                    <Link to={siblingTo} className="legal__sibling">{siblingLabel} →</Link>
                    <Link to="/" className="legal__sibling legal__sibling--muted">Volver al inicio</Link>
                </footer>
            </article>
        </SiteLayout>
    );
}
