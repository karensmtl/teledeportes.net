// News taxonomy — matches the backend `NEWS_CATEGORIES` enum.
export const NEWS_CATEGORIES = ['NOTICIAS', 'DEPORTES', 'CULTURA', 'POLÍTICA'];

// Nav sections (the site nav also has INICIO + TODAS which aren't categories).
export const NAV_SECTIONS = [
    { key: 'home', label: 'INICIO' },
    { key: 'noticias', label: 'NOTICIAS', category: 'NOTICIAS' },
    { key: 'deportes', label: 'DEPORTES', category: 'DEPORTES' },
    { key: 'cultura', label: 'CULTURA', category: 'CULTURA' },
    { key: 'politica', label: 'POLÍTICA', category: 'POLÍTICA' },
    { key: 'todas', label: 'TODAS' },
];

// Category page hero intro copy. The icon is an SVG mapped in category-page.jsx.
export const CATEGORY_META = {
    NOTICIAS: { blurb: 'Todo lo que está pasando en Colombia y el mundo.' },
    DEPORTES: { blurb: 'Resultados, fichajes y todo el deporte nacional e internacional.' },
    CULTURA:  { blurb: 'Arte, música, cine y todo lo que mueve la identidad de nuestra región.' },
    POLÍTICA: { blurb: 'Decisiones, debates y análisis del panorama político colombiano.' },
};

// Breaking-news ticker headlines.
export const TICKER_ITEMS = [
    'COLOMBIA rumbo al Mundial 2026',
    'Fichajes clave en la Liga BetPlay',
    'Final de la Copa América sub-23',
    'Estadio listo para la preparación mundialista',
];

// Formats an ISO date into the Spanish long form, e.g. "28 de febrero de 2026".
export function formatNewsDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Trims a string to `max` chars with an ellipsis, matching the prototype cards.
export function truncate(text, max) {
    const s = String(text || '');
    return s.length > max ? `${s.slice(0, max)}…` : s;
}
