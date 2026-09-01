// TSS vite/02 — constantes centralizadas del demo de lotería Rapichontico.
//
// TODO EL MÓDULO ES UNA SIMULACIÓN: no hay backend, no hay dinero real y no se
// emite ninguna boleta con validez legal. Los sorteos se derivan del reloj con
// una función determinista (ver `features/rapichontico/utils/draw.js`), así que
// dos navegadores abiertos a la misma hora ven exactamente el mismo resultado.

/** Un sorteo cada 3 minutos. */
export const DRAW_INTERVAL_MS = 3 * 60 * 1000;

/** Origen de la numeración de sorteos. Fijarlo hace que el #N sea estable. */
export const DRAW_EPOCH_MS = Date.UTC(2026, 0, 1, 0, 0, 0);

/** Boletas de 4 dígitos: 0000–9999. */
export const TICKET_DIGITS = 4;
export const TICKET_RANGE = 10 ** TICKET_DIGITS;

/** Valor de la boleta (COP). */
export const TICKET_PRICE = 5000;

/** Máximo de boletas por compra — evita carritos absurdos en el demo. */
export const MAX_TICKETS_PER_ORDER = 10;

// ---- ventana del ciclo (ms transcurridos dentro del sorteo) ----

/** Las ventas cierran 20 s antes del cierre del ciclo. */
export const SALES_CLOSE_AT_MS = DRAW_INTERVAL_MS - 20_000;

/** Cada dígito se destapa con este intervalo durante el sorteo. */
export const REVEAL_STEP_MS = 3500;

/** Fin de la revelación: 160 s + 4 × 3,5 s = 174 s. Los últimos 6 s son remate. */
export const REVEAL_END_MS = SALES_CLOSE_AT_MS + TICKET_DIGITS * REVEAL_STEP_MS;

// ---- disponibilidad simulada ----

/** Fracción de boletas libres al abrir el sorteo. El resto nacen "tomadas". */
export const AVAILABILITY_MIN = 0.12;
export const AVAILABILITY_MAX = 0.42;

/** Tamaño del bloque que se pinta en la grilla del selector. */
export const PICKER_BLOCK_SIZE = 100;

/** Sorteos que muestra el histórico. */
export const HISTORY_SIZE = 24;

// ---- premios ----

// Escalera clásica de 4 cifras. `match` lo resuelve `evaluateTicket`.
export const PRIZE_TIERS = [
    { key: 'MAYOR',    label: 'Premio mayor',      detail: 'Las 4 cifras en orden',  prize: 40_000_000 },
    { key: 'DESORDEN', label: 'Cuatro en desorden', detail: 'Las 4 cifras revueltas', prize: 800_000 },
    { key: 'TRES',     label: 'Tres últimas',       detail: 'Las 3 últimas cifras',   prize: 400_000 },
    { key: 'DOS',      label: 'Dos últimas',        detail: 'Las 2 últimas cifras',   prize: 40_000 },
    { key: 'UNA',      label: 'Reintegro',          detail: 'La última cifra',        prize: TICKET_PRICE },
];

// ---- pago ficticio ----

export const PAYMENT_METHODS = [
    { key: 'CARD', label: 'Tarjeta', hint: 'Débito o crédito' },
    { key: 'PSE',  label: 'PSE',     hint: 'Débito bancario' },
    { key: 'WALLET', label: 'Billetera', hint: 'Nequi / Daviplata' },
];

// Números de prueba de la industria: pasan Luhn y no corresponden a ninguna
// tarjeta emitida. Se muestran en pantalla para que el demo sea usable.
export const DEMO_CARDS = [
    { brand: 'Visa',       number: '4242424242424242' },
    { brand: 'Mastercard', number: '5555555555554444' },
    { brand: 'Amex',       number: '378282246310005' },
];

export const DEMO_BANKS = [
    'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA Colombia', 'Nequi',
];

/** Latencia simulada de la pasarela. */
export const CHECKOUT_LATENCY_MS = 1800;
