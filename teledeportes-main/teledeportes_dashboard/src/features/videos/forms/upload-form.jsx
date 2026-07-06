import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import Modal from '../../../common/components/Modal/Modal';
import { ACCEPTED_VIDEO_TYPES, formatBytes } from '../../../core/constants/media';
import { IconUpload } from '../../../common/icons';
import { useCategories } from '../../categories/queries/hooks';
import { useUploadVideo } from '../queries/hooks';

export default function UploadForm({ onClose }) {
    const { data: catData } = useCategories();
    const categories = catData?.items || [];
    const upload = useUploadVideo();

    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState({});

    const pickFile = (f) => {
        if (!f) return;
        setFile(f);
        if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!file) { setErrors({ file: 'Selecciona un archivo de video' }); return; }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('category_id', categoryId);
        if (description) formData.append('description', description);

        try {
            await upload.mutateAsync({
                formData,
                onUploadProgress: (ev) => {
                    if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100));
                },
            });
            toast.success('Video subido — transcodificando…');
            onClose();
        } catch (err) {
            if (err?.fields) setErrors(err.fields);
            else toast.error(err?.message || 'No se pudo subir el video');
            setProgress(0);
        }
    };

    const uploading = upload.isPending;

    return (
        <Modal
            title="Subir video"
            onClose={uploading ? () => {} : onClose}
            footer={
                <>
                    <button type="button" className="btn btn--ghost" onClick={onClose} disabled={uploading}>Cancelar</button>
                    <button type="submit" form="upload-form" className="btn btn--accent" disabled={uploading || !file || !title.trim() || !categoryId}>
                        {uploading ? `Subiendo… ${progress}%` : 'Subir'}
                    </button>
                </>
            }
        >
            <form id="upload-form" onSubmit={submit}>
                <div
                    className={`dropzone ${dragging ? 'dropzone--active' : ''} ${file ? 'dropzone--filled' : ''}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED_VIDEO_TYPES}
                        hidden
                        onChange={e => pickFile(e.target.files?.[0])}
                    />
                    {file ? (
                        <div className="dropzone__file">
                            <strong>{file.name}</strong>
                            <span>{formatBytes(file.size)}</span>
                        </div>
                    ) : (
                        <div className="dropzone__hint">
                            <span className="dropzone__icon"><IconUpload size={26} /></span>
                            Arrastra un video aquí o haz clic para elegir
                        </div>
                    )}
                </div>
                {errors.file && <span className="field__error">{errors.file}</span>}

                {uploading && (
                    <div className="upload-progress">
                        <div className="upload-progress__bar" style={{ width: `${progress}%` }} />
                    </div>
                )}

                <label className="field" style={{ marginTop: 'var(--space-4)' }}>
                    <span>Título</span>
                    <input value={title} onChange={e => setTitle(e.target.value)} required />
                    {errors.title && <span className="field__error">{errors.title}</span>}
                </label>

                <label className="field">
                    <span>Categoría</span>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                        <option value="" disabled>Selecciona…</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.category_id && <span className="field__error">{errors.category_id}</span>}
                </label>

                <label className="field">
                    <span>Descripción</span>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                </label>
            </form>
        </Modal>
    );
}
