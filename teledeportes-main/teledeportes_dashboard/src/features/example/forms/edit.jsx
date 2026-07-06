import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useDeleteItem, useItem, useUpdateItem } from '../contexts/items';
import { MAX_NAME_LEN } from '../../../core/constants/forms';
import { Gate } from '../../../global/contexts/auth/auth';
import { cleanName, truncate } from '../utils/normalize';

import '../styles/form.css';

// Simpler than the create flow: no per-form context, just local useState
// seeded from useItem(id). Demonstrates the "small form = local state"
// shape from TSS vite/03 §"Form state".

function buildForm(item) {
    return {
        name:        item.name || '',
        description: item.description || '',
        type:        item.type || 'a',
        status:      item.status ?? 2,
        owner:       item.owner || '',
    };
}

export default function EditItemForm({ itemId }) {
    const navigate = useNavigate();
    const { data: item, isLoading } = useItem(itemId);
    const { mutateAsync: updateItem, isPending: updating, error: updateError } = useUpdateItem(itemId);
    const { mutateAsync: deleteItem, isPending: deleting } = useDeleteItem();

    const [form, setForm]           = useState(null);
    const [seededFor, setSeededFor] = useState(null);

    // "Adjust state when an external value changes" pattern (React 19).
    // setState-during-render is the recommended replacement for the
    // useEffect+setState anti-pattern when deriving from a fetched value.
    if (item && seededFor !== item.id) {
        setSeededFor(item.id);
        setForm(buildForm(item));
    }

    const fieldError = (field) => updateError?.fields?.[field];
    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    if (isLoading || !form) return <div className="item-form__loading">Cargando item...</div>;
    if (!item) return <div className="item-form__loading">Item no encontrado</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleaned = cleanName(form.name);
        if (!cleaned) {
            toast.error('El nombre es obligatorio');
            return;
        }
        try {
            await updateItem({
                name:        cleaned,
                description: truncate(form.description),
                type:        form.type,
                status:      form.status,
                owner:       truncate(form.owner) || null,
            });
            toast.success('Item actualizado');
            navigate('/admin/example');
        } catch (err) {
            if (!err?.fields) toast.error(err?.message || 'No se pudo actualizar el item');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Eliminar "${item.name}"?`)) return;
        try {
            await deleteItem(itemId);
            toast.success('Item eliminado');
            navigate('/admin/example');
        } catch (err) {
            toast.error(err?.message || 'No se pudo eliminar el item');
        }
    };

    return (
        <form className="item-form" onSubmit={handleSubmit}>
            <header className="item-form__header">
                <h2>Editar item #{item.id}</h2>
            </header>

            <div className="item-form__grid">
                <label className="item-form__field item-form__field--full">
                    <span>Nombre</span>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        maxLength={MAX_NAME_LEN}
                        disabled={updating}
                    />
                    {fieldError('name') && (
                        <span className="item-form__error">{fieldError('name')}</span>
                    )}
                </label>

                <label className="item-form__field">
                    <span>Tipo</span>
                    <select
                        value={form.type}
                        onChange={(e) => updateField('type', e.target.value)}
                        disabled={updating}
                    >
                        <option value="a">Tipo A</option>
                        <option value="b">Tipo B</option>
                        <option value="c">Tipo C</option>
                    </select>
                </label>

                <label className="item-form__field">
                    <span>Estado</span>
                    <select
                        value={form.status}
                        onChange={(e) => updateField('status', Number(e.target.value))}
                        disabled={updating}
                    >
                        <option value={2}>Activo</option>
                        <option value={1}>Inactivo</option>
                    </select>
                </label>

                <label className="item-form__field item-form__field--full">
                    <span>Dueño</span>
                    <input
                        type="text"
                        value={form.owner}
                        onChange={(e) => updateField('owner', e.target.value)}
                        disabled={updating}
                        placeholder="Opcional"
                    />
                </label>

                <label className="item-form__field item-form__field--full">
                    <span>Descripción</span>
                    <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        disabled={updating}
                    />
                </label>
            </div>

            <footer className="item-form__footer">
                <Link to="/admin/example" className="item-form__cancel">Volver</Link>

                <Gate domain="items:admin">
                    <button
                        type="button"
                        className="item-form__danger"
                        onClick={handleDelete}
                        disabled={updating || deleting}
                    >
                        {deleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </Gate>

                <button
                    type="submit"
                    className="item-form__submit"
                    disabled={updating || !form.name.trim()}
                >
                    {updating ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </footer>
        </form>
    );
}
