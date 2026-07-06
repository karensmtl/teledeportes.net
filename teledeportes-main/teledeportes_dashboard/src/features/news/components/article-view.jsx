import { formatNewsDate } from '../utils/format';
import { VIDEO_NEWS } from '../utils/videos';

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
                    <span className="author">&#9997; {article.author}</span>
                    <span style={{ color: '#2e2e2e' }}>·</span>
                    <span>&#128336; {article.readingTime || '3 min'}</span>
                    <span style={{ color: '#2e2e2e' }}>·</span>
                    <span>&#128197; {formatNewsDate(article.publishedAt)}</span>
                </div>
                <div className="article-hero-img">
                    <img src={article.imageUrl} alt={article.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <p className="article-img-caption">&#128247; Imagen ilustrativa · TELEDEPORTES</p>
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

// Full "video article": embeds the YouTube player plus a strip of more videos.
export function VideoArticleView({ video, onBack, onOpenVideo, onCategory }) {
    const more = VIDEO_NEWS.filter(v => v.id !== video.id).slice(0, 4);

    return (
        <div>
            <div className="article-wrap">
                <div className="article-breadcrumb">
                    <a onClick={onBack}>Inicio</a><span>›</span>
                    <a onClick={() => onCategory(video.categoria)}>{video.categoria}</a><span>›</span>
                    <span>{video.titulo.slice(0, 45)}{video.titulo.length > 45 ? '...' : ''}</span>
                </div>
                <div className="article-top-tag">{video.categoria}</div>
                <h1 className="article-title">{video.titulo}</h1>
                <p className="article-deck">{video.resumen}</p>
                <div className="article-meta">
                    <span className="author">&#9997; {video.autor}</span>
                    <span style={{ color: '#2e2e2e' }}>·</span>
                    <span>&#128197; {video.fecha}</span>
                </div>
                <div className="art_video_wrap">
                    <div className="art_video_label">&#9654; VIDEO</div>
                    <div className="art_video_frame">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                            title={video.titulo}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>
                <p className="article-img-caption" style={{ marginTop: 6 }}>&#9654; {video.titulo} · {video.autor}</p>
                <div className="article-body">
                    <p>{video.resumen}</p>
                    <p>Para ver el video completo, puede <a href={video.link} target="_blank" rel="noopener noreferrer" style={{ color: '#e53e3e', fontWeight: 700 }}>verlo directamente en YouTube</a>.</p>
                </div>
                <button className="article-back-btn" onClick={onBack}>&#8592; Volver a {video.categoria}</button>
            </div>

            <section className="art-relacionados">
                <div className="art-rel-inner">
                    <h2 className="art-rel-heading"><span className="art-rel-line" />Más videos<span className="art-rel-line" /></h2>
                    <div className="art-rel-grid">
                        {more.map(v => (
                            <div className="art-rel-card" key={v.id} onClick={() => onOpenVideo(v.id)} style={{ cursor: 'pointer' }}>
                                <div className="art-rel-img">
                                    <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.titulo} />
                                    <span className="art-rel-cat">{v.categoria}</span>
                                </div>
                                <div className="art-rel-body">
                                    <div className="art-rel-title">{v.titulo}</div>
                                    <div className="art-rel-meta">{v.autor} · {v.fecha}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
