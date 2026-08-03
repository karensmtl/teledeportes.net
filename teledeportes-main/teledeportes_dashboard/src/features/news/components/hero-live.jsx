import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';

import { resolveLiveSource, resolveHeroHls } from '../../live/playback';
import LivePlayer from '../../live/components/live-player';

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

// Home hero — a full-width "live now" banner (RTVE-Play style): the live signal
// plays right away as an ambient background, with the EN DIRECTO pill, big serif
// headline and a "Ver directo" button overlaid on the gradient. "Ver directo"
// opens the full player (sound + controls). Non-HLS-playable sources route to
// /vivo.
export default function HeroLive({ channel }) {
    const [playing, setPlaying] = useState(false);

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
        <section className="rlive">
            <div className="rlive__banner">
                {heroHls
                    ? <AmbientLive src={heroHls} poster={channel?.thumbnailUrl} />
                    : (channel?.thumbnailUrl && <img className="rlive__bg" src={channel.thumbnailUrl} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
                <div className="rlive__scrim" />
                <div className="rlive__inner">
                    <div className="rlive__top">
                        {channel && (
                            <span className="rlive__live"><span className="rlive__live-dot" /> EN DIRECTO</span>
                        )}
                    </div>
                    <div className="rlive__bottom">
                        <div className="rlive__caption">
                            <div className="rlive__eyebrow">{channel ? 'Teledeporte en directo' : 'TeleDeportes'}</div>
                            <h1 className="rlive__title">{channel ? channel.name : 'Sin transmisión en directo'}</h1>
                            {channel?.description && <p className="rlive__sub">{channel.description}</p>}
                        </div>
                        <div className="rlive__cta-row">{cta}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
