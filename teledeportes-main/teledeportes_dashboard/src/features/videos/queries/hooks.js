import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../core/network/api';
import { VIDEOS_PATH } from './paths';
import { videoKeys } from './keys';

const IN_FLIGHT = new Set(['pending', 'processing']);

export function useVideos(params = {}) {
    return useQuery({
        queryKey: videoKeys.list(params),
        queryFn: async () => (await api.get(VIDEOS_PATH, { params })).data,
        // Poll while anything is still transcoding so the UI moves to "Listo"
        // on its own without a manual refresh.
        refetchInterval: (query) => {
            const items = query.state.data?.items || [];
            return items.some(v => IN_FLIGHT.has(v.processingStatus)) ? 3000 : false;
        },
    });
}

export function useUploadVideo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ formData, onUploadProgress }) =>
            (await api.post(VIDEOS_PATH, formData, { onUploadProgress })).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: videoKeys.all }),
    });
}

export function useUpdateVideo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...body }) => (await api.patch(`${VIDEOS_PATH}/${id}`, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: videoKeys.all }),
    });
}

export function useReprocessVideo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (await api.post(`${VIDEOS_PATH}/${id}/reprocess`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: videoKeys.all }),
    });
}

export function useDeleteVideo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (await api.delete(`${VIDEOS_PATH}/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: videoKeys.all }),
    });
}

export function useSetVideoThumbnail() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, file }) => {
            const form = new FormData();
            form.append('thumbnail', file);
            return (await api.post(`${VIDEOS_PATH}/${id}/thumbnail`, form)).data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: videoKeys.all }),
    });
}
