import { useState } from 'react';
import toast from 'react-hot-toast';

import { Gate } from '../../../global/contexts/auth/auth';
import { IconPlus, IconEdit, IconTrash, IconEye, IconEyeOff } from '../../../common/icons';
import { useChannels, useDeleteChannel, useSetChannelOnAir, useSetChannelThumbnail } from '../queries/hooks';
import ChannelForm from '../forms/channel-form';
import ThumbnailUpload from '../../../common/components/ThumbnailUpload/ThumbnailUpload';

import '../styles/channels.css';

function copy(text, label) {
    navigator.clipboard?.writeText(text).then(
        () => toast.success(`${label} copiado`),
        () => toast.error('No se pudo copiar'),
    );
}

export default function ChannelsOverview() {
    const { data, isLoading, isError } = useChannels();
    const remove = useDeleteChannel();
    const setOnAir = useSetChannelOnAir();
    const setThumb = useSetChannelThumbnail();
    const [editing, setEditing] = useState(null);   // channel | 'new' | null
    const [revealed, setRevealed] = useState({});    // { [id]: bool }

    const items = data?.items || [];

    const onDelete = async (channel) => {
        if (!window.confirm(`¿Eliminar el canal "${channel.name}"?`)) return;
        try { await remove.mutateAsync(channel.id); toast.success('Canal eliminado'); }
        catch (err) { toast.error(err?.message || 'No se pudo eliminar'); }
    };

    const toggleOnAir = async (channel) => {
        try { await setOnAir.mutateAsync({ id: channel.id, on_air: !channel.isOnAir }); }
        catch (err) { toast.error(err?.message || 'No se pudo cambiar el estado'); }
    };

    const onThumb = async (channel, file) => {
        try { await setThumb.mutateAsync({ id: channel.id, file }); toast.success('Miniatura actualizada'); }
        catch (err) { toast.error(err?.message || 'No se pudo subir la miniatura'); }
    };

    return (
        <section>
            <div className="page-head">
                <div>
                    <h1 className="page-head__title">Canales en vivo</h1>
                    <p className="page-head__subtitle">Transmisiones WebRTC de ultra baja latencia.</p>
                </div>
                <Gate domain="channels:write">
                    <button className="btn btn--accent" onClick={() => setEditing('new')}>
                        <IconPlus /> Nuevo canal
                    </button>
                </Gate>
            </div>

            <div className="card">
                {isLoading && <p className="empty-state">Cargando…</p>}
                {isError && <p className="empty-state">No se pudieron cargar los canales.</p>}
                {!isLoading && !isError && items.length === 0 && (
                    <p className="empty-state">Aún no hay canales. Crea el primero.</p>
                )}
                {items.length > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Canal</th>
                                <th>Ingest (encoder)</th>
                                <th aria-label="acciones" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(ch => (
                                <tr key={ch.id}>
                                    <td>
                                        <span className={`pill ${ch.isOnAir ? 'pill--danger' : 'pill--info'}`}>
                                            {ch.isOnAir && <span className="channel-dot" />}
                                            {ch.isOnAir ? 'EN VIVO' : 'Fuera del aire'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="channel-cell">
                                            {ch.thumbnailUrl
                                                ? <img className="channel-thumb" src={ch.thumbnailUrl} alt="" />
                                                : <span className="channel-thumb channel-thumb--empty" />}
                                            <div>
                                                <strong>{ch.name}</strong>
                                                <div className="channel-slug">/{ch.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="channel-ingest">
                                            <code className="channel-key">
                                                {revealed[ch.id] ? ch.streamKey : '•'.repeat(20)}
                                            </code>
                                            <button
                                                className="btn btn--ghost btn--sm"
                                                onClick={() => setRevealed(r => ({ ...r, [ch.id]: !r[ch.id] }))}
                                                title={revealed[ch.id] ? 'Ocultar' : 'Mostrar clave'}
                                            >
                                                {revealed[ch.id] ? <IconEyeOff /> : <IconEye />}
                                            </button>
                                            <button className="btn btn--ghost btn--sm" onClick={() => copy(ch.streamKey, 'Clave')}>
                                                Copiar clave
                                            </button>
                                            <button className="btn btn--ghost btn--sm" onClick={() => copy(ch.ingest?.rtmp, 'URL RTMP')}>
                                                Copiar RTMP
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <Gate domain="channels:write">
                                            <button className="btn btn--ghost btn--sm" onClick={() => toggleOnAir(ch)}>
                                                {ch.isOnAir ? 'Sacar del aire' : 'Poner al aire'}
                                            </button>
                                            <ThumbnailUpload className="btn btn--ghost btn--sm" onSelect={(f) => onThumb(ch, f)}>
                                                Miniatura
                                            </ThumbnailUpload>
                                            <button className="btn btn--ghost btn--sm" style={{ marginLeft: 8 }} onClick={() => setEditing(ch)}>
                                                <IconEdit /> Editar
                                            </button>
                                        </Gate>
                                        <a className="btn btn--ghost btn--sm" style={{ marginLeft: 8 }} href={`/vivo/${ch.slug}`} target="_blank" rel="noreferrer">
                                            Ver
                                        </a>
                                        <Gate domain="channels:admin">
                                            <button className="btn btn--danger btn--sm" style={{ marginLeft: 8 }} onClick={() => onDelete(ch)}>
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

            <p className="channels-hint">
                Configura tu encoder (OBS) con servidor <code>rtmp://localhost:1935/app</code> y la
                clave de transmisión del canal. Al iniciar la emisión, el canal pasa a <b>EN VIVO</b> solo.
            </p>

            {editing && (
                <ChannelForm
                    initial={editing === 'new' ? null : editing}
                    onClose={() => setEditing(null)}
                />
            )}
        </section>
    );
}
