// TSS vite/01 — common/icons. One file per icon is also valid; we batch
// the foundational set here for the template. Split when the set grows.
//
// All icons use currentColor so any container's color cascades.

export function IconEdit() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

export function IconTrash() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
    );
}

export function IconPlus() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5"  x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>
    );
}

export function IconEye() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export function IconEyeOff() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

function svgProps(size) {
    return {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
    };
}

export function IconGrid({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

export function IconTag({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    );
}

export function IconVideo({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    );
}

export function IconNews({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9h4" />
            <line x1="10" y1="7" x2="18" y2="7" /><line x1="10" y1="11" x2="18" y2="11" /><line x1="10" y1="15" x2="14" y2="15" />
        </svg>
    );
}

// ---- section / category glyphs (replace emoji) ----

export function IconNewspaper({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9h4" />
            <path d="M10 6h8v5h-8z" /><line x1="10" y1="14" x2="18" y2="14" /><line x1="10" y1="17" x2="14" y2="17" />
        </svg>
    );
}

export function IconBall({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 8 15 10.2 13.8 14 10.2 14 9 10.2" />
            <path d="M12 2v6M3.5 9.5l5.5 1M20.5 9.5l-5.5 1M7 20l3-6M17 20l-3-6" />
        </svg>
    );
}

export function IconFilm({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <line x1="7" y1="3" x2="7" y2="21" /><line x1="17" y1="3" x2="17" y2="21" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7.5" x2="7" y2="7.5" /><line x1="2" y1="16.5" x2="7" y2="16.5" />
            <line x1="17" y1="7.5" x2="22" y2="7.5" /><line x1="17" y1="16.5" x2="22" y2="16.5" />
        </svg>
    );
}

export function IconLandmark({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <line x1="3" y1="22" x2="21" y2="22" /><line x1="4" y1="10" x2="4" y2="18" />
            <line x1="9" y1="10" x2="9" y2="18" /><line x1="15" y1="10" x2="15" y2="18" />
            <line x1="20" y1="10" x2="20" y2="18" /><polygon points="12 2 21 8 3 8" />
        </svg>
    );
}

export function IconList({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3.5" y1="6" x2="3.51" y2="6" /><line x1="3.5" y1="12" x2="3.51" y2="12" /><line x1="3.5" y1="18" x2="3.51" y2="18" />
        </svg>
    );
}

export function IconMapPin({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export function IconMessageCircle({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8z" />
        </svg>
    );
}

export function IconMail({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 5L2 7" />
        </svg>
    );
}

export function IconClock({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

export function IconCalendar({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

export function IconImage({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" />
            <path d="M21 15l-3.5-3.5a2 2 0 00-2.8 0L6 20" />
        </svg>
    );
}

export function IconSearch({ size = 19 }) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
    );
}

export function IconUser({ size = 20 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function IconUpload({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

export function IconRefresh({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
    );
}

export function IconLogout({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

export function IconClose({ size = 16 }) {
    return (
        <svg {...svgProps(size)}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export function IconPlay({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
    );
}

export function IconPause({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    );
}

export function IconVolume({ size = 20 }) {
    return (
        <svg {...svgProps(size)}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
        </svg>
    );
}

export function IconVolumeMute({ size = 20 }) {
    return (
        <svg {...svgProps(size)}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
        </svg>
    );
}

export function IconFullscreen({ size = 20 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
        </svg>
    );
}

export function IconFullscreenExit({ size = 20 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
        </svg>
    );
}

export function IconHeart({ size = 12 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

export function IconBroadcast({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            <path d="M4.93 19.07a10 10 0 010-14.14M19.07 4.93a10 10 0 010 14.14M7.76 16.24a6 6 0 010-8.48M16.24 7.76a6 6 0 010 8.48" />
        </svg>
    );
}

export function IconCamera({ size = 18 }) {
    return (
        <svg {...svgProps(size)}>
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

export function IconSettings({ size = 20 }) {
    return (
        <svg {...svgProps(size)}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    );
}
