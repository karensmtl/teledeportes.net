import { useMemo, useState } from 'react';

import {
    MAX_TICKETS_PER_ORDER, PICKER_BLOCK_SIZE, TICKET_PRICE, TICKET_RANGE,
} from '../../../core/constants/rapichontico';
import { IconRefresh, IconSearch } from '../../../common/icons';
import { countAvailable, isAvailable, padTicket, pickRandomAvailable } from '../utils/draw';
import { formatCount, formatMoney } from '../utils/format';

import './styles/ticket-picker.css';

const BLOCK_COUNT = TICKET_RANGE / PICKER_BLOCK_SIZE;

// Selector de boletas. Las 10.000 combinaciones no caben en pantalla ni en el
// DOM, así que se navegan por bloques de 100 (00xx, 01xx, …) con búsqueda
// directa y atajo al azar. Qué boleta está libre lo decide el motor
// determinista, no este componente.
export default function TicketPicker({
    drawId, salesOpen, takenByMe, selected, onToggle, onCheckout,
}) {
    const [block, setBlock] = useState(0);
    const [query, setQuery] = useState('');
    const [onlyFree, setOnlyFree] = useState(false);

    // Al cambiar de sorteo el mapa de disponibilidad es otro, así que la
    // navegación vuelve al principio en vez de dejar al usuario mirando un
    // bloque cuyos estados cambiaron bajo sus pies. Se ajusta durante el render
    // —no en un efecto— para no encadenar un repintado extra cada 3 minutos.
    const [lastDrawId, setLastDrawId] = useState(drawId);
    if (drawId !== lastDrawId) {
        setLastDrawId(drawId);
        setBlock(0);
        setQuery('');
    }

    const availableTotal = useMemo(() => {
        const free = countAvailable(drawId);
        // Lo que el usuario ya compró deja de estar libre para él.
        let mine = 0;
        for (const code of takenByMe) {
            if (isAvailable(drawId, Number(code))) mine += 1;
        }
        return free - mine;
    }, [drawId, takenByMe]);

    const soldTotal = TICKET_RANGE - availableTotal;
    const soldRatio = soldTotal / TICKET_RANGE;

    const numbers = useMemo(() => {
        const start = block * PICKER_BLOCK_SIZE;
        return Array.from({ length: PICKER_BLOCK_SIZE }, (_, i) => start + i);
    }, [block]);

    const searchHit = useMemo(() => {
        if (query.length !== 4) return null;
        const number = Number(query);
        return {
            number,
            code: padTicket(number),
            free: isAvailable(drawId, number) && !takenByMe.has(padTicket(number)),
        };
    }, [query, drawId, takenByMe]);

    const stateOf = (number) => {
        const code = padTicket(number);
        if (selected.includes(code)) return 'selected';
        if (takenByMe.has(code)) return 'mine';
        return isAvailable(drawId, number) ? 'free' : 'taken';
    };

    const handleRandom = () => {
        const number = pickRandomAvailable(drawId, (n) => {
            const code = padTicket(n);
            return takenByMe.has(code) || selected.includes(code);
        });
        if (number === null) return;
        setBlock(Math.floor(number / PICKER_BLOCK_SIZE));
        onToggle(padTicket(number));
    };

    const full = selected.length >= MAX_TICKETS_PER_ORDER;
    const blockLabel = (index) => {
        const start = index * PICKER_BLOCK_SIZE;
        return padTicket(start) + ' – ' + padTicket(start + PICKER_BLOCK_SIZE - 1);
    };

    return (
        <section className="ticket-picker" id="comprar">
            <header className="ticket-picker__head">
                <div>
                    <h2 className="ticket-picker__title">Elige tu boleta</h2>
                    <p className="ticket-picker__subtitle">
                        {formatMoney(TICKET_PRICE)} por boleta · máximo {MAX_TICKETS_PER_ORDER} por compra
                    </p>
                </div>
                <div className="ticket-picker__stock">
                    <strong className="ticket-picker__stock-value">{formatCount(availableTotal)}</strong>
                    <span className="ticket-picker__stock-label">
                        disponibles de {formatCount(TICKET_RANGE)}
                    </span>
                    <div className="ticket-picker__gauge">
                        <span
                            className="ticket-picker__gauge-fill"
                            style={{ '--ticket-picker-sold': soldRatio }}
                        />
                    </div>
                    <span className="ticket-picker__stock-note">
                        {formatCount(soldTotal)} ya tomadas ({Math.round(soldRatio * 100)} %)
                    </span>
                </div>
            </header>

            <div className="ticket-picker__toolbar">
                <label className="ticket-picker__search">
                    <IconSearch size={17} />
                    <input
                        className="ticket-picker__search-input"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="Busca tu número (ej. 4072)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.replace(/\D/g, ''))}
                    />
                </label>

                <div className="ticket-picker__range">
                    <button
                        type="button"
                        className="ticket-picker__step"
                        onClick={() => setBlock((b) => (b - 1 + BLOCK_COUNT) % BLOCK_COUNT)}
                        aria-label="Bloque anterior"
                    >
                        &lsaquo;
                    </button>
                    <select
                        className="ticket-picker__select"
                        value={block}
                        onChange={(e) => setBlock(Number(e.target.value))}
                        aria-label="Rango de números"
                    >
                        {Array.from({ length: BLOCK_COUNT }, (_, i) => (
                            <option key={i} value={i}>{blockLabel(i)}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="ticket-picker__step"
                        onClick={() => setBlock((b) => (b + 1) % BLOCK_COUNT)}
                        aria-label="Bloque siguiente"
                    >
                        &rsaquo;
                    </button>
                </div>

                <button
                    type="button"
                    className="ticket-picker__random"
                    onClick={handleRandom}
                    disabled={!salesOpen || full}
                >
                    <IconRefresh size={15} /> Sorpréndeme
                </button>

                <label className="ticket-picker__filter">
                    <input
                        type="checkbox"
                        checked={onlyFree}
                        onChange={(e) => setOnlyFree(e.target.checked)}
                    />
                    Ocultar tomadas
                </label>
            </div>

            {query.length > 0 && query.length < 4 && (
                <p className="ticket-picker__hint">Escribe las 4 cifras para buscar tu número.</p>
            )}

            {searchHit && (
                <div className={`ticket-picker__result ticket-picker__result--${searchHit.free ? 'free' : 'taken'}`}>
                    <span className="ticket-picker__result-number">{searchHit.code}</span>
                    <span className="ticket-picker__result-text">
                        {searchHit.free
                            ? 'Está libre para este sorteo.'
                            : 'Ya está tomada. Prueba con otra.'}
                    </span>
                    {searchHit.free && (
                        <button
                            type="button"
                            className="ticket-picker__result-cta"
                            disabled={!salesOpen || (full && !selected.includes(searchHit.code))}
                            onClick={() => onToggle(searchHit.code)}
                        >
                            {selected.includes(searchHit.code) ? 'Quitar' : 'Agregar'}
                        </button>
                    )}
                </div>
            )}

            <div className="ticket-picker__grid">
                {numbers.map((number) => {
                    const state = stateOf(number);
                    if (onlyFree && (state === 'taken' || state === 'mine')) return null;
                    const code = padTicket(number);
                    return (
                        <button
                            key={code}
                            type="button"
                            className={`ticket-picker__cell ticket-picker__cell--${state}`}
                            aria-pressed={state === 'selected'}
                            disabled={state === 'taken' || state === 'mine' || !salesOpen
                                || (full && state !== 'selected')}
                            onClick={() => onToggle(code)}
                            title={state === 'mine' ? 'Ya es tuya en este sorteo' : undefined}
                        >
                            {code}
                        </button>
                    );
                })}
            </div>

            <ul className="ticket-picker__legend">
                <li className="ticket-picker__legend-item ticket-picker__legend-item--free">Disponible</li>
                <li className="ticket-picker__legend-item ticket-picker__legend-item--taken">Tomada</li>
                <li className="ticket-picker__legend-item ticket-picker__legend-item--mine">Tuya</li>
                <li className="ticket-picker__legend-item ticket-picker__legend-item--selected">Seleccionada</li>
            </ul>

            <footer className={`ticket-picker__cart${selected.length ? ' ticket-picker__cart--active' : ''}`}>
                <div className="ticket-picker__cart-list">
                    {selected.length === 0
                        ? <span className="ticket-picker__cart-empty">Aún no has elegido ninguna boleta.</span>
                        : selected.map((code) => (
                            <button
                                key={code}
                                type="button"
                                className="ticket-picker__chip"
                                onClick={() => onToggle(code)}
                                aria-label={`Quitar la boleta ${code}`}
                            >
                                {code} <span aria-hidden="true">×</span>
                            </button>
                        ))}
                </div>
                <div className="ticket-picker__cart-total">
                    <span className="ticket-picker__cart-label">Total</span>
                    <strong className="ticket-picker__cart-value">
                        {formatMoney(selected.length * TICKET_PRICE)}
                    </strong>
                </div>
                <button
                    type="button"
                    className="ticket-picker__pay"
                    disabled={selected.length === 0 || !salesOpen}
                    onClick={onCheckout}
                >
                    {salesOpen ? 'Ir a pagar' : 'Ventas cerradas'}
                </button>
            </footer>
        </section>
    );
}
