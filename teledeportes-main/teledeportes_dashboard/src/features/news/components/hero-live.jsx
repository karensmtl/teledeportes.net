import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';

import { resolveHeroHls } from '../../live/playback';

// Home hero: plays the on-air channel's live signal inline (HLS via hls.js).
// Falls back to an offline card (or a "watch on /vivo" card for streams that
// can't play inline, e.g. external WebRTC/RTMP). Starts muted → autoplay-safe.
export default function HeroLive({ channel }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const hlsUrl = channel ? resolveHeroHls(channel) : null;

    const stop = () => {
        const video = videoRef.current;
        if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
        if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
        setPlaying(false);
    };

    // Destroy hls.js on unmount (the parent remounts this via `key` when the
    // on-air channel changes, so no per-URL reset effect is needed).
    useEffect(() => () => { if (hlsRef.current) hlsRef.current.destroy(); }, []);

    const start = () => {
        const video = videoRef.current;
        if (!video || !hlsUrl) return;
        video.muted = false;
        const playSafe = () => video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl; video.load(); playSafe();
        } else if (Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, playSafe);
            hlsRef.current = hls;
        } else {
            video.src = hlsUrl; video.load(); playSafe();
        }
        setPlaying(true);
    };

    return (
        <div className="rj_hero_big heroFeaturedNews" style={{ cursor: 'default', background: '#000', padding: 0 }}>
            <div>
                <video ref={videoRef} className="heroLiveVideo" poster="/logo.png" playsInline muted />

                {/* Playable channel: click-to-play overlay */}
                {hlsUrl && !playing && (
                    <div className="heroVideoOverlay" onClick={start}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--c-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,87,184,.45)', marginBottom: 12 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polygon points="6,3 21,12 6,21" fill="white" /></svg>
                        </div>
                        <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>▶ EN VIVO</span>
                        {channel?.name && <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 12, marginTop: 6 }}>{channel.name}</span>}
                    </div>
                )}

                {hlsUrl && playing && (
                    <>
                        <div className="heroLiveBadge" style={{ display: 'flex' }}>
                            <span style={{ background: 'var(--c-accent)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', padding: '4px 10px', borderRadius: 3, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: 'blink 1.2s infinite', display: 'inline-block' }} />EN VIVO{channel?.name ? ` · ${channel.name}` : ''}
                            </span>
                            <button onClick={stop} style={{ background: 'rgba(0,0,0,.65)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 3, cursor: 'pointer', letterSpacing: '.06em' }}>⏹ PARAR</button>
                        </div>
                        <div className="heroVolRow" style={{ display: 'flex' }}>
                            <span style={{ color: '#fff', fontSize: 13 }}>🔊</span>
                            <input
                                type="range" min="0" max="1" step="0.05" defaultValue="0.8"
                                style={{ accentColor: 'var(--c-accent)', width: 90, cursor: 'pointer' }}
                                onChange={(e) => { if (videoRef.current) videoRef.current.volume = Number(e.target.value); }}
                            />
                        </div>
                        {channel?.slug && (
                            <Link to={`/vivo/${channel.slug}`} style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 3, letterSpacing: '.06em' }}>
                                Ver canal →
                            </Link>
                        )}
                    </>
                )}

                {/* On-air channel that can't play inline (WebRTC/RTMP): send to /vivo */}
                {channel && !hlsUrl && (
                    <div className="heroVideoOverlay" style={{ position: 'relative' }}>
                        <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>● EN VIVO · {channel.name}</span>
                        <Link to={`/vivo/${channel.slug}`} className="bnt_contac" style={{ textDecoration: 'none' }}>Ver en vivo →</Link>
                    </div>
                )}

                {/* Nothing on air */}
                {!channel && (
                    <div className="heroVideoOverlay" style={{ flexDirection: 'column', gap: 10 }}>
                        <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 14, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Sin transmisión en vivo</span>
                        <Link to="/vivo" className="bnt_contac" style={{ textDecoration: 'none' }}>Ver canales →</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
