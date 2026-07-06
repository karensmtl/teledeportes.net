// VOD media constants — TSS vite/02 §"Constants live in core/constants".

export const PROCESSING_STATUS = {
    pending:    { label: 'En cola',      tone: 'warning' },
    processing: { label: 'Procesando',   tone: 'info' },
    ready:      { label: 'Listo',        tone: 'success' },
    failed:     { label: 'Falló',        tone: 'danger' },
};

// Mirrors the backend MEDIA_MAX_UPLOAD_MB default.
export const MAX_UPLOAD_MB = 5120;
export const ACCEPTED_VIDEO_TYPES = 'video/*';

export function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '—';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatBytes(bytes) {
    if (!bytes) return '—';
    const mb = Number(bytes) / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
}
