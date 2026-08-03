import { IconEdit, IconClock, IconCalendar, IconImage } from '../../../common/icons';
import { formatNewsDate } from '../utils/format';

const metaItem = { display: 'inline-flex', alignItems: 'center', gap: 5 };

// Full text article: breadcrumb, headline, deck, meta, hero image, HTML body,
// tags, and a related-articles strip. `article` and `allArticles` come from the
// public feed; related ids are resolved from that same list.
export function ArticleView({ article, allArticles, onOpen, onBack, onCategory }) {
    const related = (article.relatedIds || [])
        .map(rid => allArticles.find(a => a.id === rid))
        .filter(Boolean);

    return (
        <div>
            <div className="article-wrap">
                <div className="article-breadcrumb">
                    <a onClick={onBack}>Inicio</a><span>›</span>
                    <a onClick={() => onCategory(article.category)}>{article.category}</a><span>›</span>
                    <span>{article.title.slice(0, 45)}{article.title.length > 45 ? '...' : ''}</span>
                </div>
                <div className="article-top-tag">{article.category}</div>
                <h1 className="article-title">{article.title}</h1>
                <p className="article-deck">{article.summary}</p>
                <div className="article-meta">
                    <span className="author" style={metaItem}><IconEdit /> {article.author}</span>
                    <span style={{ color: '#2e2e2e' }}>·</span>
                    <span style={metaItem}><IconClock /> {article.readingTime || '3 min'}</span>
                    <span style={{ color: '#2e2e2e' }}>·</span>
                    <span style={metaItem}><IconCalendar /> {formatNewsDate(article.publishedAt)}</span>
                </div>
                <div className="article-hero-img">
                    <img src={article.imageUrl} alt={article.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <p className="article-img-caption" style={metaItem}><IconImage /> Imagen ilustrativa · TELEDEPORTES</p>
                {/* Body is trusted editorial HTML authored in the CMS. */}
                <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body || '' }} />
                <div className="art-tags">
                    {(article.tags || []).map(t => <span className="art-tag" key={t}>#{t}</span>)}
                </div>
                <button className="article-back-btn" onClick={onBack}>&#8592; Volver a {article.category}</button>
            </div>

            <section className="art-relacionados">
                <div className="art-rel-inner">
                    <h2 className="art-rel-heading"><span className="art-rel-line" />Artículos relacionados<span className="art-rel-line" /></h2>
                    <div className="art-rel-grid">
                        {related.length ? related.map(r => (
                            <div className="art-rel-card" key={r.id} onClick={() => onOpen(r.id)}>
                                <div className="art-rel-img">
                                    <img src={r.imageUrl} onError={(e) => { e.currentTarget.src = '/logo.png'; }} alt={r.title} />
                                    <span className="art-rel-cat">{r.category}</span>
                                </div>
                                <div className="art-rel-body">
                                    <div className="art-rel-title">{r.title}</div>
                                    <div className="art-rel-meta">{r.author} · {formatNewsDate(r.publishedAt)}</div>
                                </div>
                            </div>
                        )) : <p className="art-no-rel">No hay artículos relacionados.</p>}
                    </div>
                </div>
            </section>
        </div>
    );
}
