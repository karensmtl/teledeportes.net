import { useState } from 'react';
import toast from 'react-hot-toast';

import { Gate } from '../../../global/contexts/auth/auth';
import { formatDuration } from '../../../core/constants/media';
import { useCategories } from '../../categories/queries/hooks';
import { useVideos, useReprocessVideo, useDeleteVideo, useSetVideoThumbnail } from '../queries/hooks';
import StatusBadge from '../components/status-badge';
import UploadForm from '../forms/upload-form';
import ThumbnailUpload from '../../../common/components/ThumbnailUpload/ThumbnailUpload';
import { IconUpload, IconPlay, IconRefresh, IconTrash } from '../../../common/icons';

import '../styles/videos.css';

export default function VideosOverview() {
    const [categoryId, setCategoryId] = useState('');
    const [uploading, setUploading] = useState(false);

    const params = categoryId ? { category_id: categoryId } : {};
    const { data, isLoading, isError } = useVideos(params);
    const { data: catData } = useCategories();
    const reprocess = useReprocessVideo();
    const remove = useDeleteVideo();
    const setThumb = useSetVideoThumbnail();

    const items = data?.items || [];
    const categories = catData?.items || [];

    const onReprocess = async (video) => {
        try { await reprocess.mutateAsync(video.id); toast.success('Reprocesando…'); }
        catch (err) { toast.error(err?.message || 'No se pudo reprocesar'); }
    };

    const onDelete = async (video) => {
        if (!window.confirm(`¿Eliminar "${video.title}"?`)) return;
        try { await remove.mutateAsync(video.id); toast.success('Video eliminado'); }
        catch (err) { toast.error(err?.message || 'No se pudo eliminar'); }
    };

    const onThumb = async (video, file) => {
        try { await setThumb.mutateAsync({ id: video.id, file }); toast.success('Miniatura actualizada'); }
        catch (err) { toast.error(err?.message || 'No se pudo subir la miniatura'); }
    };

    return (
        <section>
            <div className="page-head">
                <div>
                    <h1 className="page-head__title">Videos</h1>
                    <p className="page-head__subtitle">Sube y administra el catálogo VOD.</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <select className="videos__filter" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <Gate domain="videos:write">
                        <button className="btn btn--accent" onClick={() => setUploading(true)}>
                            <IconUpload size={16} /> Subir video
                        </button>
                    </Gate>
                </div>
            </div>

            {isLoading && <div className="card empty-state">Cargando…</div>}
            {isError && <div className="card empty-state">No se pudieron cargar los videos.</div>}
            {!isLoading && !isError && items.length === 0 && (
                <div className="card empty-state">Aún no hay videos. Sube el primero.</div>
            )}

            <div className="videos__grid">
                {items.map(video => (
                    <article key={video.id} className="video-tile">
                        <div className="video-tile__thumb">
                            {video.thumbnailUrl
                                ? <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
                                : <span className="video-tile__placeholder"><IconPlay size={28} /></span>}
                            {video.durationSeconds != null && (
                                <span className="video-tile__duration">{formatDuration(video.durationSeconds)}</span>
                            )}
                        </div>
                        <div className="video-tile__body">
                            <div className="video-tile__top">
                                <StatusBadge status={video.processingStatus} />
                                {video.category && <span className="video-tile__category">{video.category.name}</span>}
                            </div>
                            <h3 className="video-tile__title">{video.title}</h3>
                            {video.processingStatus === 'failed' && video.error && (
                                <p className="video-tile__error">{video.error}</p>
                            )}
                            <div className="video-tile__actions">
                                <Gate domain="videos:write">
                                    <ThumbnailUpload onSelect={(f) => onThumb(video, f)}>Miniatura</ThumbnailUpload>
                                    {video.processingStatus === 'failed' && (
                                        <button className="btn btn--ghost btn--sm" onClick={() => onReprocess(video)}>
                                            <IconRefresh size={14} /> Reprocesar
                                        </button>
                                    )}
                                </Gate>
                                <Gate domain="videos:admin">
                                    <button className="btn btn--danger btn--sm" onClick={() => onDelete(video)}>
                                        <IconTrash /> Eliminar
                                    </button>
                                </Gate>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {uploading && <UploadForm onClose={() => setUploading(false)} />}
        </section>
    );
}
