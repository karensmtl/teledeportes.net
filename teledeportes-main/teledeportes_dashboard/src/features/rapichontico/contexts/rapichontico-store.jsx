import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DRAW_INTERVAL_MS, TICKET_PRICE } from '../../../core/constants/rapichontico';
import { STORAGE_KEYS } from '../../../core/constants/storage';
import { drawStateAt, evaluateTicket, winningNumber } from '../utils/draw';

// Estado del demo. No hay backend: las boletas viven en `localStorage` y el
// sorteo se calcula del reloj, así que esto NO es estado de servidor y por tanto
// no pasa por TanStack Query (TSS vite/03 rige respuestas del backend).

const RapichonticoContext = createContext(null);

/** Cada cuánto repinta el reloj. 250 ms basta para una regresiva en segundos. */
const TICK_MS = 250;

function readTickets() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEYS.RAPI_TICKETS);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        // Storage lleno, deshabilitado o JSON corrupto: el demo arranca vacío.
        return [];
    }
}

export function RapichonticoProvider({ children }) {
    const [now, setNow] = useState(() => Date.now());
    const [tickets, setTickets] = useState(readTickets);

    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEYS.RAPI_TICKETS, JSON.stringify(tickets));
        } catch {
            // Persistir es un lujo del demo; si falla, la sesión sigue en memoria.
        }
    }, [tickets]);

    const draw = useMemo(() => drawStateAt(now), [now]);

    // Números que el usuario ya compró en el sorteo abierto: no se pueden volver
    // a comprar aunque el generador los siga marcando como libres.
    const takenByMe = useMemo(() => {
        const set = new Set();
        for (const ticket of tickets) {
            if (ticket.drawId === draw.drawId) set.add(ticket.number);
        }
        return set;
    }, [tickets, draw.drawId]);

    const buy = useCallback((order) => {
        const purchasedAt = Date.now();
        const orderId = `RPC-${purchasedAt.toString(36).toUpperCase()}`;
        const created = order.numbers.map((number, index) => ({
            id: `${orderId}-${index}`,
            orderId,
            number,
            drawId: order.drawId,
            drawAt: order.drawAt,
            price: TICKET_PRICE,
            purchasedAt,
            payment: order.payment,
        }));
        setTickets((current) => [...created, ...current]);
        return { orderId, tickets: created };
    }, []);

    const clearTickets = useCallback(() => setTickets([]), []);

    // Una boleta solo se resuelve cuando su sorteo ya cerró. Antes de eso sigue
    // "en juego" aunque el número ganador ya esté decidido — enseñarlo antes
    // arruinaría el sorteo.
    const resolvedTickets = useMemo(() => tickets.map((ticket) => {
        const settled = now >= ticket.drawAt + DRAW_INTERVAL_MS
            || (ticket.drawId < draw.drawId);
        if (!settled) return { ...ticket, status: 'PENDING', winning: null, tier: null };
        const winning = winningNumber(ticket.drawId);
        const tier = evaluateTicket(ticket.number, winning);
        return { ...ticket, status: tier ? 'WON' : 'LOST', winning, tier };
    }), [tickets, now, draw.drawId]);

    const totals = useMemo(() => resolvedTickets.reduce((acc, ticket) => {
        acc.spent += ticket.price;
        if (ticket.status === 'WON') acc.won += ticket.tier.prize;
        if (ticket.status === 'PENDING') acc.pending += 1;
        return acc;
    }, { spent: 0, won: 0, pending: 0 }), [resolvedTickets]);

    const value = useMemo(() => ({
        now, draw, tickets: resolvedTickets, takenByMe, totals, buy, clearTickets,
        ticketsInDraw: resolvedTickets.filter((t) => t.drawId === draw.drawId).length,
    }), [now, draw, resolvedTickets, takenByMe, totals, buy, clearTickets]);

    return <RapichonticoContext.Provider value={value}>{children}</RapichonticoContext.Provider>;
}

export function useRapichontico() {
    const context = useContext(RapichonticoContext);
    if (!context) throw new Error('useRapichontico debe usarse dentro de <RapichonticoProvider>');
    return context;
}
