import axios from 'axios';
import toast from 'react-hot-toast';

import { api as config } from '../../global/config/api';
import { ApiError } from './error';
import { notifySessionExpired, readCsrfCookie } from './session';

// TSS vite/04 — the canonical HTTP client. Layer 1.
// All app code goes through this instance (directly or via useQuery / useBridge).
//
// URL convention: request urls are passed WITHOUT a leading slash
// (e.g. api.get('auth/me')), so any url-matching here must tolerate that.

const MUTATING = new Set(['post', 'put', 'patch', 'delete']);

// Default per-request timeout for normal (JSON) API calls. Large file uploads
// override this — see the request interceptor.
const DEFAULT_TIMEOUT = 15_000;
// No client-side cap for uploads: heavy videos can take arbitrarily long over
// slow uplinks. The caller's abort signal and the server's requestTimeout still
// bound the transfer.
const UPLOAD_TIMEOUT = 0;

// Multipart / binary request bodies are file uploads.
function isUploadBody(data) {
    return data instanceof FormData
        || data instanceof Blob
        || data instanceof ArrayBuffer
        || ArrayBuffer.isView(data);
}

// Matches the auth namespace whether the url is 'auth/me' (template
// convention) or a fully-qualified '…/api/v1/auth/me'. A literal
// '/auth/' check would never match the no-leading-slash form.
const AUTH_URL = /(^|\/)auth\//;

export const api = axios.create({
    baseURL: config.endpoint,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
});

api.interceptors.request.use((cfg) => {
    inferContentType(cfg);

    // Lift the timeout for file uploads (unless the caller set a custom one).
    if (cfg.timeout === DEFAULT_TIMEOUT && isUploadBody(cfg.data)) {
        cfg.timeout = UPLOAD_TIMEOUT;
    }

    if (MUTATING.has(String(cfg.method).toLowerCase())) {
        const csrf = readCsrfCookie();
        if (csrf) cfg.headers['X-CSRF-Token'] = csrf;
    }

    cfg.metadata = { id: crypto.randomUUID(), start: performance.now() };
    cfg.headers['X-Request-ID'] = cfg.metadata.id;

    return cfg;
});

api.interceptors.response.use(
    (res) => {
        if (import.meta.env.DEV) {
            const ms = (performance.now() - res.config.metadata.start).toFixed(0);
            console.debug(`[api] ${res.config.method?.toUpperCase()} ${res.config.url} → ${res.status} (${ms}ms)`);
        }
        return res;
    },
    async (error) => {
        const apiError = ApiError.fromAxios(error);

        if (apiError.status === 401) handle401(error);
        if (apiError.status === 403) handle403(error);

        throw apiError;
    },
);

// TSS vite/04 §"Content-type auto-detection". Sniffs cfg.data and sets
// (or removes) the Content-Type header. Caller never sets it manually.
function inferContentType(cfg) {
    if (cfg.data == null) return;
    if (cfg.headers['Content-Type']) return;

    if (cfg.data instanceof FormData) {
        // Browser must set the multipart boundary; pre-setting breaks it.
        delete cfg.headers['Content-Type'];
        return;
    }
    if (cfg.data instanceof Blob) {
        cfg.headers['Content-Type'] = cfg.data.type || 'application/octet-stream';
        return;
    }
    if (cfg.data instanceof URLSearchParams) {
        cfg.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return;
    }
    if (cfg.data instanceof ArrayBuffer || ArrayBuffer.isView(cfg.data)) {
        cfg.headers['Content-Type'] = 'application/octet-stream';
        return;
    }
    if (typeof cfg.data === 'object') {
        cfg.headers['Content-Type'] = 'application/json';
    }
}

// Per TSS vite/05 §"Global error side effects" — only 401 and 403
// trigger global behavior. Everything else is the caller's job.

function handle401(error) {
    // /auth/* requests bypass — the bootstrap GET /auth/me returning 401
    // just means "not logged in", not "session expired mid-use".
    if (AUTH_URL.test(error?.config?.url || '')) return;
    // Same-tab event (no hard reload) → AuthProvider clears the user →
    // route guards redirect to /login client-side. Loop-proof.
    notifySessionExpired();
}

let forbiddenToastActive = false;
function handle403(error) {
    // Auth endpoints carry their own semantics (e.g. POST /auth/login →
    // 403 "pending activation"); don't fire the global "no permission" toast.
    if (AUTH_URL.test(error?.config?.url || '')) return;
    if (forbiddenToastActive) return;
    forbiddenToastActive = true;
    toast.error('No tienes permiso para esta acción');
    setTimeout(() => { forbiddenToastActive = false; }, 2000);
    window.dispatchEvent(new CustomEvent('auth:permissions-refresh'));
}

// Convenience helpers. TSS vite/04 §"File uploads" / §"File downloads".

export async function uploadFile(endpoint, file, fields = {}, opts = {}) {
    const { onProgress, signal, fileField = 'file' } = opts;
    const form = new FormData();
    form.append(fileField, file);
    for (const [k, v] of Object.entries(fields)) form.append(k, String(v));
    const res = await api.post(endpoint, form, {
        onUploadProgress: onProgress,
        signal,
    });
    return res.data;
}

export async function downloadFile(endpoint, opts = {}) {
    const res = await api.get(endpoint, {
        responseType: 'blob',
        signal: opts.signal,
    });
    return res.data;
}
