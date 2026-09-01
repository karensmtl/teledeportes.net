import { useEffect, useState } from 'react';
import './styles/draw-stage.css';

const NOISE_TICK_MS = 72;
const IMMINENT_THRESHOLD_MS = 10000;

function formatClock(msLeft) {
    const totalSeconds = Math.max(0, Math.ceil(msLeft / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function formatCount(value) {
    return Number(value || 0).toLocaleString('es-CO');
}

export default function DrawStage({
    phase,
    digits,
    revealedCount,
    msLeft,
    progress,
    drawLabel,
    drawTime,
    soldCount,
    availableCount,
    myTicketsInDraw,
    onBuy,
}) {
    // Ruido visual de los slots que aún ruedan. Es pura decoración:
    // el resultado real solo sale de `digits` + `revealedCount`.
    const [noise, setNoise] = useState(['7', '2', '9', '4']);

    useEffect(() => {
        if (phase !== 'drawing') return undefined;
        // Quien pide menos movimiento no recibe el barajado rápido de cifras.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const timer = setInterval(() => {
            setNoise(Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 10))));
        }, NOISE_TICK_MS);
        return () => clearInterval(timer);
    }, [phase]);

    const imminent = phase === 'countdown' && msLeft < IMMINENT_THRESHOLD_MS;
    const clock = formatClock(msLeft);

    const rootClasses = [
        'draw-stage',
        `draw-stage--${phase}`,
        imminent ? 'draw-stage--imminent' : '',
    ].filter(Boolean).join(' ');

    let statusText = 'Próximo sorteo en camino';
    if (imminent) statusText = '¡Últimos segundos!';
    if (phase === 'drawing') statusText = 'Sorteo en curso';
    if (phase === 'revealed') statusText = 'Resultado oficial';

    let boardLabel = 'Esperando el próximo sorteo';
    if (phase === 'drawing') boardLabel = `Sorteo en curso, ${revealedCount} de 4 dígitos revelados`;
    if (phase === 'revealed') boardLabel = `Número ganador ${digits.join(' ')}`;

    return (
        <section
            className={rootClasses}
            style={{ '--draw-stage-progress': progress }}
            aria-label={`Rapichontico, ${drawLabel}`}
        >
            <div className='draw-stage__glow' aria-hidden='true' />

            <header className='draw-stage__topbar'>
                <p className='draw-stage__brand'>
                    <span className='draw-stage__brand-rapi'>Rapi</span>
                    <span className='draw-stage__brand-chontico'>chontico</span>
                </p>
                <p className='draw-stage__meta'>
                    <span className='draw-stage__meta-label'>{drawLabel}</span>
                    <span className='draw-stage__meta-dot' aria-hidden='true'>·</span>
                    <span className='draw-stage__meta-time'>{drawTime}</span>
                </p>
            </header>

            <div className='draw-stage__arena'>
                <div className='draw-stage__board' role='img' aria-label={boardLabel}>
                    {digits.map((digit, index) => {
                        const isRevealed = phase === 'revealed'
                            || (phase === 'drawing' && index < revealedCount);
                        const isRolling = phase === 'drawing' && !isRevealed;
                        const slotClasses = [
                            'draw-stage__digit',
                            phase === 'countdown' ? 'draw-stage__digit--idle' : '',
                            isRolling ? 'draw-stage__digit--rolling' : '',
                            isRevealed ? 'draw-stage__digit--revealed' : '',
                        ].filter(Boolean).join(' ');
                        let value = '·';
                        if (isRevealed) value = digit;
                        else if (isRolling) value = noise[index];
                        return (
                            <span
                                key={index}
                                className={slotClasses}
                                style={{ '--draw-stage-slot': index }}
                            >
                                <span className='draw-stage__digit-value'>{value}</span>
                            </span>
                        );
                    })}
                    <span className='draw-stage__sheen' aria-hidden='true' />
                </div>

                <aside className='draw-stage__timer'>
                    <div className='draw-stage__dial'>
                        <svg className='draw-stage__ring' viewBox='0 0 120 120' aria-hidden='true'>
                            <circle className='draw-stage__ring-track' cx='60' cy='60' r='54' pathLength='100' />
                            <circle className='draw-stage__ring-fill' cx='60' cy='60' r='54' pathLength='100' />
                        </svg>
                        <div className='draw-stage__dial-center'>
                            {phase === 'drawing' ? (
                                <span className='draw-stage__live'>
                                    <span className='draw-stage__live-dot' aria-hidden='true' />
                                    En vivo
                                </span>
                            ) : (
                                <span className='draw-stage__clock'>{clock}</span>
                            )}
                            <span className='draw-stage__dial-caption'>
                                {phase === 'drawing' ? 'sorteando' : 'próximo sorteo'}
                            </span>
                        </div>
                    </div>
                    <p className='draw-stage__status' aria-live='polite'>{statusText}</p>
                </aside>
            </div>

            <footer className='draw-stage__footer'>
                <dl className='draw-stage__stats'>
                    <div className='draw-stage__stat'>
                        <dt className='draw-stage__stat-label'>Vendidas</dt>
                        <dd className='draw-stage__stat-value'>{formatCount(soldCount)}</dd>
                    </div>
                    <div className='draw-stage__stat'>
                        <dt className='draw-stage__stat-label'>Disponibles</dt>
                        <dd className='draw-stage__stat-value'>{formatCount(availableCount)}</dd>
                    </div>
                    <div
                        className={
                            'draw-stage__stat'
                            + (myTicketsInDraw > 0 ? ' draw-stage__stat--mine' : '')
                        }
                    >
                        <dt className='draw-stage__stat-label'>Mis boletas</dt>
                        <dd className='draw-stage__stat-value'>{formatCount(myTicketsInDraw)}</dd>
                    </div>
                </dl>
                <button type='button' className='draw-stage__cta' onClick={onBuy}>
                    <svg
                        className='draw-stage__cta-icon'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                        focusable='false'
                    >
                        <path
                            fill='currentColor'
                            d='M4 6a2 2 0 0 0-2 2v2.5a1.5 1.5 0 0 1 0 3V16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1.5 1.5 0 0 1 0-3V8a2 2 0 0 0-2-2H4zm10 2h2v2h-2V8zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2z'
                        />
                    </svg>
                    Comprar boleta
                </button>
            </footer>
        </section>
    );
}
