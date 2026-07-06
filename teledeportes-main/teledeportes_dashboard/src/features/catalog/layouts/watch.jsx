import { Link, useParams } from 'react-router-dom';

import { formatDuration } from '../../../core/constants/media';
import { usePublicVideo, usePublicVideos } from '../queries/hooks';
import VideoPlayer from '../components/video-player';
import CatalogCard from '../components/catalog-card';

import './styles/watch.css';

export default function WatchLayout() {
    const { slug } = useParams();
    const { data: video, isLoading, isError } = usePublicVideo(slug);

    const { data: relatedData } = usePublicVideos(
        video?.category?.id ? { category_id: video.category.id, limit: 7 } : {},
    );
    const related = (relatedData?.items || []).filter(v => v.slug !== slug).slice(0, 6);

    return (
        <div className="watch">
            <header className="watch__bar">
                <Link to="/" className="watch__brand">
                    <img className="watch__logo" src="/td.png" alt="" aria-hidden="true" />
                    <span className="watch__brand-text">Tele<span className="watch__brand-accent">Deportes</span></span>
                </Link>
                <Link to="/" className="watch__back">← Volver</Link>
            </header>

            <main className="watch__main">
                {isLoading && <p className="empty-state">Cargando…</p>}
                {(isError || (!isLoading && !video)) && (
                    <div className="empty-state">
                        <p>Video no encontrado o aún no disponible.</p>
                        <Link to="/" className="btn btn--primary">Ir al inicio</Link>
                    </div>
                )}

                {video && (
                    <>
                        <VideoPlayer src={video.hlsUrl} poster={video.thumbnailUrl} />

                        <div className="watch__meta">
                            <div className="watch__meta-tags">
                                {video.category && <span className="watch__category">{video.category.name}</span>}
                                {video.durationSeconds != null && (
                                    <span className="watch__duration">{formatDuration(video.durationSeconds)}</span>
                                )}
                            </div>
                            <h1 className="watch__title">{video.title}</h1>
                            {video.description && <p className="watch__description">{video.description}</p>}
                        </div>

                        {related.length > 0 && (
                            <section className="watch__related">
                                <h2 className="watch__related-title">Más videos</h2>
                                <div className="watch__related-grid">
                                    {related.map(v => <CatalogCard key={v.id} video={v} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
