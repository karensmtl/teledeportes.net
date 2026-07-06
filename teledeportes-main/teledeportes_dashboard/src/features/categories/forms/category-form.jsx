import { useState } from 'react';
import toast from 'react-hot-toast';

import Modal from '../../../common/components/Modal/Modal';
import { useCreateCategory, useUpdateCategory } from '../queries/hooks';

// Create or edit a category. `initial` null = create mode.
export default function CategoryForm({ initial, onClose }) {
    const isEdit = Boolean(initial);
    const create = useCreateCategory();
    const update = useUpdateCategory();
    const pending = create.isPending || update.isPending;

    const [name, setName] = useState(initial?.name || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
    const [errors, setErrors] = useState({});

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        const body = { name, description, sort_order: Number(sortOrder) };
        try {
            if (isEdit) await update.mutateAsync({ id: initial.id, ...body });
            else await create.mutateAsync(body);
            toast.success(isEdit ? 'Categoría actualizada' : 'Categoría creada');
            onClose();
        } catch (err) {
            if (err?.fields) setErrors(err.fields);
            else toast.error(err?.message || 'No se pudo guardar');
        }
    };

    return (
        <Modal
            title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn--ghost" onClick={onClose} disabled={pending}>Cancelar</button>
                    <button type="submit" form="category-form" className="btn btn--primary" disabled={pending || !name.trim()}>
                        {pending ? 'Guardando…' : 'Guardar'}
                    </button>
                </>
            }
        >
            <form id="category-form" onSubmit={submit}>
                <label className="field">
                    <span>Nombre</span>
                    <input value={name} onChange={e => setName(e.target.value)} autoFocus required />
                    {errors.name && <span className="field__error">{errors.name}</span>}
                </label>

                <label className="field">
                    <span>Descripción</span>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                    {errors.description && <span className="field__error">{errors.description}</span>}
                </label>

                <label className="field">
                    <span>Orden</span>
                    <input type="number" min="0" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                    {errors.sort_order && <span className="field__error">{errors.sort_order}</span>}
                </label>
            </form>
        </Modal>
    );
}
