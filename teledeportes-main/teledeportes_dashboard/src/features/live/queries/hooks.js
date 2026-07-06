import { useQuery } from '@tanstack/react-query';

import { api } from '../../../core/network/api';

const PUBLIC_CHANNELS_PATH = 'public/channels';

export function usePublicChannels(params = {}) {
    return useQuery({
        queryKey: ['public-channels', params],
        queryFn: async () => (await api.get(PUBLIC_CHANNELS_PATH, { params })).data,
        // Surface channels going on/off air without a manual refresh.
        refetchInterval: 8000,
    });
}

export function usePublicChannel(slug) {
    return useQuery({
        queryKey: ['public-channel', slug],
        queryFn: async () => (await api.get(`${PUBLIC_CHANNELS_PATH}/${slug}`)).data,
        enabled: Boolean(slug),
        refetchInterval: 8000,
    });
}
