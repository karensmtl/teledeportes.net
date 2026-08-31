import { useEffect, useId, useRef } from 'react';
import OvenPlayer from 'ovenplayer';
import Hls from 'hls.js';

// OvenPlayer's bundle references `Hls` as a bare global — it never declares or
// imports it (9 uses, 0 declarations in ovenplayer/dist/ovenplayer.js). Vite
// keeps our `import Hls from 'hls.js'` module-scoped, so the LL-HLS provider
// finds nothing and dies with error 106, "Error initializing HLS" (the Polish
// locale spells the real cause out: "nie znaleziono hlsjs" — hlsjs not found).
// Publishing it on window is the supported way to feed hls.js to OvenPlayer
// from a bundler.
if (typeof window !== 'undefined' && !window.Hls) window.Hls = Hls;

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
