import { useMemo, useState } from 'react';

import { formatCount, formatMoney, formatStamp } from '../utils/format';

import './styles/my-tickets.css';

// Boletas guardadas del usuario. Vienen ya resueltas del store: cada una sabe si
// sigue en juego, si perdió o qué escalón de premio acertó.

const FILTERS = [
    { key: 'ALL', label: 'Todas' },
    { key: 'PENDING', label: 'En juego' },
    { key: 'WON', label: 'Premiadas' },
    { key: 'LOST', label: 'Sin premio' },
];

const STATUS_TEXT = {
    PENDING: 'En juego',
    WON: 'Premiada',
    LOST: 'Sin premio',
};

export default function MyTickets({ tickets, totals, currentDrawId, onGoBuy, onClear }) {
    const [filter, setFilter] = useState('ALL');

    const visible = useMemo(
        () => (filter === 'ALL' ? tickets : tickets.filter((t) => t.status === filter)),
        [tickets, filter],
    );

    // Agrupadas por sorteo: es la unidad que le importa al usuario, y de paso
    // evita repetir la cabecera de sorteo en cada boleta.
    const groups = useMemo(() => {
        const byDraw = new Map();
        for (const ticket of visible) {
            if (!byDraw.has(ticket.drawId)) byDraw.set(ticket.drawId, []);
            byDraw.get(ticket.drawId).push(ticket);
        }
        return [...byDraw.entries()].sort((a, b) => b[0] - a[0]);
    }, [visible]);

    if (tickets.length === 0) {
        return (
            <section className="my-tickets my-tickets--empty">
                <h2 className="my-tickets__title">Todavía no tienes boletas</h2>
                <p className="my-tickets__empty-text">
                    Elige un número, paga con los datos de prueba y quedará guardado aquí
                    hasta que sepas si ganó.
                </p>
                <button type="button" className="my-tickets__cta" onClick={onGoBuy}>
                    Comprar mi primera boleta
                </button>
            </section>
        );
    }

    return (
        <section className="my-tickets">
            <header className="my-tickets__head">
                <h2 className="my-tickets__title">Mis boletas</h2>
                <button type="button" className="my-tickets__clear" onClick={onClear}>
                    Vaciar demo
                </button>
            </header>

            <dl className="my-tickets__stats">
                <div className="my-tickets__stat">
                    <dt>Boletas</dt>
                    <dd>{formatCount(tickets.length)}</dd>
                </div>
                <div className="my-tickets__stat">
                    <dt>Invertido</dt>
                    <dd>{formatMoney(totals.spent)}</dd>
                </div>
                <div className={`my-tickets__stat${totals.won > 0 ? ' my-tickets__stat--win' : ''}`}>
                    <dt>Ganado</dt>
                    <dd>{formatMoney(totals.won)}</dd>
                </div>
                <div className="my-tickets__stat">
                    <dt>En juego</dt>
                    <dd>{formatCount(totals.pending)}</dd>
                </div>
            </dl>

            <div className="my-tickets__filters">
                {FILTERS.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        className={`my-tickets__filter${filter === option.key ? ' my-tickets__filter--active' : ''}`}
                        onClick={() => setFilter(option.key)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {groups.length === 0 && (
                <p className="my-tickets__empty-text">
                    Ninguna boleta en esta categoría.
                </p>
            )}

            {groups.map(([drawId, group]) => (
                <article key={drawId} className="my-tickets__group">
                    <header className="my-tickets__group-head">
                        <h3 className="my-tickets__group-title">
                            Sorteo #{drawId}
                            {drawId === currentDrawId && (
                                <span className="my-tickets__live">en curso</span>
                            )}
                        </h3>
                        <span className="my-tickets__group-meta">
                            {group[0].winning
                                ? `Ganador ${group[0].winning}`
                                : 'Resultado pendiente'}
                        </span>
                    </header>

                    <ul className="my-tickets__list">
                        {group.map((ticket) => (
                            <li
                                key={ticket.id}
                                className={`my-tickets__ticket my-tickets__ticket--${ticket.status.toLowerCase()}`}
                            >
                                <span className="my-tickets__number">
                                    {ticket.number.split('').map((digit, index) => (
                                        <b key={index} className="my-tickets__digit">{digit}</b>
                                    ))}
                                </span>
                                <div className="my-tickets__detail">
                                    <span className="my-tickets__status">{STATUS_TEXT[ticket.status]}</span>
                                    {ticket.tier && (
                                        <span className="my-tickets__prize">
                                            {ticket.tier.label} · {formatMoney(ticket.tier.prize)}
                                        </span>
                                    )}
                                    <span className="my-tickets__meta">
                                        {formatStamp(ticket.purchasedAt)} · {ticket.payment.label}
                                    </span>
                                </div>
                                <span className="my-tickets__order">{ticket.orderId}</span>
                            </li>
                        ))}
                    </ul>
                </article>
            ))}
        </section>
    );
}
