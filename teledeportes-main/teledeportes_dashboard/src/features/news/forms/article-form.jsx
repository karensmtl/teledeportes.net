import { useState } from 'react';
import toast from 'react-hot-toast';

import Modal from '../../../common/components/Modal/Modal';
import { NEWS_CATEGORIES } from '../utils/format';
import { useCreateArticle, useUpdateArticle } from '../queries/hooks';

// yyyy-mm-dd for the <input type="date">, from an ISO/date value.
function toDateInput(value) {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

// Create or edit a news article. `initial` null = create mode. `others` are the
// remaining articles, offered as related-article options.
export default function ArticleForm({ initial, others = [], onClose }) {
    const isEdit = Boolean(initial);
    const create = useCreateArticle();
    const update = useUpdateArticle();
    const pending = create.isPending || update.isPending;

    const [title, setTitle] = useState(initial?.title || '');
    const [category, setCategory] = useState(initial?.category || 'NOTICIAS');
    const [author, setAuthor] = useState(initial?.author || '');
    const [summary, setSummary] = useState(initial?.summary || '');
    const [body, setBody] = useState(initial?.body || '');
    const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
    const [readingTime, setReadingTime] = useState(initial?.readingTime || '3 min');
    const [tags, setTags] = useState((initial?.tags || []).join(', '));
    const [relatedIds, setRelatedIds] = useState((initial?.relatedIds || []).map(Number));
    const [publishedAt, setPublishedAt] = useState(toDateInput(initial?.publishedAt) || toDateInput(new Date()));
    const [errors, setErrors] = useState({});

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        const body_ = {
            title,
            category,
            author,
            summary,
            body,
            image_url: imageUrl,
            reading_time: readingTime,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            related_ids: relatedIds,
            published_at: publishedAt || undefined,
        };
        try {
            if (isEdit) await update.mutateAsync({ id: initial.id, ...body_ });
            else await create.mutateAsync(body_);
            toast.success(isEdit ? 'Noticia actualizada' : 'Noticia creada');
            onClose();
        } catch (err) {
            if (err?.fields) setErrors(err.fields);
            else toast.error(err?.message || 'No se pudo guardar');
        }
    };

    const valid = title.trim() && summary.trim() && body.trim() && author.trim();

    return (
        <Modal
            title={isEdit ? `Editar noticia #${initial.id}` : 'Nueva noticia'}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn--ghost" onClick={onClose} disabled={pending}>Cancelar</button>
                    <button type="submit" form="article-form" className="btn btn--primary" disabled={pending || !valid}>
                        {pending ? 'Guardando…' : 'Guardar'}
                    </button>
                </>
            }
        >
            <form id="article-form" onSubmit={submit}>
                <label className="field">
                    <span>Titular</span>
                    <input value={title} onChange={e => setTitle(e.target.value)} autoFocus required />
                    {errors.title && <span className="field__error">{errors.title}</span>}
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <label className="field">
                        <span>Categoría</span>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            {NEWS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <span className="field__error">{errors.category}</span>}
                    </label>
                    <label className="field">
                        <span>Autor</span>
                        <input value={author} onChange={e => setAuthor(e.target.value)} required />
                        {errors.author && <span className="field__error">{errors.author}</span>}
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <label className="field">
                        <span>Fecha de publicación</span>
                        <input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} />
                        {errors.published_at && <span className="field__error">{errors.published_at}</span>}
                    </label>
                    <label className="field">
                        <span>Tiempo de lectura</span>
                        <input value={readingTime} onChange={e => setReadingTime(e.target.value)} placeholder="3 min" />
                        {errors.reading_time && <span className="field__error">{errors.reading_time}</span>}
                    </label>
                </div>

                <label className="field">
                    <span>Resumen</span>
                    <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} required />
                    {errors.summary && <span className="field__error">{errors.summary}</span>}
                </label>

                <label className="field">
                    <span>Cuerpo (HTML: &lt;p&gt; &lt;h3&gt; &lt;blockquote&gt;)</span>
                    <textarea value={body} onChange={e => setBody(e.target.value)} rows={10} style={{ fontFamily: 'var(--font-sans)' }} required />
                    {errors.body && <span className="field__error">{errors.body}</span>}
                </label>

                <label className="field">
                    <span>Imagen (URL)</span>
                    <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" />
                    {errors.image_url && <span className="field__error">{errors.image_url}</span>}
                </label>

                <label className="field">
                    <span>Tags (separados por coma)</span>
                    <input value={tags} onChange={e => setTags(e.target.value)} placeholder="deportes, fútbol, mundial" />
                </label>

                <label className="field">
                    <span>Relacionados (Ctrl/⌘ + clic para varios)</span>
                    <select
                        multiple
                        value={relatedIds.map(String)}
                        onChange={e => setRelatedIds(Array.from(e.target.selectedOptions).map(o => Number(o.value)))}
                        style={{ minHeight: 110 }}
                    >
                        {others.map(o => (
                            <option key={o.id} value={o.id}>#{o.id} · {o.title.slice(0, 50)}</option>
                        ))}
                    </select>
                </label>
            </form>
        </Modal>
    );
}
