import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Gate, useAuth } from '../../../global/contexts/auth/auth';
import { api } from '../../../core/network/api';
import { MAX_NAME_LEN } from '../../../core/constants/forms';

import './styles/SimpleCrud.css';

// Generic CRUD UI for { id, name, description } catalog entities.
// Drop-in for any backend endpoint that exposes GET/POST/PUT/DELETE on
// a flat resource with a unique `name` constraint.
//
// Props:
//   title          — heading (e.g., "Grupos")
//   subtitle       — short description under the heading
//   endpoint       — backend resource path (e.g., 'users/groups')
//   readDomain     — authz domain required to view (e.g., 'users:groups:read')
//   writeDomain    — authz domain required to create/edit/delete
//   countLabel     — label for the foreign-key-usage column ("Usuarios en este grupo")
//   countField     — field on each row indicating dependent count (default 'count')
//   notDeletableHint — message shown when delete is blocked by FK reference

export default function SimpleCrud({
    title,
    subtitle,
    endpoint,
    readDomain,
    writeDomain,
    countLabel = null,
    countField = 'count',
    notDeletableHint = 'Reasigna los registros que dependen antes de eliminar.',
}) {
    const { can } = useAuth();
    const queryKey = ['simple-crud', endpoint];

    const { data: items = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: ({ signal }) => api.get(endpoint, { signal }).then(r => r.data),
        enabled: !readDomain || can(readDomain),
    });

    const [editing, setEditing]   = useState(null); // null | 'new' | { id, name, description }
    const [deleting, setDeleting] = useState(null); // null | row object

    const canWrite = !writeDomain || can(writeDomain);

    if (isLoading) return <div className="simple-crud__loading">Cargando {title.toLowerCase()}...</div>;
    if (error) return <div className="simple-crud__error">{error.message || 'No se pudo cargar el catálogo'}</div>;

    return (
        <section className="simple-crud">
            <header className="simple-crud__header">
                <div>
                    <h2 className="simple-crud__title">{title}</h2>
                    {subtitle && <p className="simple-crud__subtitle">{subtitle}</p>}
                </div>
                <Gate domain={writeDomain}>
                    <button
                        type="button"
                        className="simple-crud__add"
                        onClick={() => setEditing('new')}
                    >
                        + Nuevo
                    </button>
                </Gate>
            </header>

            <div className="simple-crud__table">
                <div className="simple-crud__row simple-crud__row--head">
                    <span>Nombre</span>
                    <span>Descripción</span>
                    {countLabel && <span className="simple-crud__row-count">{countLabel}</span>}
                    {canWrite && <span className="simple-crud__row-actions">Acciones</span>}
                </div>

                {items.length === 0 && (
                    <div className="simple-crud__empty">Sin registros</div>
                )}

                {items.map((row) => (
                    <div key={row.id} className="simple-crud__row">
                        <span className="simple-crud__row-name">{row.name}</span>
                        <span className="simple-crud__row-desc">{row.description || '—'}</span>
                        {countLabel && (
                            <span className="simple-crud__row-count">
                                {row[countField] ?? 0}
                            </span>
                        )}
                        {canWrite && (
                            <span className="simple-crud__row-actions">
                                <button
                                    type="button"
                                    onClick={() => setEditing({ ...row })}
                                    className="simple-crud__action"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleting(row)}
                                    className="simple-crud__action simple-crud__action--danger"
                                >
                                    Eliminar
                                </button>
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {editing && (
                <SimpleCrudForm
                    endpoint={endpoint}
                    queryKey={queryKey}
                    initial={editing === 'new' ? null : editing}
                    onClose={() => setEditing(null)}
                />
            )}

            {deleting && (
                <SimpleCrudDelete
                    endpoint={endpoint}
                    queryKey={queryKey}
                    row={deleting}
                    countField={countField}
                    countLabel={countLabel}
                    notDeletableHint={notDeletableHint}
                    onClose={() => setDeleting(null)}
                />
            )}
        </section>
    );
}

// ---- form modal ----

function SimpleCrudForm({ endpoint, queryKey, initial, onClose }) {
    const qc = useQueryClient();
    const isEdit = !!initial;

    const [name, setName]               = useState(initial?.name || '');
    const [description, setDescription] = useState(initial?.description || '');

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (payload) => (
            isEdit
                ? api.put(`${endpoint}/${initial.id}`, payload).then(r => r.data)
                : api.post(endpoint, payload).then(r => r.data)
        ),
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        try {
            await mutateAsync({ name: trimmed, description: description.trim() || null });
            toast.success(isEdit ? 'Registro actualizado' : 'Registro creado');
            onClose();
        } catch (err) {
            if (err?.status === 409) toast.error('Ya existe un registro con este nombre');
            else if (!err?.fields) toast.error(err?.message || 'No se pudo guardar');
        }
    };

    const fieldError = (field) => error?.fields?.[field];

    return (
        <div className="simple-crud__overlay" onClick={onClose}>
            <form
                className="simple-crud__modal"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h3 className="simple-crud__modal-title">
                    {isEdit ? 'Editar registro' : 'Nuevo registro'}
                </h3>

                <label className="simple-crud__field">
                    <span>Nombre</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={MAX_NAME_LEN}
                        autoFocus
                        disabled={isPending}
                    />
                    {fieldError('name') && (
                        <span className="simple-crud__field-error">{fieldError('name')}</span>
                    )}
                </label>

                <label className="simple-crud__field">
                    <span>Descripción</span>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isPending}
                    />
                </label>

                <div className="simple-crud__modal-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="simple-crud__action"
                        disabled={isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="simple-crud__action simple-crud__action--primary"
                        disabled={isPending || !name.trim()}
                    >
                        {isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ---- delete modal ----

function SimpleCrudDelete({ endpoint, queryKey, row, countField, countLabel, notDeletableHint, onClose }) {
    const qc = useQueryClient();
    const inUse = countLabel && (row[countField] ?? 0) > 0;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => api.delete(`${endpoint}/${row.id}`).then(r => r.data),
        onSuccess:  () => qc.invalidateQueries({ queryKey }),
    });

    const handleDelete = async () => {
        try {
            await mutateAsync();
            toast.success('Registro eliminado');
            onClose();
        } catch (err) {
            toast.error(err?.message || 'No se pudo eliminar');
        }
    };

    return (
        <div className="simple-crud__overlay" onClick={onClose}>
            <div className="simple-crud__modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="simple-crud__modal-title">Eliminar "{row.name}"</h3>

                {inUse ? (
                    <p className="simple-crud__warning">
                        Tiene {row[countField]} {countLabel.toLowerCase()}. {notDeletableHint}
                    </p>
                ) : (
                    <p className="simple-crud__warning">
                        Esta acción no se puede deshacer.
                    </p>
                )}

                <div className="simple-crud__modal-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="simple-crud__action"
                        disabled={isPending}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="simple-crud__action simple-crud__action--danger"
                        disabled={isPending || inUse}
                    >
                        {isPending ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
