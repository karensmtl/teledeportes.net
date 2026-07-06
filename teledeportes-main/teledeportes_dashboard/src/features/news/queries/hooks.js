import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../core/network/api';
import { PUBLIC_NOTICIAS_PATH, NOTICIAS_ADMIN_PATH } from './paths';
import { newsKeys } from './keys';

// ---- public site ----

// Fetches the published articles for the public site. The site pulls the whole
// set once (there are few) and derives sections/related client-side, mirroring
// the original prototype.
export function usePublicNews(params = { limit: 100 }) {
    return useQuery({
        queryKey: newsKeys.publicList(params),
        queryFn: async () => (await api.get(PUBLIC_NOTICIAS_PATH, { params })).data,
    });
}

export function usePublicArticle(idOrSlug) {
    return useQuery({
        queryKey: newsKeys.publicOne(idOrSlug),
        queryFn: async () => (await api.get(`${PUBLIC_NOTICIAS_PATH}/${idOrSlug}`)).data,
        enabled: Boolean(idOrSlug),
    });
}

// ---- admin CMS ----

export function useAdminNews(params = {}) {
    return useQuery({
        queryKey: newsKeys.adminList(params),
        queryFn: async () => (await api.get(NOTICIAS_ADMIN_PATH, { params })).data,
    });
}

export function useCreateArticle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body) => (await api.post(NOTICIAS_ADMIN_PATH, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
    });
}

export function useUpdateArticle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...body }) => (await api.patch(`${NOTICIAS_ADMIN_PATH}/${id}`, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
    });
}

export function useDeleteArticle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (await api.delete(`${NOTICIAS_ADMIN_PATH}/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
    });
}
