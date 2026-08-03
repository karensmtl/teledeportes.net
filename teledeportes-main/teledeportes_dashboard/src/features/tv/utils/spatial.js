// Geometry-based focus resolution for remote-control (D-pad) navigation.
// Pure functions — no DOM mutation, no React. The provider owns the side effects.

// Natively focusable elements + the explicit opt-in used by the app's clickable
// containers. `a:not([href])` is included because every bare anchor in the
// public site is an onClick handler (the SPA switches sections in place).
export const FOCUSABLE_SELECTOR = [
    'a[href]',
    'a:not([href])',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[data-tv-focusable]',
].join(',');

// Weight applied to cross-axis misalignment. High enough that a well-aligned
// far item beats a badly-aligned near one — the behaviour a viewer expects
// when walking across a row of cards.
const CROSS_WEIGHT = 3;
const TOLERANCE = 2;   // px; ignores sub-pixel layout noise

const center = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

// Distance between two 1-D intervals; 0 when they overlap.
function intervalGap(aStart, aEnd, bStart, bEnd) {
    if (bEnd < aStart) return aStart - bEnd;
    if (bStart > aEnd) return bStart - aEnd;
    return 0;
}

// Skips elements that exist in the DOM but can't be reached: hidden, collapsed,
// detached from layout, aria-hidden, or inside an inert/hidden subtree.
export function isReachable(el) {
    if (!el || el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false;
    if (el.closest('[inert], [aria-hidden="true"], [hidden]')) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';
}

export function collectFocusables(root = document) {
    return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isReachable);
}

// Picks the best candidate in `direction` ('up' | 'down' | 'left' | 'right')
// from `currentEl`. Returns null when there is nothing that way.
export function findNext(currentEl, direction, candidates) {
    const a = currentEl.getBoundingClientRect();
    const ac = center(a);
    const horizontal = direction === 'left' || direction === 'right';

    let best = null;
    let bestScore = Infinity;

    for (const el of candidates) {
        if (el === currentEl || currentEl.contains(el) || el.contains(currentEl)) continue;

        const b = el.getBoundingClientRect();
        const bc = center(b);

        let mainGap;
        let crossGap;

        if (horizontal) {
            const forward = direction === 'right' ? bc.x - ac.x : ac.x - bc.x;
            if (forward <= TOLERANCE) continue;
            mainGap = direction === 'right'
                ? Math.max(0, b.left - a.right)
                : Math.max(0, a.left - b.right);
            crossGap = intervalGap(a.top, a.bottom, b.top, b.bottom);
        } else {
            const forward = direction === 'down' ? bc.y - ac.y : ac.y - bc.y;
            if (forward <= TOLERANCE) continue;
            mainGap = direction === 'down'
                ? Math.max(0, b.top - a.bottom)
                : Math.max(0, a.top - b.bottom);
            crossGap = intervalGap(a.left, a.right, b.left, b.right);
        }

        // Euclidean term only breaks ties between otherwise equal candidates.
        const euclid = Math.hypot(bc.x - ac.x, bc.y - ac.y);
        const score = mainGap + crossGap * CROSS_WEIGHT + euclid * 0.1;

        if (score < bestScore) { bestScore = score; best = el; }
    }

    return best;
}

// Entry point when nothing is focused yet: the topmost-leftmost element that is
// already on screen, falling back to the first one in the document.
export function findEntry(candidates) {
    const viewportH = window.innerHeight || 0;
    const onScreen = candidates.filter(el => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < viewportH;
    });
    const pool = onScreen.length ? onScreen : candidates;
    let best = null;
    let bestScore = Infinity;
    for (const el of pool) {
        const r = el.getBoundingClientRect();
        const score = r.top * 2 + r.left;
        if (score < bestScore) { bestScore = score; best = el; }
    }
    return best;
}
