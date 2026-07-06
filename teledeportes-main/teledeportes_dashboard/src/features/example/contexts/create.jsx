import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { MAX_NAME_LEN } from '../../../core/constants/forms';
import { cleanName, truncate } from '../utils/normalize';
import { useCreateItem } from './items';

// TSS vite/03 §"Form state" — per-flow context, mounted only for the
// duration of the create flow. Owns form fields, validation, and the
// final submit. The mutation hook (useCreateItem) lives in items.jsx;
// this context is the form's local state coordinator.

const CreateItemContext = createContext(null);

const INITIAL_TYPE = 'a';
const INITIAL_STATUS = 2;

export function CreateItemProvider({ children }) {
    const navigate = useNavigate();
    const { mutateAsync, isPending, error } = useCreateItem();

    const [name, setName]               = useState('');
    const [description, setDescription] = useState('');
    const [type, setType]               = useState(INITIAL_TYPE);
    const [status, setStatus]           = useState(INITIAL_STATUS);
    const [owner, setOwner]             = useState('');

    const validate = useCallback(() => {
        const cleaned = cleanName(name);
        if (!cleaned) {
            toast.error('El nombre es obligatorio');
            return false;
        }
        if (cleaned.length > MAX_NAME_LEN) {
            toast.error(`El nombre no puede superar ${MAX_NAME_LEN} caracteres`);
            return false;
        }
        if (cleaned !== name) setName(cleaned);
        return true;
    }, [name]);

    const buildPayload = useCallback(() => ({
        name:        cleanName(name),
        description: truncate(description),
        type,
        status,
        owner:       truncate(owner) || null,
    }), [name, description, type, status, owner]);

    const handleCreate = useCallback(async () => {
        if (!validate()) return;
        try {
            await mutateAsync(buildPayload());
            toast.success('Item creado');
            navigate('/admin/example');
        } catch (err) {
            // Backend Joi failure surfaces field errors inline via context.error.
            // Domain failures (409, etc.) get a toast here.
            if (err?.status === 409) toast.error('Ya existe un item con ese nombre');
            else if (!err?.fields) toast.error(err?.message || 'No se pudo crear el item');
        }
    }, [validate, buildPayload, mutateAsync, navigate]);

    const value = useMemo(() => ({
        name, setName,
        description, setDescription,
        type, setType,
        status, setStatus,
        owner, setOwner,
        isPending,
        error,
        handleCreate,
    }), [name, description, type, status, owner, isPending, error, handleCreate]);

    return <CreateItemContext.Provider value={value}>{children}</CreateItemContext.Provider>;
}

export function useCreateItemForm() {
    const ctx = useContext(CreateItemContext);
    if (!ctx) throw new Error('useCreateItemForm must be used inside <CreateItemProvider>');
    return ctx;
}
