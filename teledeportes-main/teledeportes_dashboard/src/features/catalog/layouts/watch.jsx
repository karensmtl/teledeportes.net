import { useNavigate, useParams } from 'react-router-dom';

import SiteLayout from '../../news/layouts/site-layout';
import { formatDuration } from '../../../core/constants/media';
import { usePublicVideo, usePublicVideos } from '../queries/hooks';
import VideoPlayer from '../components/video-player';
import VideoCard from '../../news/components/video-card';

import '../../live/layouts/styles/live.css';

// Dedicated page for an uploaded video (/watch/:slug). Site-styled chrome
// (SiteLayout) + the full VOD player (seek/quality/speed) + related videos.
export default function WatchLayout() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const goSection = (key) => navigate(key === 'home' ? '/' : `/?s=${key}`);

    const { data: video, isLoading, isError } = usePublicVideo(slug);
    const { data: relatedData } = usePublicVideos(
        video?.category?.id ? { category_id: video.category.id, limit: 7 } : {},
    );
    const related = (relatedData?.items || []).filter(v => v.slug !== slug).slice(0, 6);

    return (
        <SiteLayout onNavigate={goSection}>
            <div className="live-watch">
                <div className="article-breadcrumb">
                    <a onClick={() => navigate('/')}>Inicio</a><span>›</span>
                    <span>{video?.title || 'Video'}</span>
                </div>

                {isLoading && <p className="live-empty">Cargando…</p>}
                {(isError || (!isLoading && !video)) && (
                    <div className="live-empty">
                        <p>Video no encontrado o aún no disponible.</p>
                        <button className="btn btn--primary" onClick={() => navigate('/')}>Ir al inicio</button>
                    </div>
                )}

                {video && (
                    <>
                        <div className="live-stage"><VideoPlayer src={video.hlsUrl} poster={video.thumbnailUrl} /></div>

                        <div className="live-meta">
                            <span className="live-state">
                                {video.category?.name || 'Video'}
                                {video.durationSeconds != null ? ` · ${formatDuration(video.durationSeconds)}` : ''}
                            </span>
                            <h1 className="live-watch__title">{video.title}</h1>
                            {video.description && <p className="live-watch__desc">{video.description}</p>}
                        </div>

                        {related.length > 0 && (
                            <section className="live-related">
                                <h2 className="art-rel-heading"><span className="art-rel-line" />Más videos<span className="art-rel-line" /></h2>
                                <div className="rj_video_grid">
                                    {related.map(v => <VideoCard key={v.id} video={v} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </SiteLayout>
    );
}
