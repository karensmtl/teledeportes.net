import { TICKER_ITEMS } from '../utils/format';

// Breaking-news marquee. Items are duplicated so the -50% keyframe loops seamlessly.
export default function NewsTicker() {
    const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
    return (
        <div className="ticker_bar">
            <div className="ticker_label">Última hora</div>
            <div className="ticker_inner">
                <div className="ticker_track">
                    {loop.map((item, i) => <span key={i}>{item}</span>)}
                </div>
            </div>
        </div>
    );
}
