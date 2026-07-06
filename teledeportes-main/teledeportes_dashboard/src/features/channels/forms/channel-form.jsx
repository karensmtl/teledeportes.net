import { useState } from 'react';
import toast from 'react-hot-toast';

import Modal from '../../../common/components/Modal/Modal';
import { useCreateChannel, useUpdateChannel } from '../queries/hooks';

export default function ChannelForm({ initial, onClose }) {
    const isEdit = Boolean(initial);
    const create = useCreateChannel();
    const update = useUpdateChannel();
    const pending = create.isPending || update.isPending;

    const [name, setName] = useState(initial?.name || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [externalHlsUrl, setExternalHlsUrl] = useState(initial?.externalHlsUrl || '');
    const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
    const [errors, setErrors] = useState({});

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        const body = {
            name,
            description,
            external_hls_url: externalHlsUrl.trim(),
            sort_order: Number(sortOrder),
        };
        try {
            if (isEdit) await update.mutateAsync({ id: initial.id, ...body });
            else await create.mutateAsync(body);
            toast.success(isEdit ? 'Canal actualizado' : 'Canal creado');
            onClose();
        } catch (err) {
            if (err?.fields) setErrors(err.fields);
            else toast.error(err?.message || 'No se pudo guardar');
        }
    };

    return (
        <Modal
            title={isEdit ? 'Editar canal' : 'Nuevo canal'}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn--ghost" onClick={onClose} disabled={pending}>Cancelar</button>
                    <button type="submit" form="channel-form" className="btn btn--primary" disabled={pending || !name.trim()}>
                        {pending ? 'Guardando…' : 'Guardar'}
                    </button>
                </>
            }
        >
            <form id="channel-form" onSubmit={submit}>
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
                    <span>Stream externo (HLS / WebRTC)</span>
                    <input
                        type="url"
                        value={externalHlsUrl}
                        onChange={e => setExternalHlsUrl(e.target.value)}
                        placeholder="http://ejemplo.com/live/canal/index.m3u8"
                    />
                    {errors.external_hls_url && <span className="field__error">{errors.external_hls_url}</span>}
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        Opcional. El player detecta el tipo automáticamente: HLS (.m3u8) o WebRTC
                        (ws://…/whep). Si lo defines, el canal reproduce ese stream directamente y
                        se marca al aire mientras esté activo (ignora la clave de transmisión/OME).
                        RTMP es solo para ingesta, no se reproduce en el navegador.
                    </span>
                </label>

                <label className="field">
                    <span>Orden</span>
                    <input type="number" min="0" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                    {errors.sort_order && <span className="field__error">{errors.sort_order}</span>}
                </label>

                {!isEdit && (
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        Al crear el canal se genera una clave de transmisión. La verás en la lista
                        para configurarla en tu encoder (OBS, etc.).
                    </p>
                )}
            </form>
        </Modal>
    );
}
