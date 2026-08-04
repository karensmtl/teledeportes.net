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

    // Nombre de la app publicada en Google Play. La política debe cubrir
    // explícitamente lo que recoge la app, no solo el sitio web.
    appName: 'TeleDeportes',
};

// Fecha de última revisión de los documentos legales. Cambiarla cada vez que se
// edite el contenido: es lo que ve el usuario para saber qué versión aceptó, y
// lo que revisa Google Play al comparar la ficha con la política publicada.
export const LEGAL_UPDATED_AT = '2026-08-03';
