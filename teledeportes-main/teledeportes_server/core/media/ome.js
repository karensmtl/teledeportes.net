// OvenMediaEngine URL composition + admission-webhook helpers.
// The DB never stores URLs — they are derived here from env at assemble time.

const SCHEME      = process.env.OME_PUBLIC_SCHEME || 'http';
const HOST        = process.env.OME_PUBLIC_HOST   || 'localhost';
const WEBRTC_PORT = process.env.OME_WEBRTC_PORT   || '3333';
const LLHLS_PORT  = process.env.OME_LLHLS_PORT    || WEBRTC_PORT;
const RTMP_PORT   = process.env.OME_RTMP_PORT     || '1935';
const SRT_PORT    = process.env.OME_SRT_PORT      || '9999';
const INGEST_HOST = process.env.OME_INGEST_HOST   || HOST;
const APP         = process.env.OME_APP           || 'app';

const ADMISSION_SECRET = process.env.OME_ADMISSION_SECRET || '';

const WS_SCHEME = SCHEME === 'https' ? 'wss' : 'ws';

function playbackUrls(slug) {
    return {
        // OvenPlayer's native WebRTC source (OME signalling over WebSocket).
        webrtcUrl: `${WS_SCHEME}://${HOST}:${WEBRTC_PORT}/${APP}/${slug}`,
        // Standard WHEP (HTTP POST of an SDP offer) for custom players.
        whepUrl:   `${SCHEME}://${HOST}:${WEBRTC_PORT}/${APP}/${slug}?direction=whep`,
        // LL-HLS fallback.
        llhlsUrl:  `${SCHEME}://${HOST}:${LLHLS_PORT}/${APP}/${slug}/llhls.m3u8`,
    };
}

function ingestUrls(streamKey) {
    return {
        rtmp: `rtmp://${INGEST_HOST}:${RTMP_PORT}/${APP}/${streamKey}`,
        srt:  `srt://${INGEST_HOST}:${SRT_PORT}?streamid=${APP}/${streamKey}`,
        // Browser ingest (WHIP) — used by the in-admin web Studio.
        whip: `${SCHEME}://${HOST}:${WEBRTC_PORT}/${APP}/${streamKey}?direction=whip`,
    };
}

// The publish/stream name is the last path segment of OME's reported URL.
function streamNameFromUrl(url) {
    if (!url) return null;
    const noQuery = String(url).split('?')[0].replace(/\/+$/, '');
    return noQuery.split('/').pop() || null;
}

// Same URL but with the trailing stream name replaced (key → public slug).
function rewriteStreamName(url, newName) {
    if (!url) return url;
    const [base, query] = String(url).split('?');
    const trimmed = base.replace(/\/+$/, '');
    const replaced = trimmed.replace(/[^/]+$/, newName);
    return query ? `${replaced}?${query}` : replaced;
}

module.exports = {
    APP,
    ADMISSION_SECRET,
    playbackUrls,
    ingestUrls,
    streamNameFromUrl,
    rewriteStreamName,
};
