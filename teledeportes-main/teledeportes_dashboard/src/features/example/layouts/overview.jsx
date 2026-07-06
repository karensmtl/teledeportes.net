import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Gate } from '../../../global/contexts/auth/auth';
import { SEARCH_DEBOUNCE_MS } from '../../../core/constants/forms';
import { useItemsList } from '../contexts/items';

import '../styles/overview.css';

// TSS vite/03 demonstration end-to-end:
// - URL state for filters (useSearchParams) — links survive reload.
// - Debounced search before refetch.
// - Server-side filter params passed to useQuery.
// - Refreshing-state CSS instead of unmounting list on refetch.
// - <Gate> wrapping the "+ Nuevo" action by permission.

const TYPE_LABEL = { a: 'Tipo A', b: 'Tipo B', c: 'Tipo C' };
const STATUS_LABEL = { 2: 'Activo', 1: 'Inactivo', 0: 'Eliminado' };

function ItemCard({ item }) {
    return (
        <article className="item-card">
            <div className="item-card__main">
                <Link to={`/admin/example/${item.id}`} className="item-card__name">
                    {item.name}
                </Link>
                <div className="item-card__meta">
                    <span className="item-card__id">#{item.id}</span>
                    <span className={`item-card__type item-card__type--${item.type}`}>
                        {TYPE_LABEL[item.type] || item.type}
                    </span>
                    <span className={`item-card__status item-card__status--${item.status}`}>
                        {STATUS_LABEL[item.status] || 'Desconocido'}
                    </span>
                    {item.owner && <span className="item-card__owner">{item.owner}</span>}
                </div>
                {item.description && (
                    <p className="item-card__description">{item.description}</p>
                )}
            </div>

            <Gate domain="items:write">
                <Link to={`/admin/example/${item.id}`} className="item-card__edit">
                    Editar
                </Link>
            </Gate>
        </article>
    );
}

export default function ItemsOverview() {
    const [params, setParams] = useSearchParams();

    const urlSearch = params.get('q')      || '';
    const urlType   = params.get('type')   || '';
    const urlStatus = params.get('status') || '';

    const [search, setSearch] = useState(urlSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const next = new URLSearchParams(params);
        if (debouncedSearch) next.set('q', debouncedSearch);
        else next.delete('q');
        setParams(next, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const filters = useMemo(() => {
        const out = {};
        if (debouncedSearch) out.q = debouncedSearch;
        if (urlType)   out.type   = urlType;
        if (urlStatus) out.status = urlStatus;
        return out;
    }, [debouncedSearch, urlType, urlStatus]);

    const { data: items = [], isLoading, isFetching, error } = useItemsList(filters);

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value); else next.delete(key);
        setParams(next, { replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setParams(new URLSearchParams(), { replace: true });
    };

    const hasFilters = !!(search || urlType || urlStatus);

    if (isLoading) return <div className="item-overview__loading">Cargando items...</div>;

    return (
        <div className="item-overview">
            <header className="item-overview__header">
                <h2>Items</h2>
                <span className="item-overview__count">{items.length}</span>
                <Gate domain="items:write">
                    <Link to="/admin/example/new" className="item-overview__add">+ Nuevo</Link>
                </Gate>
            </header>

            <div className="item-overview__filters">
                <input
                    type="text"
                    placeholder="Buscar por nombre o dueño..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="item-overview__search"
                />

                <select
                    value={urlType}
                    onChange={(e) => setFilter('type', e.target.value)}
                    className="item-overview__select"
                >
                    <option value="">Todos los tipos</option>
                    <option value="a">Tipo A</option>
                    <option value="b">Tipo B</option>
                    <option value="c">Tipo C</option>
                </select>

                <select
                    value={urlStatus}
                    onChange={(e) => setFilter('status', e.target.value)}
                    className="item-overview__select"
                >
                    <option value="">Todos los estados</option>
                    <option value="2">Activo</option>
                    <option value="1">Inactivo</option>
                </select>

                {hasFilters && (
                    <button className="item-overview__clear" onClick={clearFilters}>
                        Limpiar
                    </button>
                )}
            </div>

            {error && (
                <div className="item-overview__error">
                    {error.message || 'No se pudieron cargar los items'}
                </div>
            )}

            <div className={`item-overview__list ${isFetching && !isLoading ? 'item-overview__list--refreshing' : ''}`}>
                {!items.length && !error && (
                    <p className="item-overview__empty">No hay items que coincidan con los filtros</p>
                )}
                {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
