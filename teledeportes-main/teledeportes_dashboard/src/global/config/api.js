// TSS vite/06 — env-driven config. Throws at boot if required vars are missing.

const required = ['VITE_API_ENDPOINT'];
const missing = required.filter(k => !import.meta.env[k]);
if (missing.length) {
    throw new Error(`[boot] missing env: ${missing.join(', ')}`);
}

export const api = {
    endpoint: import.meta.env.VITE_API_ENDPOINT,
};

export const cdn = {
    public: import.meta.env.VITE_CDN_PUBLIC || null,
};

export const meta = {
    projectName: import.meta.env.VITE_PROJECT_NAME || 'Trianametria App',
};

// Studio (WHIP) ingest base, e.g. http://localhost:3333/app. When set, the
// Studio publishes to `${endpoint}/<streamKey>?direction=whip`; otherwise it
// falls back to the channel's backend-provided ingest.whip URL.
export const studio = {
    endpoint: import.meta.env.VITE_STUDIO_ENDPOINT || null,
};

// Live playback base (OvenPlayer WebRTC signalling over WebSocket), e.g.
// ws://localhost:3333/app or wss://stream.example.com/app. When set, the player
// uses `${endpoint}/<slug>` for WebRTC and the https-equivalent for LL-HLS;
// otherwise it falls back to the backend-composed channel URLs.
export const live = {
    endpoint: import.meta.env.VITE_LIVE_ENDPOINT || null,
};
