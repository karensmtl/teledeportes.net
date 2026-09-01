import { useMemo } from 'react';

import { HISTORY_SIZE, PRIZE_TIERS } from '../../../core/constants/rapichontico';
import { evaluateTicket, pastDraws } from '../utils/draw';
import { formatMoney, formatStamp } from '../utils/format';

import './styles/draw-history.css';

// Histórico de sorteos ya cerrados. Los resultados no se guardan en ninguna
// parte: se recalculan del identificador del sorteo, así que la tabla es la
// misma en cualquier navegador y a cualquier hora.

export default function DrawHistory({ currentDrawId, tickets }) {
    const rows = useMemo(() => {
        const byDraw = new Map();
        for (const ticket of tickets) {
            if (!byDraw.has(ticket.drawId)) byDraw.set(ticket.drawId, []);
            byDraw.get(ticket.drawId).push(ticket);
        }
        return pastDraws(currentDrawId, HISTORY_SIZE).map((draw) => {
            const mine = byDraw.get(draw.drawId) || [];
            const wins = mine
                .map((ticket) => evaluateTicket(ticket.number, draw.number))
                .filter(Boolean);
            return {
                ...draw,
                mine: mine.length,
                won: wins.reduce((sum, tier) => sum + tier.prize, 0),
            };
        });
    }, [currentDrawId, tickets]);

    return (
        <section className="draw-history">
            <header className="draw-history__head">
                <div>
                    <h2 className="draw-history__title">Histórico de sorteos</h2>
                    <p className="draw-history__subtitle">
                        Los últimos {HISTORY_SIZE} resultados, uno cada 3 minutos.
                    </p>
                </div>
            </header>

            <div className="draw-history__scroll">
                <table className="draw-history__table">
                    <thead>
                        <tr>
                            <th scope="col">Sorteo</th>
                            <th scope="col">Cerró</th>
                            <th scope="col">Resultado</th>
                            <th scope="col">Tus boletas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.drawId}
                                className={row.won > 0 ? 'draw-history__row draw-history__row--win' : 'draw-history__row'}
                            >
                                <td className="draw-history__id">#{row.drawId}</td>
                                <td className="draw-history__when">{formatStamp(row.closedAt)}</td>
                                <td>
                                    <span className="draw-history__number">
                                        {row.number.split('').map((digit, index) => (
                                            <b key={index} className="draw-history__digit">{digit}</b>
                                        ))}
                                    </span>
                                </td>
                                <td className="draw-history__mine">
                                    {row.mine === 0 && <span className="draw-history__none">—</span>}
                                    {row.mine > 0 && row.won === 0 && (
                                        <span>{row.mine} · sin premio</span>
                                    )}
                                    {row.won > 0 && (
                                        <span className="draw-history__win">
                                            {row.mine} · {formatMoney(row.won)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="draw-history__prizes">
                <h3 className="draw-history__prizes-title">Plan de premios</h3>
                <ul className="draw-history__prize-list">
                    {PRIZE_TIERS.map((tier) => (
                        <li key={tier.key} className="draw-history__prize">
                            <span className="draw-history__prize-label">{tier.label}</span>
                            <span className="draw-history__prize-detail">{tier.detail}</span>
                            <span className="draw-history__prize-value">{formatMoney(tier.prize)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
