import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../core/network/api';
import { itemKeys } from '../queries/keys';
import { itemPaths } from '../queries/paths';

// TSS vite/03 — server-state hooks for the example entity.
// All cache/dedup/retry is TanStack Query's job; this module only declares
// keys + fetchers + invalidation rules.

export function useItemsList(filters) {
    return useQuery({
        queryKey: itemKeys.list(filters),
        queryFn:  ({ signal }) => api.get(itemPaths.list(), { params: filters, signal }).then(r => r.data),
    });
}

export function useItem(id) {
    return useQuery({
        queryKey: itemKeys.detail(id),
        queryFn:  ({ signal }) => api.get(itemPaths.detail(id), { signal }).then(r => r.data),
        enabled:  !!id,
    });
}

export function useCreateItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => api.post(itemPaths.list(), payload).then(r => r.data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: itemKeys.all }),
    });
}

export function useUpdateItem(id) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => api.put(itemPaths.detail(id), payload).then(r => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: itemKeys.detail(id) });
            qc.invalidateQueries({ queryKey: itemKeys.all });
        },
    });
}

export function useDeleteItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(itemPaths.detail(id)).then(r => r.data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: itemKeys.all }),
    });
}
