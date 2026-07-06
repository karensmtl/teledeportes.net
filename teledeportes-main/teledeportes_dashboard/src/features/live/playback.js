import { live as liveConfig } from '../../global/config/api';

// Guesses the stream kind from a URL: 'hls' (.m3u8 / http), 'webrtc'
// (ws/wss/whep), or 'rtmp'. Defaults to HLS for plain http(s) links.
export function detectStreamKind(url) {
    if (!url) return null;
    const u = String(url).trim().toLowerCase();
    if (u.startsWith('rtmp://') || u.startsWith('rtmps://')) return 'rtmp';
    if (u.startsWith('ws://') || u.startsWith('wss://')) return 'webrtc';
    if (u.includes('whep') || u.includes('direction=whep')) return 'webrtc';
    if (u.includes('.m3u8')) return 'hls';
    return 'hls';
}

// Resolves a channel to a normalized playback source the player can consume:
//   { kind: 'hls'|'webrtc'|'rtmp'|'none', hlsUrl, webrtcUrl, llhlsUrl, rtmpUrl }
// A channel linked to an external stream plays that URL (by detected kind).
// Otherwise it's an OME channel: WebRTC primary + LL-HLS fallback, built from
// VITE_LIVE_ENDPOINT when set (so they're not tied to the backend's OME host).
export function resolveLiveSource(channel) {
    if (!channel) return { kind: 'none' };

    if (channel.externalHlsUrl) {
        const url = channel.externalHlsUrl;
        const kind = detectStreamKind(url);
        if (kind === 'rtmp') return { kind: 'rtmp', rtmpUrl: url };
        if (kind === 'webrtc') return { kind: 'webrtc', webrtcUrl: url, llhlsUrl: null };
        return { kind: 'hls', hlsUrl: url };
    }

    const base = liveConfig.endpoint;
    if (base && channel.slug) {
        const ws = `${base.replace(/\/+$/, '')}/${channel.slug}`;
        const http = ws.replace(/^wss:/i, 'https:').replace(/^ws:/i, 'http:');
        return { kind: 'webrtc', webrtcUrl: ws, llhlsUrl: `${http}/llhls.m3u8` };
    }
    return { kind: 'webrtc', webrtcUrl: channel.webrtcUrl || null, llhlsUrl: channel.llhlsUrl || null };
}

// An HLS (.m3u8) URL the lightweight home hero can play with hls.js, or null if
// the channel isn't HLS-playable inline (external WebRTC/RTMP → open /vivo).
export function resolveHeroHls(channel) {
    const src = resolveLiveSource(channel);
    if (src.kind === 'hls') return src.hlsUrl;
    if (src.kind === 'webrtc' && src.llhlsUrl) return src.llhlsUrl;
    return null;
}
