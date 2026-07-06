import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useChannels } from '../../channels/queries/hooks';
import { studio as studioConfig } from '../../../global/config/api';
import { publishWhip } from '../whip-client';

import './styles/studio.css';

// WHIP target: env-configured endpoint (VITE_STUDIO_ENDPOINT) + the channel's
// stream key, falling back to the backend-provided ingest.whip URL.
function resolveWhipUrl(channel, endpoint) {
    if (endpoint && channel?.streamKey) {
        return `${endpoint.replace(/\/+$/, '')}/${channel.streamKey}?direction=whip`;
    }
    return channel?.ingest?.whip || null;
}

export default function Studio() {
    const { data } = useChannels();
    const channels = data?.items || [];

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const sessionRef = useRef(null);

    const [channelId, setChannelId] = useState('');
    const [mode, setMode] = useState('camera');           // 'camera' | 'screen'
    const [devices, setDevices] = useState({ video: [], audio: [] });
    const [videoId, setVideoId] = useState('');
    const [audioId, setAudioId] = useState('');
    const [hasPreview, setHasPreview] = useState(false);
    const [live, setLive] = useState(false);
    const [busy, setBusy] = useState(false);

    const channel = channels.find(c => String(c.id) === String(channelId));

    const refreshDevices = async () => {
        try {
            const list = await navigator.mediaDevices.enumerateDevices();
            setDevices({
                video: list.filter(d => d.kind === 'videoinput'),
                audio: list.filter(d => d.kind === 'audioinput'),
            });
        } catch { /* ignore */ }
    };

    // On entering the Studio, ask for camera/mic right away: this triggers the
    // permission prompt and populates the device lists with real labels (incl.
    // "vMix Video"). Also shows a live self-preview.
    useEffect(() => {
        const id = setTimeout(() => startPreview(), 0);
        return () => { clearTimeout(id); stopAll(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const attach = (stream) => {
        stopStreamOnly();
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setHasPreview(true);
    };

    const startPreview = async () => {
        setBusy(true);
        try {
            let stream;
            if (mode === 'screen') {
                stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            } else {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: videoId ? { deviceId: { exact: videoId } } : true,
                    audio: audioId ? { deviceId: { exact: audioId } } : true,
                });
            }
            attach(stream);
            await refreshDevices();   // labels available now (vMix Video, etc.)
        } catch (err) {
            toast.error(err?.message || 'No se pudo acceder a la fuente');
        } finally {
            setBusy(false);
        }
    };

    const goLive = async () => {
        const whip = resolveWhipUrl(channel, studioConfig.endpoint);
        if (!whip) { toast.error('Selecciona un canal'); return; }
        if (!streamRef.current) { toast.error('Activa una fuente primero'); return; }
        setBusy(true);
        try {
            sessionRef.current = await publishWhip(whip, streamRef.current);
            setLive(true);
            toast.success(`Al aire en ${channel.name}`);
        } catch (err) {
            toast.error(err?.message || 'No se pudo salir al aire');
        } finally {
            setBusy(false);
        }
    };

    const stopLive = async () => {
        setBusy(true);
        try { await sessionRef.current?.stop(); } catch { /* ignore */ }
        sessionRef.current = null;
        setLive(false);
        setBusy(false);
        toast('Emisión finalizada');
    };

    function stopStreamOnly() {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    function stopAll() {
        sessionRef.current?.stop?.();
        sessionRef.current = null;
        stopStreamOnly();
    }

    return (
        <section>
            <div className="page-head">
                <div>
                    <h1 className="page-head__title">Estudio</h1>
                    <p className="page-head__subtitle">Sal al aire desde el navegador (WebRTC/WHIP, sub-segundo).</p>
                </div>
                <span className={`pill ${live ? 'pill--danger' : hasPreview ? 'pill--warning' : 'pill--info'}`}>
                    {live && <span className="studio__dot" />}
                    {live ? 'AL AIRE' : hasPreview ? 'Previsualizando' : 'Inactivo'}
                </span>
            </div>

            <div className="studio">
                <div className="studio__preview card">
                    <video ref={videoRef} className="studio__video" autoPlay muted playsInline />
                    {!hasPreview && <div className="studio__placeholder">Activa una fuente para previsualizar</div>}
                </div>

                <div className="studio__panel card">
                    <label className="field">
                        <span>Canal</span>
                        <select value={channelId} onChange={e => setChannelId(e.target.value)} disabled={live}>
                            <option value="" disabled>Selecciona un canal…</option>
                            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </label>

                    <div className="studio__modes">
                        <button
                            className={`btn ${mode === 'camera' ? 'btn--primary' : 'btn--ghost'}`}
                            onClick={() => setMode('camera')}
                            disabled={live}
                        >Cámara</button>
                        <button
                            className={`btn ${mode === 'screen' ? 'btn--primary' : 'btn--ghost'}`}
                            onClick={() => setMode('screen')}
                            disabled={live}
                        >Pantalla</button>
                    </div>

                    {mode === 'camera' && (
                        <>
                            <label className="field">
                                <span>Cámara</span>
                                <select value={videoId} onChange={e => setVideoId(e.target.value)} disabled={live}>
                                    <option value="">Predeterminada</option>
                                    {devices.video.map(d => (
                                        <option key={d.deviceId} value={d.deviceId}>{d.label || 'Cámara'}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="field">
                                <span>Micrófono</span>
                                <select value={audioId} onChange={e => setAudioId(e.target.value)} disabled={live}>
                                    <option value="">Predeterminado</option>
                                    {devices.audio.map(d => (
                                        <option key={d.deviceId} value={d.deviceId}>{d.label || 'Micrófono'}</option>
                                    ))}
                                </select>
                            </label>
                        </>
                    )}

                    <div className="studio__actions">
                        <button className="btn btn--ghost" onClick={startPreview} disabled={busy || live}>
                            {hasPreview ? 'Cambiar fuente' : 'Previsualizar'}
                        </button>
                        {live ? (
                            <button className="btn btn--danger" onClick={stopLive} disabled={busy}>Cortar emisión</button>
                        ) : (
                            <button className="btn btn--accent" onClick={goLive} disabled={busy || !hasPreview || !channelId}>
                                Salir al aire
                            </button>
                        )}
                    </div>

                    <p className="studio__hint">
                        ¿Usas <b>vMix</b>? Activa su <i>Virtual Camera</i> y aparecerá en la lista de
                        cámaras: selecciónala para emitir tu producción completa con latencia mínima.
                    </p>
                </div>
            </div>
        </section>
    );
}
