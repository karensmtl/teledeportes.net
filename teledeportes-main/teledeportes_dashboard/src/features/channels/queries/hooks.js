import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../core/network/api';
import { CHANNELS_PATH } from './paths';
import { channelKeys } from './keys';

export function useChannels(params = {}) {
    return useQuery({
        queryKey: channelKeys.list(params),
        queryFn: async () => (await api.get(CHANNELS_PATH, { params })).data,
        // Reflect on-air changes (driven by the OME webhook) without a refresh.
        refetchInterval: 5000,
    });
}

export function useCreateChannel() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body) => (await api.post(CHANNELS_PATH, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: channelKeys.all }),
    });
}

export function useUpdateChannel() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...body }) => (await api.patch(`${CHANNELS_PATH}/${id}`, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: channelKeys.all }),
    });
}

export function useSetChannelOnAir() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, on_air }) => (await api.post(`${CHANNELS_PATH}/${id}/on-air`, { on_air })).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: channelKeys.all }),
    });
}

export function useDeleteChannel() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (await api.delete(`${CHANNELS_PATH}/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: channelKeys.all }),
    });
}

export function useSetChannelThumbnail() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, file }) => {
            const form = new FormData();
            form.append('thumbnail', file);
            return (await api.post(`${CHANNELS_PATH}/${id}/thumbnail`, form)).data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: channelKeys.all }),
    });
}
