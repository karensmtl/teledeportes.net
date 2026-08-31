// Datos del responsable legal — TSS vite/02 §"Constants live in core/constants".
// Los documentos legales (privacidad, términos) los leen de aquí, así que
// rellenar esto una vez actualiza ambos.
//
// PENDIENTE: los campos marcados son marcadores de posición. La Ley 1581 de
// 2012 exige identificar al responsable del tratamiento con razón social,
// domicilio y canal de atención reales. Google Play además rechaza fichas cuya
// política de privacidad no identifique al desarrollador — sin esto, la ficha
// queda expuesta a una revisión negativa.

export const ORGANIZATION = {
    brand: 'TeleDeportes',
    site: 'teledeportes.net',
    url: 'https://teledeportes.net',

    legalName: '[RAZÓN SOCIAL PENDIENTE]',
    taxId: '[NIT PENDIENTE]',
    address: '[DIRECCIÓN PENDIENTE]',
    city: 'Santiago de Cali, Valle del Cauca',
    country: 'Colombia',

    email: 'contacto@teledeportes.net',
    privacyEmail: 'privacidad@teledeportes.net',

    // WhatsApp en formato internacional sin signos: 57 + número. Déjalo en
    // null mientras no haya uno real — la interfaz oculta el canal en vez de
    // pintar un enlace roto. Hasta ahora el botón CONTÁCTANOS apuntaba a
    // web.whatsapp.com sin número, que no contacta con nadie.
    whatsapp: null,

    social: {
        facebook: 'https://www.facebook.com',
        instagram: 'https://www.instagram.com',
        youtube: 'https://www.youtube.com',
    },

    // Nombre de la app publicada en Google Play. La política debe cubrir
    // explícitamente lo que recoge la app, no solo el sitio web.
    appName: 'TeleDeportes',
};

// Fecha de última revisión de los documentos legales. Cambiarla cada vez que se
// edite el contenido: es lo que ve el usuario para saber qué versión aceptó, y
// lo que revisa Google Play al comparar la ficha con la política publicada.
export const LEGAL_UPDATED_AT = '2026-08-03';

// Enlace a WhatsApp, o null si no hay número configurado.
export function whatsappUrl(text) {
    if (!ORGANIZATION.whatsapp) return null;
    const query = text ? `?text=${encodeURIComponent(text)}` : '';
    return `https://wa.me/${ORGANIZATION.whatsapp}${query}`;
}
