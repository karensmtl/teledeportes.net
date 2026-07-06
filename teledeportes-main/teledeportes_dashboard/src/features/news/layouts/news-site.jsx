import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { usePublicNews } from '../queries/hooks';
import { usePublicChannels } from '../../live/queries/hooks';
import { NAV_SECTIONS, formatNewsDate, truncate } from '../utils/format';
import { VIDEO_NEWS } from '../utils/videos';

import SiteLayout from './site-layout';
import HeroLive from '../components/hero-live';
import VideoCarousel from '../components/video-carousel';
import NewsCarousel from '../components/news-carousel';
import CategoryPage from '../components/category-page';
import { ArticleView, VideoArticleView } from '../components/article-view';

const navKeyForCategory = (category) => NAV_SECTIONS.find(s => s.category === category)?.key;

// Maps a `?s=` deep-link (used by the live pages' nav) to an initial view.
function viewFromParam(s) {
    if (!s || s === 'home') return { type: 'home' };
    if (s === 'todas') return { type: 'todas' };
    const section = NAV_SECTIONS.find(x => x.key === s);
    if (section?.category) return { type: 'category', category: section.category };
    return { type: 'home' };
}

// The public news site — a single full-bleed surface that switches sections in
// place (home / category / todas / article / video), mirroring the original SPA.
export default function NewsSite() {
    const [searchParams] = useSearchParams();
    const { data, isLoading, isError } = usePublicNews({ limit: 100 });
    const { data: chData } = usePublicChannels();
    const articles = data?.items || [];

    // Top on-air channel feeds the hero's live video.
    const liveChannel = (chData?.items || []).find(c => c.isOnAir) || null;

    const [view, setView] = useState(() => viewFromParam(searchParams.get('s')));

    const go = (next) => { setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const openArticle = (id) => go({ type: 'article', id });
    const openVideo = (id) => go({ type: 'video', id });
    const openCategory = (category) => go({ type: 'category', category });

    const handleNavigate = (key) => {
        if (key === 'home') return go({ type: 'home' });
        if (key === 'todas') return go({ type: 'todas' });
        const section = NAV_SECTIONS.find(s => s.key === key);
        if (section?.category) go({ type: 'category', category: section.category });
    };

    // Active nav highlight derived from the current view.
    let activeKey = 'home';
    if (view.type === 'todas') activeKey = 'todas';
    else if (view.type === 'category') activeKey = navKeyForCategory(view.category);
    else if (view.type === 'article') {
        const art = articles.find(a => a.id === view.id);
        activeKey = art ? navKeyForCategory(art.category) : 'home';
    }

    const deportes = articles.filter(a => a.category === 'DEPORTES');
    const heroSide = (deportes.length ? deportes : articles).slice(0, 4);
    const homeNews = deportes.length ? deportes : articles;

    return (
        <SiteLayout activeKey={activeKey} onNavigate={handleNavigate}>
            {isLoading && <p style={{ padding: 60, textAlign: 'center', color: 'var(--c-muted)' }}>Cargando noticias…</p>}
            {isError && <p style={{ padding: 60, textAlign: 'center', color: 'var(--c-muted)' }}>No se pudieron cargar las noticias.</p>}

            {!isLoading && !isError && (
                <>
                    {view.type === 'home' && (
                        <div className="homePage" style={{ padding: 0 }}>
                            <div className="rj_hero_section">
                                <div className="rj_hero_inner">
                                    <HeroLive key={liveChannel?.slug || 'offline'} channel={liveChannel} />
                                    <div className="rj_hero_side">
                                        {heroSide.map(a => (
                                            <div className="rj_side_item" key={a.id} onClick={() => openArticle(a.id)}>
                                                <div className="rj_side_img">
                                                    <img src={a.imageUrl} alt={a.title} onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
                                                </div>
                                                <div className="rj_side_body">
                                                    <span className="rj_side_cat">{a.category}</span>
                                                    <div className="rj_side_title">{a.title}</div>
                                                    <div className="rj_side_date">{formatNewsDate(a.publishedAt)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <VideoCarousel onOpenVideo={openVideo} />

                            <div className="rj_carousel_section">
                                <NewsCarousel title="Titulares del deporte" articles={homeNews} onOpen={openArticle} />
                            </div>
                        </div>
                    )}

                    {view.type === 'category' && (
                        <CategoryPage
                            category={view.category}
                            articles={articles}
                            onOpen={openArticle}
                            onOpenVideo={openVideo}
                        />
                    )}

                    {view.type === 'todas' && (
                        <div className="page_cat" style={{ display: 'block' }}>
                            <div className="cat_hero">
                                <div className="cat_hero_icon">📋</div>
                                <div className="cat_hero_text">
                                    <h1><span className="cat-accent">T</span>ODAS LAS NOTICIAS</h1>
                                    <p className="parraf">El archivo completo de TELEDEPORTES.</p>
                                </div>
                            </div>
                            <div className="page_wrap">
                                <div className="cat_section_head">
                                    <span className="cat_section_head_title">Archivo completo</span>
                                    <span className="cat_section_head_btn">{articles.length} artículo{articles.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div style={{ padding: '24px 0' }}>
                                    <div className="allNewsGridPage">
                                        {articles.map(a => (
                                            <div className="news_card" key={a.id} onClick={() => openArticle(a.id)} style={{ cursor: 'pointer' }}>
                                                <div><img src={a.imageUrl} alt={a.title} onError={(e) => { e.currentTarget.src = '/logo.png'; }} /></div>
                                                <div className="new_card_cat">{a.category}</div>
                                                <div className="new_card_title"><span>{a.title}</span></div>
                                                <p className="card_text">{truncate(a.summary, 100)}</p>
                                                <div className="autor">{a.author} · {formatNewsDate(a.publishedAt)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {view.type === 'article' && (() => {
                        const article = articles.find(a => a.id === view.id);
                        if (!article) return <p style={{ padding: 60, textAlign: 'center' }}>Artículo no encontrado.</p>;
                        return (
                            <ArticleView
                                article={article}
                                allArticles={articles}
                                onOpen={openArticle}
                                onBack={() => openCategory(article.category)}
                                onCategory={openCategory}
                            />
                        );
                    })()}

                    {view.type === 'video' && (() => {
                        const video = VIDEO_NEWS.find(v => v.id === view.id);
                        if (!video) return <p style={{ padding: 60, textAlign: 'center' }}>Video no encontrado.</p>;
                        return (
                            <VideoArticleView
                                video={video}
                                onBack={() => openCategory(video.categoria)}
                                onOpenVideo={openVideo}
                                onCategory={openCategory}
                            />
                        );
                    })()}
                </>
            )}
        </SiteLayout>
    );
}
