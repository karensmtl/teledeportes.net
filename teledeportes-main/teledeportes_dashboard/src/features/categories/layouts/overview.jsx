import { useState } from 'react';
import toast from 'react-hot-toast';

import { Gate } from '../../../global/contexts/auth/auth';
import { IconPlus, IconEdit, IconTrash } from '../../../common/icons';
import { useCategories, useDeleteCategory } from '../queries/hooks';
import CategoryForm from '../forms/category-form';

export default function CategoriesOverview() {
    const { data, isLoading, isError } = useCategories();
    const remove = useDeleteCategory();
    const [editing, setEditing] = useState(null);   // category | 'new' | null

    const items = data?.items || [];

    const onDelete = async (category) => {
        if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
        try {
            await remove.mutateAsync(category.id);
            toast.success('Categoría eliminada');
        } catch (err) {
            toast.error(err?.message || 'No se pudo eliminar');
        }
    };

    return (
        <section>
            <div className="page-head">
                <div>
                    <h1 className="page-head__title">Categorías</h1>
                    <p className="page-head__subtitle">Organiza el catálogo de videos.</p>
                </div>
                <Gate domain="categories:write">
                    <button className="btn btn--accent" onClick={() => setEditing('new')}>
                        <IconPlus /> Nueva categoría
                    </button>
                </Gate>
            </div>

            <div className="card">
                {isLoading && <p className="empty-state">Cargando…</p>}
                {isError && <p className="empty-state">No se pudieron cargar las categorías.</p>}
                {!isLoading && !isError && items.length === 0 && (
                    <p className="empty-state">Aún no hay categorías. Crea la primera.</p>
                )}
                {items.length > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Videos</th>
                                <th>Orden</th>
                                <th aria-label="acciones" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(cat => (
                                <tr key={cat.id}>
                                    <td><strong>{cat.name}</strong></td>
                                    <td>{cat.description || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}</td>
                                    <td>{cat.videoCount}</td>
                                    <td>{cat.sortOrder}</td>
                                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <Gate domain="categories:write">
                                            <button className="btn btn--ghost btn--sm" onClick={() => setEditing(cat)}>
                                                <IconEdit /> Editar
                                            </button>
                                        </Gate>
                                        <Gate domain="categories:admin">
                                            <button className="btn btn--danger btn--sm" style={{ marginLeft: 8 }} onClick={() => onDelete(cat)}>
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
                <CategoryForm
                    initial={editing === 'new' ? null : editing}
                    onClose={() => setEditing(null)}
                />
            )}
        </section>
    );
}
