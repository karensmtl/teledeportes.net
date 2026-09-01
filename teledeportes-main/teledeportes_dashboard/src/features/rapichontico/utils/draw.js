import {
    AVAILABILITY_MAX, AVAILABILITY_MIN, DRAW_EPOCH_MS, DRAW_INTERVAL_MS,
    PRIZE_TIERS, REVEAL_END_MS, REVEAL_STEP_MS, SALES_CLOSE_AT_MS,
    TICKET_DIGITS, TICKET_RANGE,
} from '../../../core/constants/rapichontico';

// Motor del sorteo. Es determinista a propósito: el número ganador y el mapa de
// boletas tomadas salen de un hash del identificador del sorteo, no de
// `Math.random()`. Gracias a eso el histórico es coherente al recargar, dos
// pestañas ven lo mismo, y el resultado que se "destapa" ya estaba decidido
// antes de que empiece la animación — que es como debe comportarse un sorteo.

// Mezclador entero de 32 bits (variante de splitmix32). Barato y bien repartido.
function mix32(value) {
    let h = value >>> 0;
    h ^= h >>> 16;
    h = Math.imul(h, 0x7feb352d);
    h ^= h >>> 15;
    h = Math.imul(h, 0x846ca68b);
    h ^= h >>> 16;
    return h >>> 0;
}

function hash2(a, b) {
    return mix32(mix32(a) ^ Math.imul(b >>> 0, 0x9e3779b1));
}

/** Hash → real en [0, 1). */
function unit(value) {
    return value / 4294967296;
}

/** Identificador del sorteo que contiene ese instante. */
export function drawIdAt(timestamp) {
    return Math.floor((timestamp - DRAW_EPOCH_MS) / DRAW_INTERVAL_MS);
}

/** Instante en que abre el sorteo. */
export function drawStartAt(drawId) {
    return DRAW_EPOCH_MS + drawId * DRAW_INTERVAL_MS;
}

/** Instante en que cierra (y en que ya está revelado). */
export function drawEndAt(drawId) {
    return drawStartAt(drawId) + DRAW_INTERVAL_MS;
}

/** Número ganador, como string de 4 dígitos con ceros a la izquierda. */
export function winningNumber(drawId) {
    return String(hash2(drawId, 0x5241_5049) % TICKET_RANGE).padStart(TICKET_DIGITS, '0');
}

/** Fracción de boletas libres con la que nace este sorteo. */
export function availabilityRatio(drawId) {
    const t = unit(hash2(drawId, 0x4156_4c42));
    return AVAILABILITY_MIN + t * (AVAILABILITY_MAX - AVAILABILITY_MIN);
}

/** ¿Está libre esa boleta en ese sorteo? */
export function isAvailable(drawId, number) {
    return unit(hash2(drawId ^ 0x7c3f_0e11, number)) < availabilityRatio(drawId);
}

// El conteo recorre las 10.000 combinaciones: barato una vez, caro 4 veces por
// segundo. Se memoiza por sorteo, y el mapa se poda para no crecer sin techo.
const availableCountCache = new Map();

export function countAvailable(drawId) {
    const cached = availableCountCache.get(drawId);
    if (cached !== undefined) return cached;

    let total = 0;
    for (let number = 0; number < TICKET_RANGE; number += 1) {
        if (isAvailable(drawId, number)) total += 1;
    }
    if (availableCountCache.size > 64) availableCountCache.clear();
    availableCountCache.set(drawId, total);
    return total;
}

/**
 * Estado del sorteo en curso para un instante dado.
 *
 * El ciclo de 3 minutos se reparte en tres fases: venta abierta con cuenta
 * regresiva, revelación cifra a cifra (ya sin ventas) y resultado en firme
 * hasta que arranca el siguiente.
 */
export function drawStateAt(timestamp) {
    const drawId = drawIdAt(timestamp);
    const startAt = drawStartAt(drawId);
    const endAt = startAt + DRAW_INTERVAL_MS;
    const elapsed = timestamp - startAt;
    const number = winningNumber(drawId);

    let phase = 'countdown';
    let revealedCount = 0;
    if (elapsed >= REVEAL_END_MS) {
        phase = 'revealed';
        revealedCount = TICKET_DIGITS;
    } else if (elapsed >= SALES_CLOSE_AT_MS) {
        phase = 'drawing';
        revealedCount = Math.min(
            TICKET_DIGITS,
            Math.floor((elapsed - SALES_CLOSE_AT_MS) / REVEAL_STEP_MS),
        );
    }

    return {
        drawId,
        startAt,
        endAt,
        elapsed,
        phase,
        revealedCount,
        salesOpen: phase === 'countdown',
        msLeft: Math.max(0, endAt - timestamp),
        msToClose: Math.max(0, startAt + SALES_CLOSE_AT_MS - timestamp),
        progress: Math.min(1, Math.max(0, elapsed / DRAW_INTERVAL_MS)),
        number,
        // Durante la cuenta regresiva el resultado existe pero no se enseña.
        digits: phase === 'countdown' ? Array(TICKET_DIGITS).fill('·') : number.split(''),
    };
}

/** Los `count` sorteos ya cerrados, del más reciente al más antiguo. */
export function pastDraws(currentDrawId, count) {
    const list = [];
    for (let i = 1; i <= count; i += 1) {
        const drawId = currentDrawId - i;
        if (drawId < 0) break;
        list.push({ drawId, number: winningNumber(drawId), closedAt: drawEndAt(drawId) });
    }
    return list;
}

// Dos números tienen las mismas cifras revueltas si sus dígitos ordenados
// coinciden. Comparar strings ordenados es suficiente para 4 caracteres.
function sameDigits(a, b) {
    return a.split('').sort().join('') === b.split('').sort().join('');
}

/**
 * Premio de una boleta contra un ganador. Devuelve el primer escalón que
 * acierta (el de mayor valor) o `null` si no hay premio.
 */
export function evaluateTicket(ticketNumber, winning) {
    if (!ticketNumber || !winning) return null;
    for (const tier of PRIZE_TIERS) {
        const hit = tier.key === 'MAYOR' ? ticketNumber === winning
            : tier.key === 'DESORDEN' ? sameDigits(ticketNumber, winning)
            : tier.key === 'TRES' ? ticketNumber.slice(-3) === winning.slice(-3)
            : tier.key === 'DOS' ? ticketNumber.slice(-2) === winning.slice(-2)
            : ticketNumber.slice(-1) === winning.slice(-1);
        if (hit) return tier;
    }
    return null;
}

/** Número aleatorio disponible en ese sorteo, o `null` si no queda ninguno. */
export function pickRandomAvailable(drawId, isTaken) {
    // Con 12–42 % libre, 200 intentos fallan con probabilidad despreciable; el
    // barrido posterior es la red de seguridad para un sorteo casi agotado.
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const number = Math.floor(Math.random() * TICKET_RANGE);
        if (isAvailable(drawId, number) && !isTaken(number)) return number;
    }
    for (let number = 0; number < TICKET_RANGE; number += 1) {
        if (isAvailable(drawId, number) && !isTaken(number)) return number;
    }
    return null;
}

/** 4072 → '4072'. Acepta número o string. */
export function padTicket(value) {
    return String(value).padStart(TICKET_DIGITS, '0');
}
