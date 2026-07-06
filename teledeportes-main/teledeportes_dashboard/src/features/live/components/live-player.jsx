import HlsPlayer from './hls-player';
import WebrtcPlayer from './webrtc-player';
import { resolveLiveSource } from '../playback';
import { IconBroadcast } from '../../../common/icons';

import './styles/live-player.css';

// Routes a channel to the right playback engine based on its stream kind:
//   hls    → hls.js (external .m3u8 or OME LL-HLS) with friendly controls
//   webrtc → OvenPlayer (OME sub-second)
//   rtmp   → not playable in a browser; shows a clear notice
export default function LivePlayer({ channel }) {
    const source = resolveLiveSource(channel);

    if (source.kind === 'hls') return <HlsPlayer src={source.hlsUrl} />;

    if (source.kind === 'webrtc') {
        return <WebrtcPlayer webrtcUrl={source.webrtcUrl} llhlsUrl={source.llhlsUrl} />;
    }

    if (source.kind === 'rtmp') {
        return (
            <div className="live-player live-player--notice">
                <span className="live-player__notice-icon"><IconBroadcast size={30} /></span>
                <p className="live-player__notice-title">Stream RTMP no reproducible en el navegador</p>
                <p className="live-player__notice-text">
                    RTMP se usa para ingesta, no para reproducción web. Enlaza una URL HLS (.m3u8)
                    o WebRTC para verla aquí.
                </p>
            </div>
        );
    }

    return null;
}
