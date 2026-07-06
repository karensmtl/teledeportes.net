import { Link } from 'react-router-dom';

import { CreateItemProvider, useCreateItemForm } from '../contexts/create';
import { MAX_NAME_LEN } from '../../../core/constants/forms';

import '../styles/form.css';

const TYPE_OPTIONS = [
    { value: 'a', label: 'Tipo A' },
    { value: 'b', label: 'Tipo B' },
    { value: 'c', label: 'Tipo C' },
];

const STATUS_OPTIONS = [
    { value: 2, label: 'Activo' },
    { value: 1, label: 'Inactivo' },
];

function CreateItemFormWrapper() {
    const {
        name, setName,
        description, setDescription,
        type, setType,
        status, setStatus,
        owner, setOwner,
        isPending, error,
        handleCreate,
    } = useCreateItemForm();

    const fieldError = (field) => error?.fields?.[field];

    return (
        <form
            className="item-form"
            onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
        >
            <header className="item-form__header">
                <h2>Nuevo item</h2>
                <p>Demuestra TSS vite/03 (per-form context) y vite/04 (ApiError.fields inline).</p>
            </header>

            <div className="item-form__grid">
                <label className="item-form__field item-form__field--full">
                    <span>Nombre</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={MAX_NAME_LEN}
                        disabled={isPending}
                        autoFocus
                    />
                    {fieldError('name') && (
                        <span className="item-form__error">{fieldError('name')}</span>
                    )}
                </label>

                <label className="item-form__field">
                    <span>Tipo</span>
                    <select value={type} onChange={(e) => setType(e.target.value)} disabled={isPending}>
                        {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </label>

                <label className="item-form__field">
                    <span>Estado</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(Number(e.target.value))}
                        disabled={isPending}
                    >
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </label>

                <label className="item-form__field item-form__field--full">
                    <span>Dueño</span>
                    <input
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        disabled={isPending}
                        placeholder="Opcional"
                    />
                    {fieldError('owner') && (
                        <span className="item-form__error">{fieldError('owner')}</span>
                    )}
                </label>

                <label className="item-form__field item-form__field--full">
                    <span>Descripción</span>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isPending}
                    />
                </label>
            </div>

            <footer className="item-form__footer">
                <Link to="/admin/example" className="item-form__cancel">Cancelar</Link>
                <button
                    type="submit"
                    className="item-form__submit"
                    disabled={isPending || !name.trim()}
                >
                    {isPending ? 'Creando...' : 'Crear item'}
                </button>
            </footer>
        </form>
    );
}

export default function CreateItemForm() {
    return (
        <CreateItemProvider>
            <CreateItemFormWrapper />
        </CreateItemProvider>
    );
}
