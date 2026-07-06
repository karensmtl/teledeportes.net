import { useRef, useState } from 'react';

// Horizontal carousel with prev/next buttons and touch swipe, ported from the
// prototype's carouselScroll/videoCarouselScroll logic. Children are the cards;
// step width is measured from the first child so it adapts to breakpoints.
// Callers pass a `key` tied to the content so a content change remounts the
// carousel with a fresh (0) position instead of a stale offset.
export default function Carousel({ title, countLabel, children }) {
    const trackRef = useRef(null);
    const idxRef = useRef(0);
    const [offset, setOffset] = useState(0);

    const measure = () => {
        const track = trackRef.current;
        if (!track || !track.children.length) return { cw: 0, maxIdx: 0 };
        const gap = parseInt(getComputedStyle(track).gap, 10) || 2;
        const cw = track.children[0].offsetWidth + gap;
        const outer = track.parentElement;
        const visible = Math.max(1, Math.floor(outer.offsetWidth / cw));
        const maxIdx = Math.max(0, track.children.length - visible);
        return { cw, maxIdx };
    };

    const scroll = (dir) => {
        const { cw, maxIdx } = measure();
        const next = Math.min(Math.max(idxRef.current + dir, 0), maxIdx);
        idxRef.current = next;
        setOffset(next * cw);
    };

    // ---- touch swipe ----
    const touch = useRef({ x: 0, y: 0, locked: null });
    const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: null }; };
    const onTouchMove = (e) => {
        const t = touch.current;
        if (!t.locked) {
            const dx = Math.abs(e.touches[0].clientX - t.x);
            const dy = Math.abs(e.touches[0].clientY - t.y);
            t.locked = dx > dy ? 'h' : 'v';
        }
    };
    const onTouchEnd = (e) => {
        const t = touch.current;
        if (t.locked !== 'h') return;
        const diff = t.x - e.changedTouches[0].clientX;
        if (Math.abs(diff) < 40) return;
        scroll(diff > 0 ? 1 : -1);
    };

    return (
        <div className="rj_carousel_inner">
            <div className="rj_carousel_header">
                <h2 className="rj_carousel_title">{title}</h2>
                <div className="rj_carousel_nav">
                    <button className="rj_carousel_btn" onClick={() => scroll(-1)}>‹</button>
                    <button className="rj_carousel_btn" onClick={() => scroll(1)}>›</button>
                </div>
            </div>
            <div className="rj_carousel_outer">
                <div
                    className="rj_carousel_track"
                    ref={trackRef}
                    style={{ transform: `translateX(-${offset}px)` }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {children}
                </div>
            </div>
            {countLabel && (
                <div className="rj_carousel_footer">
                    <span className="rj_carousel_count">{countLabel}</span>
                </div>
            )}
        </div>
    );
}
