import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';

import { HERO_ROTATE_MS, HERO_SWIPE_PX } from '../../../core/constants/hero';
import { resolveLiveSource, resolveHeroHls } from '../../live/playback';
import LivePlayer from '../../live/components/live-player';
import ChannelBrand from '../../live/components/channel-brand';

// Ambient live background — plays the channel's HLS muted (autoplay-safe) so the
// hero shows the live signal straight away, behind the gradient + caption.
function AmbientLive({ src, poster }) {
    const ref = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        const v = ref.current;
        if (!v || !src) return undefined;
        v.muted = true;
        const play = () => v.play().catch(() => {});
        if (v.canPlayType('application/vnd.apple.mpegurl')) {
            v.src = src; play();
        } else if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(v);
            hls.on(Hls.Events.MANIFEST_PARSED, play);
        } else {
            v.src = src; play();
        }
        return () => {
            if (hlsRef.current) { try { hlsRef.current.destroy(); } catch { /* gone */ } hlsRef.current = null; }
            v.removeAttribute('src');
        };
    }, [src]);

    return <video ref={ref} className="rlive__bg" poster={poster || undefined} muted playsInline autoPlay loop />;
}

// Home hero — carrusel de los canales al aire. Cada diapositiva muestra la señal
// en vivo de fondo, la marca del canal y el botón "Ver directo", que abre el
// reproductor completo (con sonido y controles).
//
// Rotación automática con matices: cambiar de canal derriba y reconstruye una
// conexión HLS, así que se pausa en cuanto la persona interactúa (hover, foco,
// flecha, punto o gesto) y se detiene del todo al abrir el reproductor. Con
// `prefers-reduced-motion` no arranca nunca.
export default function HeroLive({ channels = [] }) {
    const list = channels.filter(Boolean);
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [held, setHeld] = useState(false);   // rotación en pausa por interacción
    const touchX = useRef(null);

    // Si un canal sale del aire la lista se acorta: no dejar el índice fuera.
    const safeIndex = list.length ? Math.min(index, list.length - 1) : 0;
    const channel = list[safeIndex] || null;
    const many = list.length > 1;

    // Sin useCallback: `list` se deriva de las props en cada render, así que el
    // compilador de React no puede preservar la memoización — y aquí no aporta,
    // los manejadores se usan en línea.
    const goTo = (next) => {
        if (!list.length) return;
        setHeld(true);
        setIndex(((next % list.length) + list.length) % list.length);
    };

    // Rotación automática.
    useEffect(() => {
        if (!many || playing || held) return undefined;
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return undefined;
        const id = window.setInterval(
            () => setIndex(i => (i + 1) % list.length),
            HERO_ROTATE_MS,
        );
        return () => window.clearInterval(id);
    }, [many, playing, held, list.length]);

    const source = channel ? resolveLiveSource(channel) : { kind: 'none' };
    const inlinePlayable = source.kind === 'hls' || source.kind === 'webrtc';
    const heroHls = channel ? resolveHeroHls(channel) : null;

    // Full player (sound + controls) after "Ver directo".
    if (channel && inlinePlayable && playing) {
        return (
            <section className="rlive rlive--playing">
                <div className="rlive__player">
                    <LivePlayer channel={channel} />
                    {channel.slug && (
                        <Link to={`/vivo/${channel.slug}`} className="rlive__player-link">Ver canal →</Link>
                    )}
                </div>
            </section>
        );
    }

    let cta;
    if (channel && inlinePlayable) {
        cta = (
            <button type="button" className="rlive__cta" onClick={() => setPlaying(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
                Ver directo
            </button>
        );
    } else if (channel) {
        cta = <Link to={`/vivo/${channel.slug}`} className="rlive__cta">Ver directo</Link>;
    } else {
        cta = <Link to="/vivo" className="rlive__cta">Ver canales</Link>;
    }

    return (
        <section
            className="rlive"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
        >
            <div
                className="rlive__banner"
                onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX; }}
                onTouchEnd={(e) => {
                    if (touchX.current === null) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    touchX.current = null;
                    if (Math.abs(dx) > HERO_SWIPE_PX) goTo(safeIndex + (dx < 0 ? 1 : -1));
                }}
            >
                {/* `key` fuerza el remontaje: cada canal abre su propia conexión. */}
                {heroHls
                    ? <AmbientLive key={channel.slug} src={heroHls} poster={channel?.thumbnailUrl} />
                    : (channel?.thumbnailUrl && <img className="rlive__bg" src={channel.thumbnailUrl} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
                <div className="rlive__scrim" />

                {many && (
                    <>
                        <button
                            type="button"
                            className="rlive__arrow rlive__arrow--prev"
                            aria-label="Canal anterior"
                            data-tv-focusable
                            onClick={() => goTo(safeIndex - 1)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <button
                            type="button"
                            className="rlive__arrow rlive__arrow--next"
                            aria-label="Canal siguiente"
                            data-tv-focusable
                            onClick={() => goTo(safeIndex + 1)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </>
                )}

                <div className="rlive__inner">
                    <div className="rlive__top">
                        {channel && (
                            <span className="rlive__live"><span className="rlive__live-dot" /> EN DIRECTO</span>
                        )}
                        {many && (
                            <span className="rlive__count">{safeIndex + 1} / {list.length} al aire</span>
                        )}
                    </div>
                    <div className="rlive__bottom">
                        <div className="rlive__caption">
                            {/* The channel's own logo is the headline — no eyebrow, no big
                                name. The name stays as the <h1> (SEO, screen readers) but
                                rendered small underneath the mark. */}
                            {channel ? (
                                <ChannelBrand channel={channel} size="lg" align="start" nameAs="h1" className="rlive__brand" />
                            ) : (
                                <>
                                    <div className="rlive__eyebrow">TeleDeportes</div>
                                    <h1 className="rlive__title">Sin transmisión en directo</h1>
                                </>
                            )}
                            {channel?.description && <p className="rlive__sub">{channel.description}</p>}
                        </div>
                        <div className="rlive__cta-row">{cta}</div>
                    </div>

                    {many && (
                        <div className="rlive__dots" role="tablist" aria-label="Canales al aire">
                            {list.map((c, i) => (
                                <button
                                    key={c.slug || i}
                                    type="button"
                                    role="tab"
                                    aria-selected={i === safeIndex}
                                    aria-label={c.name}
                                    title={c.name}
                                    data-tv-focusable
                                    className={`rlive__dot${i === safeIndex ? ' rlive__dot--on' : ''}`}
                                    onClick={() => goTo(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
