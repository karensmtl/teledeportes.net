import { useEffect, useId, useRef } from 'react';
import OvenPlayer from 'ovenplayer';

// OvenPlayer wrapper for OME WebRTC (sub-second) with an LL-HLS fallback.
// Muted autostart so the browser never blocks it; the viewer unmutes.
export default function WebrtcPlayer({ webrtcUrl, llhlsUrl }) {
    const rawId = useId();
    const elementId = `ovenplayer-${rawId.replace(/[:]/g, '')}`;
    const playerRef = useRef(null);

    useEffect(() => {
        if (!webrtcUrl && !llhlsUrl) return undefined;

        const sources = [];
        if (webrtcUrl) sources.push({ label: 'WebRTC', type: 'webrtc', file: webrtcUrl });
        if (llhlsUrl) sources.push({ label: 'LL-HLS', type: 'llhls', file: llhlsUrl });

        const player = OvenPlayer.create(elementId, {
            autoStart: true,
            autoFallback: true,
            mute: true,
            controls: true,
            sources,
        });
        playerRef.current = player;

        return () => {
            try { player.remove(); } catch { /* already gone */ }
            playerRef.current = null;
        };
    }, [elementId, webrtcUrl, llhlsUrl]);

    return (
        <div className="live-player">
            <div id={elementId} className="live-player__el" />
        </div>
    );
}
