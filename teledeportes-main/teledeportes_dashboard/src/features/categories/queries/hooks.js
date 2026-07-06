import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../core/network/api';
import { CATEGORIES_PATH } from './paths';
import { categoryKeys } from './keys';

// TSS vite/03 — server state via useQuery / useMutation only.

export function useCategories(params = {}) {
    return useQuery({
        queryKey: categoryKeys.list(params),
        queryFn: async () => (await api.get(CATEGORIES_PATH, { params })).data,
    });
}

export function useCreateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body) => (await api.post(CATEGORIES_PATH, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...body }) => (await api.patch(`${CATEGORIES_PATH}/${id}`, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (await api.delete(`${CATEGORIES_PATH}/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
    });
}
