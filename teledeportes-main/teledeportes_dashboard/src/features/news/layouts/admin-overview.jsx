import { useState } from 'react';
import toast from 'react-hot-toast';

import { Gate } from '../../../global/contexts/auth/auth';
import { IconPlus, IconEdit, IconTrash } from '../../../common/icons';
import { formatNewsDate } from '../utils/format';
import { useAdminNews, useDeleteArticle } from '../queries/hooks';
import ArticleForm from '../forms/article-form';

// Admin CMS for the news site — list, create, edit and soft-delete articles.
// Mirrors the categories overview pattern (table + modal form + Gate).
export default function NewsAdminOverview() {
    const { data, isLoading, isError } = useAdminNews();
    const remove = useDeleteArticle();
    const [editing, setEditing] = useState(null);   // article | 'new' | null

    const items = data?.items || [];

    const onDelete = async (article) => {
        if (!window.confirm(`¿Eliminar la noticia "${article.title}"?`)) return;
        try {
            await remove.mutateAsync(article.id);
            toast.success('Noticia eliminada');
        } catch (err) {
            toast.error(err?.message || 'No se pudo eliminar');
        }
    };

    const others = editing && editing !== 'new'
        ? items.filter(a => a.id !== editing.id)
        : items;

    return (
        <section>
            <div className="page-head">
                <div>
                    <h1 className="page-head__title">Noticias</h1>
                    <p className="page-head__subtitle">Administra los artículos del sitio público.</p>
                </div>
                <Gate domain="noticias:write">
                    <button className="btn btn--accent" onClick={() => setEditing('new')}>
                        <IconPlus /> Nueva noticia
                    </button>
                </Gate>
            </div>

            <div className="card">
                {isLoading && <p className="empty-state">Cargando…</p>}
                {isError && <p className="empty-state">No se pudieron cargar las noticias.</p>}
                {!isLoading && !isError && items.length === 0 && (
                    <p className="empty-state">Aún no hay noticias. Crea la primera.</p>
                )}
                {items.length > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Categoría</th>
                                <th>Autor</th>
                                <th>Publicada</th>
                                <th aria-label="acciones" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(a => (
                                <tr key={a.id}>
                                    <td><strong>{a.title}</strong></td>
                                    <td><span className="pill pill--info">{a.category}</span></td>
                                    <td>{a.author}</td>
                                    <td>{formatNewsDate(a.publishedAt)}</td>
                                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <Gate domain="noticias:write">
                                            <button className="btn btn--ghost btn--sm" onClick={() => setEditing(a)}>
                                                <IconEdit /> Editar
                                            </button>
                                        </Gate>
                                        <Gate domain="noticias:admin">
                                            <button className="btn btn--danger btn--sm" style={{ marginLeft: 8 }} onClick={() => onDelete(a)}>
                                                <IconTrash /> Eliminar
                                            </button>
                                        </Gate>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {editing && (
                <ArticleForm
                    initial={editing === 'new' ? null : editing}
                    others={others}
                    onClose={() => setEditing(null)}
                />
            )}
        </section>
    );
}
