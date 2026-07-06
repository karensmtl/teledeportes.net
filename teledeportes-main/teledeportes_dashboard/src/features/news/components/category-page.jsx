import VideoCarousel from './video-carousel';
import { CATEGORY_META, formatNewsDate, truncate } from '../utils/format';

// A category landing page: hero band, a featured article, a 2-up subgrid of the
// rest, and the category's video carousel. Mirrors the prototype's renderHome
// per-category grid.
export default function CategoryPage({ category, articles, onOpen, onOpenVideo }) {
    const meta = CATEGORY_META[category] || { icon: '📰', blurb: '' };
    const items = articles.filter(a => a.category === category);
    const [featured, ...rest] = items;

    // Group the remaining articles into pairs for the 2-column subgrid.
    const pairs = [];
    for (let i = 0; i < rest.length; i += 2) pairs.push(rest.slice(i, i + 2));

    const heading = `${category.charAt(0)}${category.slice(1).toLowerCase()}`;

    return (
        <div className="page_cat" style={{ display: 'block' }}>
            <div className="cat_hero">
                <div className="cat_hero_icon">{meta.icon}</div>
                <div className="cat_hero_text">
                    <h1><span className="cat-accent">{category.charAt(0)}</span>{heading.slice(1).toUpperCase()}</h1>
                    <p className="parraf">{meta.blurb}</p>
                </div>
            </div>

            <div className="page_wrap">
                <div className="cat_section_head">
                    <span className="cat_section_head_title">Últimas en {heading}</span>
                    <span className="cat_section_head_btn">{items.length} artículo{items.length !== 1 ? 's' : ''}</span>
                </div>

                {!items.length && (
                    <p style={{ color: '#555', padding: 40, textAlign: 'center' }}>No hay artículos en esta categoría aún.</p>
                )}

                {items.length > 0 && (
                    <div className="cat_grid">
                        <div className="cat_card featured" onClick={() => onOpen(featured.id)} style={{ cursor: 'pointer' }}>
                            <div className="cat_card_img"><img src={featured.imageUrl} alt={featured.title} onError={(e) => { e.currentTarget.src = '/logo.png'; }} /></div>
                            <div className="cat_card_body">
                                <div className="cat_card_cat">DESTACADO</div>
                                <div className="cat_card_title">{featured.title}</div>
                                <p className="cat_card_text">{featured.summary}</p>
                                <div className="autor">{formatNewsDate(featured.publishedAt)} · {featured.author}</div>
                            </div>
                        </div>

                        {pairs.map((pair, i) => (
                            <div className="cat_subgrid" key={i}>
                                {pair.map(a => (
                                    <div className="cat_card" key={a.id} onClick={() => onOpen(a.id)} style={{ cursor: 'pointer' }}>
                                        <div className="cat_card_img"><img src={a.imageUrl} alt={a.title} onError={(e) => { e.currentTarget.src = '/logo.png'; }} /></div>
                                        <div className="cat_card_body">
                                            <div className="cat_card_cat">{a.category}</div>
                                            <div className="cat_card_title">{a.title}</div>
                                            <p className="cat_card_text">{truncate(a.summary, 90)}</p>
                                            <div className="autor">{formatNewsDate(a.publishedAt)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <VideoCarousel category={category} onOpenVideo={onOpenVideo} />
        </div>
    );
}
