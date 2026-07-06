import { MAX_NAME_LEN } from '../../../core/constants/forms';

// Pure helpers scoped to the example feature.
// TSS vite/01 — utils/ may not import React or hooks.

export function truncate(value) {
    return (value || '').slice(0, MAX_NAME_LEN);
}

// Collapse internal whitespace, trim ends — preserves single spaces between words.
export function cleanName(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
}

export function normalizeId(value) {
    if (value == null) return '';
    if (typeof value === 'object') return value.id != null ? String(value.id) : '';
    return String(value);
}
