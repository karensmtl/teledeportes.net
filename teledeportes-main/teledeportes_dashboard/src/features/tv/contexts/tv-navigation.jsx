import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    DIRECTION_BY_KEY, DIRECTION_BY_KEYCODE,
    ENTER_KEYS, ENTER_KEYCODES,
    BACK_KEYS, BACK_KEYCODES,
    NATIVELY_ACTIVATABLE, TEXT_ENTRY, TV_UA_PATTERN, OVERLAY_SELECTOR,
} from '../../../core/constants/tv';
import { collectFocusables, findEntry, findNext, isReachable } from '../utils/spatial';

import '../styles/tv.css';

const TvNavigationContext = createContext(null);

const isTvUserAgent = () =>
    typeof navigator !== 'undefined' && TV_UA_PATTERN.test(navigator.userAgent || '');

// True while the user is typing — arrows must move the caret, not the focus.
function isTextEntry(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName?.toLowerCase();
    if (!TEXT_ENTRY.includes(tag)) return false;
    // Checkboxes/radios/buttons rendered as <input> still want D-pad movement.
    if (tag === 'input') return !['checkbox', 'radio', 'button', 'submit', 'range'].includes(el.type);
    return true;
}

// Anything can be focused programmatically once it carries a tabindex; adding
// -1 keeps it out of the Tab order while making it reachable by the D-pad.
function focusElement(el) {
    if (!el) return false;
    if (!el.hasAttribute('tabindex') && el.tabIndex < 0) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    if (document.activeElement !== el) return false;
    el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    return true;
}

/**
 * Remote-control navigation for the whole app.
 *
 * Arrows move focus to the nearest element in that direction (spatial, based on
 * on-screen geometry — not DOM order), OK activates it, BACK goes to the
 * previous route. Designed for a viewer sitting in front of a TV: focus is
 * always visible, always scrolled into view, and never trapped.
 *
 * Elements opt in via `data-tv-focusable` (native controls and links are
 * picked up automatically).
 */
export function TvNavigationProvider({ children }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [tvMode, setTvMode] = useState(isTvUserAgent);
    const lastFocused = useRef(null);

    // The focus ring is chrome the mouse user never asked for: it only shows
    // once the remote/keyboard is actually driving, and hides again on pointer.
    useEffect(() => {
        document.documentElement.classList.toggle('tv-mode', tvMode);
        return () => document.documentElement.classList.remove('tv-mode');
    }, [tvMode]);

    const focusFirst = useCallback(() => {
        const entry = findEntry(collectFocusables());
        return entry ? focusElement(entry) : false;
    }, []);

    const move = useCallback((direction) => {
        const candidates = collectFocusables();
        if (!candidates.length) return false;

        let current = document.activeElement;
        if (!current || current === document.body || !isReachable(current)) {
            current = lastFocused.current && isReachable(lastFocused.current) ? lastFocused.current : null;
        }
        if (!current) return focusFirst();

        const next = findNext(current, direction, candidates);
        if (!next) return false;              // edge of the screen — stay put
        const moved = focusElement(next);
        if (moved) lastFocused.current = next;
        return moved;
    }, [focusFirst]);

    const activate = useCallback(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return false;
        const tag = el.tagName.toLowerCase();
        // Native controls fire their own click on Enter; only synthesise one
        // for the opt-in containers (cards, overlays) that never would.
        if (NATIVELY_ACTIVATABLE.includes(tag) && !(tag === 'a' && !el.hasAttribute('href'))) return false;
        el.click();
        return true;
    }, []);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

            const direction = DIRECTION_BY_KEY[event.key] ?? DIRECTION_BY_KEYCODE[event.keyCode];
            const isEnter = ENTER_KEYS.includes(event.key) || ENTER_KEYCODES.includes(event.keyCode);
            const isBack = BACK_KEYS.includes(event.key) || BACK_KEYCODES.includes(event.keyCode);

            if (!direction && !isEnter && !isBack) return;
            if (isTextEntry(event.target)) return;
            // Space scrolls the page by default; only treat it as OK when the
            // focus is on one of our non-native targets.
            if (isEnter && event.keyCode === 32 && !document.activeElement?.hasAttribute('data-tv-focusable')) return;

            if (direction) {
                setTvMode(true);
                if (move(direction)) event.preventDefault();
                return;
            }

            if (isEnter) {
                setTvMode(true);
                if (!document.activeElement || document.activeElement === document.body) {
                    if (focusFirst()) event.preventDefault();
                    return;
                }
                if (activate()) event.preventDefault();
                return;
            }

            // BACK: never swallow Backspace outside a D-pad session, and never
            // walk out of the app (webOS/Tizen close the browser on an empty
            // history stack) — fall back to the home surface instead.
            if (isBack) {
                if (event.keyCode === 8 && !tvMode) return;
                // A modal is open: BACK closes it instead of leaving the screen.
                // Overlays listen for Escape, which a TV's BACK code is not —
                // so relay one and let the overlay dismiss itself.
                if (document.querySelector(OVERLAY_SELECTOR)) {
                    if (event.key !== 'Escape') {
                        event.preventDefault();
                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                    }
                    return;
                }
                event.preventDefault();
                if (window.history.length > 1) navigate(-1);
                else navigate('/');
            }
        };

        const onPointerDown = () => setTvMode(isTvUserAgent());
        const onFocusIn = (event) => { if (event.target !== document.body) lastFocused.current = event.target; };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('focusin', onFocusIn);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('focusin', onFocusIn);
        };
    }, [move, activate, focusFirst, navigate, tvMode]);

    // A new route means the old focus target is gone. Hand the remote the first
    // element of the new screen so arrows keep working without a click.
    useEffect(() => {
        lastFocused.current = null;
        if (!tvMode) return undefined;
        const id = window.setTimeout(focusFirst, 120);   // let the route paint first
        return () => window.clearTimeout(id);
    }, [pathname, tvMode, focusFirst]);

    const value = useMemo(
        () => ({ tvMode, setTvMode, move, activate, focusFirst }),
        [tvMode, move, activate, focusFirst],
    );

    return <TvNavigationContext.Provider value={value}>{children}</TvNavigationContext.Provider>;
}

export function useTvNavigation() {
    const ctx = useContext(TvNavigationContext);
    if (!ctx) throw new Error('useTvNavigation must be used within a TvNavigationProvider');
    return ctx;
}
