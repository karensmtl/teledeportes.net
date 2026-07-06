import { Link } from 'react-router-dom';

import { useAuth } from '../../global/contexts/auth/auth';
import { useVideos } from '../../features/videos/queries/hooks';
import { useCategories } from '../../features/categories/queries/hooks';
import { formatDuration } from '../../core/constants/media';
import StatusBadge from '../../features/videos/components/status-badge';
import { IconUpload } from '../../common/icons';

import '../styles/dashboard.css';

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: vids } = useVideos({ limit: 200 });
    const { data: cats } = useCategories({ limit: 200 });

    const items = vids?.items || [];
    const totalVideos = vids?.pagination?.total ?? items.length;
    const ready = items.filter(v => v.processingStatus === 'ready').length;
    const processing = items.filter(v => ['pending', 'processing'].includes(v.processingStatus)).length;
    const totalCats = cats?.pagination?.total ?? (cats?.items?.length || 0);

    const stats = [
        { label: 'Videos', value: totalVideos, tone: 'info' },
        { label: 'Listos', value: ready, tone: 'success' },
        { label: 'Procesando', value: processing, tone: 'warning' },
        { label: 'Categorías', value: totalCats, tone: 'accent' },
    ];

    const recent = items.slice(0, 5);

    return (
        <section>
            <div className="page-head">
                <div>
                    <h1 className="page-head__title">Hola, {user?.name?.split(' ')[0] || 'admin'}</h1>
                    <p className="page-head__subtitle">Resumen del catálogo de TeleDeportes.</p>
                </div>
                <Link to="/admin/videos" className="btn btn--accent">
                    <IconUpload size={16} /> Subir video
                </Link>
            </div>

            <div className="dashboard__stats">
                {stats.map(s => (
                    <div key={s.label} className={`dashboard__stat dashboard__stat--${s.tone}`}>
                        <span className="dashboard__stat-value">{s.value}</span>
                        <span className="dashboard__stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            <div className="card dashboard__recent">
                <div className="dashboard__recent-head">
                    <h2>Videos recientes</h2>
                    <Link to="/admin/videos" className="dashboard__link">Ver todos →</Link>
                </div>
                {recent.length === 0
                    ? <p className="empty-state">Aún no hay videos.</p>
                    : (
                        <table className="table">
                            <thead>
                                <tr><th>Título</th><th>Categoría</th><th>Duración</th><th>Estado</th></tr>
                            </thead>
                            <tbody>
                                {recent.map(v => (
                                    <tr key={v.id}>
                                        <td><strong>{v.title}</strong></td>
                                        <td>{v.category?.name || '—'}</td>
                                        <td>{formatDuration(v.durationSeconds)}</td>
                                        <td><StatusBadge status={v.processingStatus} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>
        </section>
    );
}
