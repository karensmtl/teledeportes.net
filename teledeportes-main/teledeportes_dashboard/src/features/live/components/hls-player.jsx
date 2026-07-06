import { useCallback, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import { IconPlay, IconPause, IconVolume, IconVolumeMute, IconFullscreen, IconFullscreenExit, IconBroadcast } from '../../../common/icons';

// Reliable HLS live player built on hls.js (native HLS on Safari), with a
// friendly custom control bar. Starts muted so autoplay is never blocked; the
// viewer unmutes with one click.
export default function HlsPlayer({ src }) {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const hideTimer = useRef(null);

    const [status, setStatus] = useState('loading');   // loading | playing | paused | error
    const [buffering, setBuffering] = useState(true);
    const [muted, setMuted] = useState(true);
    const [volume, setVolume] = useState(1);
    const [isFs, setIsFs] = useState(false);
    const [uiVisible, setUiVisible] = useState(true);
    const [attempt, setAttempt] = useState(0);         // bump to retry

    // ---- attach the stream ----
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return undefined;
        setStatus('loading');
        setBuffering(true);
        let destroyed = false;

        if (Hls.isSupported()) {
            const hls = new Hls({ lowLatencyMode: true, enableWorker: true, backBufferLength: 30 });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => { if (!destroyed) video.play().catch(() => {}); });
            hls.on(Hls.Events.ERROR, (_evt, data) => {
                if (!data.fatal) return;
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
                else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
                else if (!destroyed) setStatus('error');
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.play().catch(() => {});
        } else {
            setStatus('error');
        }

        return () => {
            destroyed = true;
            if (hlsRef.current) { try { hlsRef.current.destroy(); } catch { /* gone */ } hlsRef.current = null; }
            video.removeAttribute('src');
            try { video.load(); } catch { /* noop */ }
        };
    }, [src, attempt]);

    // ---- reflect <video> state into the UI ----
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return undefined;
        const onPlaying = () => { setStatus('playing'); setBuffering(false); };
        const onPause = () => setStatus('paused');
        const onWaiting = () => setBuffering(true);
        const onCanPlay = () => { setBuffering(false); if (video.paused) setStatus(s => (s === 'loading' ? 'paused' : s)); };
        const onVolume = () => { setMuted(video.muted); setVolume(video.volume); };
        const onError = () => setStatus('error');
        video.addEventListener('playing', onPlaying);
        video.addEventListener('pause', onPause);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('volumechange', onVolume);
        video.addEventListener('error', onError);
        return () => {
            video.removeEventListener('playing', onPlaying);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('volumechange', onVolume);
            video.removeEventListener('error', onError);
        };
    }, []);

    useEffect(() => {
        const onFs = () => setIsFs(document.fullscreenElement === containerRef.current);
        document.addEventListener('fullscreenchange', onFs);
        return () => document.removeEventListener('fullscreenchange', onFs);
    }, []);

    // ---- controls ----
    const togglePlay = () => {
        const v = videoRef.current; if (!v) return;
        if (v.paused) v.play().catch(() => {}); else v.pause();
    };
    const toggleMute = () => {
        const v = videoRef.current; if (!v) return;
        v.muted = !v.muted;
        if (!v.muted && v.volume === 0) v.volume = 1;
    };
    const onVolInput = (e) => {
        const v = videoRef.current; if (!v) return;
        const val = Number(e.target.value);
        v.volume = val;
        v.muted = val === 0;
    };
    const toggleFs = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else containerRef.current?.requestFullscreen?.();
    };
    const retry = () => { setStatus('loading'); setBuffering(true); setAttempt(a => a + 1); };

    // auto-hide the bar while playing
    const revealUi = useCallback(() => {
        setUiVisible(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) setUiVisible(false);
        }, 3000);
    }, []);
    useEffect(() => () => clearTimeout(hideTimer.current), []);

    const showSpinner = buffering && status !== 'error' && status !== 'paused';

    return (
        <div
            ref={containerRef}
            className={`hplayer${uiVisible ? '' : ' hplayer--idle'}${isFs ? ' hplayer--fs' : ''}`}
            onMouseMove={revealUi}
            onMouseLeave={() => { if (videoRef.current && !videoRef.current.paused) setUiVisible(false); }}
        >
            <video ref={videoRef} className="hplayer__video" playsInline autoPlay muted onClick={togglePlay} />

            {showSpinner && <div className="hplayer__spinner" aria-label="Cargando" />}

            {status === 'paused' && (
                <button type="button" className="hplayer__bigplay" onClick={togglePlay} aria-label="Reproducir">
                    <IconPlay size={34} />
                </button>
            )}

            {status === 'error' && (
                <div className="hplayer__overlay">
                    <span className="hplayer__overlay-icon"><IconBroadcast size={30} /></span>
                    <p className="hplayer__overlay-title">No se pudo reproducir la señal</p>
                    <p className="hplayer__overlay-text">Verifica que el stream esté al aire.</p>
                    <button type="button" className="btn btn--primary" onClick={retry}>Reintentar</button>
                </div>
            )}

            <div className="hplayer__bar">
                <button type="button" className="hplayer__btn" onClick={togglePlay} aria-label={status === 'playing' ? 'Pausar' : 'Reproducir'}>
                    {status === 'playing' ? <IconPause size={18} /> : <IconPlay size={18} />}
                </button>

                <span className="hplayer__live"><span className="hplayer__live-dot" />EN VIVO</span>

                <div className="hplayer__vol">
                    <button type="button" className="hplayer__btn" onClick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
                        {muted || volume === 0 ? <IconVolumeMute size={18} /> : <IconVolume size={18} />}
                    </button>
                    <input
                        className="hplayer__range"
                        type="range" min="0" max="1" step="0.05"
                        value={muted ? 0 : volume}
                        onChange={onVolInput}
                        aria-label="Volumen"
                    />
                </div>

                <div className="hplayer__spacer" />

                <button type="button" className="hplayer__btn" onClick={toggleFs} aria-label={isFs ? 'Salir de pantalla completa' : 'Pantalla completa'}>
                    {isFs ? <IconFullscreenExit size={18} /> : <IconFullscreen size={18} />}
                </button>
            </div>
        </div>
    );
}
