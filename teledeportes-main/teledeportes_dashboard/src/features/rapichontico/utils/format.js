// Formateo local del demo. Los `Intl` se crean una sola vez: instanciarlos en
// cada render sale caro y aquí el reloj repinta cuatro veces por segundo.

const currency = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat('es-CO');

const clock = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' });

const stamp = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
});

/** 40000000 → "$ 40.000.000". */
export function formatMoney(value) {
    return currency.format(value || 0);
}

/** 1539 → "1.539". */
export function formatCount(value) {
    return integer.format(value || 0);
}

/** Marca de tiempo → "18:42". */
export function formatClock(timestamp) {
    return clock.format(new Date(timestamp));
}

/** Marca de tiempo → "31 ago, 18:42". */
export function formatStamp(timestamp) {
    return stamp.format(new Date(timestamp));
}

/** 95_000 → "1:35". Redondea hacia arriba para que nunca se vea 0:00 con tiempo. */
export function formatCountdown(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** "4242424242424242" → "4242 4242 4242 4242". */
export function groupCardNumber(digits) {
    return (digits.match(/.{1,4}/g) || []).join(' ');
}

/** Marca deducida del primer dígito. Suficiente para un formulario ficticio. */
export function cardBrand(digits) {
    if (digits.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(digits)) return 'Mastercard';
    if (/^3[47]/.test(digits)) return 'Amex';
    if (digits.startsWith('6')) return 'Discover';
    return 'Tarjeta';
}

/** Luhn. Se valida aunque el pago sea de mentira: enseña el error a tiempo. */
export function passesLuhn(digits) {
    if (digits.length < 13) return false;
    let sum = 0;
    let double = false;
    for (let i = digits.length - 1; i >= 0; i -= 1) {
        let d = Number(digits[i]);
        if (double) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        double = !double;
    }
    return sum % 10 === 0;
}

/** "1226" → válido si es un mes real y no está vencido. */
export function expiryError(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 4) return 'Usa el formato MM/AA.';
    const month = Number(digits.slice(0, 2));
    const year = 2000 + Number(digits.slice(2));
    if (month < 1 || month > 12) return 'Ese mes no existe.';
    const now = new Date();
    const expires = new Date(year, month, 1);
    if (expires <= now) return 'La tarjeta está vencida.';
    return null;
}
