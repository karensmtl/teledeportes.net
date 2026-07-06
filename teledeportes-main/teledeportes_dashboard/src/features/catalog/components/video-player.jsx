import { useCallback, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import {
    IconPlay, IconPause, IconVolume, IconVolumeMute,
    IconFullscreen, IconFullscreenExit, IconSettings,
} from '../../../common/icons';

import './styles/video-player.css';

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

function fmt(seconds) {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
    return h > 0 ? `${h}:${mm}:${String(s).padStart(2, '0')}` : `${mm}:${String(s).padStart(2, '0')}`;
}

// Advanced HLS player with custom controls: scrub bar + buffered, volume,
// quality (ABR levels), speed, fullscreen, keyboard shortcuts, auto-hide.
export default function VideoPlayer({ src, poster }) {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const hideTimer = useRef(null);
    const startedRef = useRef(false);   // first manual play happened?

    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [loading, setLoading] = useState(true);
    const [levels, setLevels] = useState([]);
    const [level, setLevel] = useState(-1);   // -1 = auto
    const [rate, setRate] = useState(1);
    const [menu, setMenu] = useState(null);    // 'quality' | 'speed' | null
    const [fullscreen, setFullscreen] = useState(false);
    const [controls, setControls] = useState(true);

    // ---- source / hls.js wiring ----
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return undefined;

        if (video.canPlayType('application/vnd.apple.mpegurl') && !Hls.isSupported()) {
            video.src = src;                       // native HLS (Safari)
            return undefined;
        }
        if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => setLevels(data.levels || []));
            hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
                if (hls.autoLevelEnabled) setLevel(-1);
                else setLevel(data.level);
            });
            return () => { hls.destroy(); hlsRef.current = null; };
        }
        video.src = src;
        return undefined;
    }, [src]);

    // ---- media element events ----
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return undefined;

        const onTime = () => {
            setCurrent(video.currentTime);
            if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
        };
        const onMeta = () => setDuration(video.duration || 0);
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onWaiting = () => setLoading(true);
        const onPlaying = () => setLoading(false);
        const onVolume = () => { setMuted(video.muted); setVolume(video.volume); };

        video.addEventListener('timeupdate', onTime);
        video.addEventListener('progress', onTime);
        video.addEventListener('loadedmetadata', onMeta);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('playing', onPlaying);
        video.addEventListener('canplay', onPlaying);
        video.addEventListener('volumechange', onVolume);
        return () => {
            video.removeEventListener('timeupdate', onTime);
            video.removeEventListener('progress', onTime);
            video.removeEventListener('loadedmetadata', onMeta);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('playing', onPlaying);
            video.removeEventListener('canplay', onPlaying);
            video.removeEventListener('volumechange', onVolume);
        };
    }, []);

    // ---- fullscreen ----
    useEffect(() => {
        const onFs = () => setFullscreen(document.fullscreenElement === containerRef.current);
        document.addEventListener('fullscreenchange', onFs);
        return () => document.removeEventListener('fullscreenchange', onFs);
    }, []);

    // ---- controls auto-hide ----
    const revealControls = useCallback(() => {
        setControls(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) { setControls(false); setMenu(null); }
        }, 3000);
    }, []);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            // The first play is a user gesture, so the browser allows sound.
            // Force the element unmuted (and restore volume if it was at 0) so
            // pressing play always brings audio. Later plays respect the user's
            // own mute/volume choice.
            if (!startedRef.current) {
                startedRef.current = true;
                video.muted = false;
                if (video.volume === 0) video.volume = 1;
            }
            video.play();
        } else {
            video.pause();
        }
    }, []);

    const toggleMute = () => { const v = videoRef.current; if (v) v.muted = !v.muted; };
    const onVolumeInput = (e) => {
        const v = videoRef.current; if (!v) return;
        v.volume = Number(e.target.value); v.muted = Number(e.target.value) === 0;
    };
    const onSeek = (e) => { const v = videoRef.current; if (v) v.currentTime = Number(e.target.value); };

    const pickLevel = (idx) => {
        if (hlsRef.current) hlsRef.current.currentLevel = idx;
        setLevel(idx); setMenu(null);
    };
    const pickRate = (r) => { const v = videoRef.current; if (v) v.playbackRate = r; setRate(r); setMenu(null); };

    const toggleFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else containerRef.current?.requestFullscreen?.();
    };

    const onKeyDown = (e) => {
        const video = videoRef.current; if (!video) return;
        switch (e.key) {
            case ' ': case 'k': e.preventDefault(); togglePlay(); break;
            case 'f': toggleFullscreen(); break;
            case 'm': toggleMute(); break;
            case 'ArrowRight': e.preventDefault(); video.currentTime += 5; break;
            case 'ArrowLeft': e.preventDefault(); video.currentTime -= 5; break;
            case 'ArrowUp': e.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); break;
            case 'ArrowDown': e.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); break;
            default: return;
        }
        revealControls();
    };

    const playedPct = duration ? (current / duration) * 100 : 0;
    const bufferedPct = duration ? (buffered / duration) * 100 : 0;
    const levelLabel = level === -1 ? 'Auto' : `${levels[level]?.height || ''}p`;

    return (
        <div
            ref={containerRef}
            className={`vp ${controls ? '' : 'vp--hide-cursor'}`}
            tabIndex={0}
            onMouseMove={revealControls}
            onMouseLeave={() => { if (playing) { setControls(false); setMenu(null); } }}
            onKeyDown={onKeyDown}
        >
            <video
                ref={videoRef}
                className="vp__video"
                poster={poster || undefined}
                playsInline
                onClick={togglePlay}
            />

            {loading && <div className="vp__spinner" />}

            {!playing && !loading && (
                <button className="vp__big-play" onClick={togglePlay} aria-label="Reproducir">
                    <IconPlay size={34} />
                </button>
            )}

            <div className={`vp__controls ${controls ? '' : 'vp__controls--hidden'}`}>
                <div className="vp__seek">
                    <div className="vp__seek-buffered" style={{ width: `${bufferedPct}%` }} />
                    <div className="vp__seek-played" style={{ width: `${playedPct}%` }} />
                    <input
                        className="vp__seek-input"
                        type="range" min="0" max={duration || 0} step="0.1"
                        value={current}
                        onChange={onSeek}
                        aria-label="Buscar"
                    />
                </div>

                <div className="vp__bar">
                    <button className="vp__btn" onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproducir'}>
                        {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
                    </button>

                    <div className="vp__volume">
                        <button className="vp__btn" onClick={toggleMute} aria-label="Silenciar">
                            {muted || volume === 0 ? <IconVolumeMute size={20} /> : <IconVolume size={20} />}
                        </button>
                        <input
                            className="vp__volume-input"
                            type="range" min="0" max="1" step="0.05"
                            value={muted ? 0 : volume}
                            onChange={onVolumeInput}
                            aria-label="Volumen"
                        />
                    </div>

                    <span className="vp__time">{fmt(current)} <span className="vp__time-sep">/</span> {fmt(duration)}</span>

                    <div className="vp__spacer" />

                    <div className="vp__settings">
                        <button
                            className="vp__btn"
                            onClick={() => setMenu(menu ? null : 'root')}
                            aria-label="Ajustes"
                        >
                            <IconSettings size={20} />
                        </button>
                        {menu && (
                            <div className="vp__menu">
                                {levels.length > 0 && (
                                    <div className="vp__menu-group">
                                        <span className="vp__menu-label">Calidad</span>
                                        <button className={`vp__menu-item ${level === -1 ? 'vp__menu-item--on' : ''}`} onClick={() => pickLevel(-1)}>Auto</button>
                                        {levels.map((lv, idx) => (
                                            <button
                                                key={idx}
                                                className={`vp__menu-item ${level === idx ? 'vp__menu-item--on' : ''}`}
                                                onClick={() => pickLevel(idx)}
                                            >
                                                {lv.height}p
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="vp__menu-group">
                                    <span className="vp__menu-label">Velocidad</span>
                                    {SPEEDS.map(s => (
                                        <button
                                            key={s}
                                            className={`vp__menu-item ${rate === s ? 'vp__menu-item--on' : ''}`}
                                            onClick={() => pickRate(s)}
                                        >
                                            {s === 1 ? 'Normal' : `${s}×`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {levels.length > 0 && <span className="vp__quality-tag">{levelLabel}</span>}

                    <button className="vp__btn" onClick={toggleFullscreen} aria-label="Pantalla completa">
                        {fullscreen ? <IconFullscreenExit size={20} /> : <IconFullscreen size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
