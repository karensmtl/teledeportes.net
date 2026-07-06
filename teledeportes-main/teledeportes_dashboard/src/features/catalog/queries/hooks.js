import { useQuery } from '@tanstack/react-query';

import { api } from '../../../core/network/api';
import { PUBLIC_VIDEOS_PATH, PUBLIC_CATEGORIES_PATH } from './paths';
import { catalogKeys } from './keys';

export function usePublicVideos(params = {}) {
    return useQuery({
        queryKey: catalogKeys.videos(params),
        queryFn: async () => (await api.get(PUBLIC_VIDEOS_PATH, { params })).data,
    });
}

export function usePublicVideo(slug) {
    return useQuery({
        queryKey: catalogKeys.video(slug),
        queryFn: async () => (await api.get(`${PUBLIC_VIDEOS_PATH}/${slug}`)).data,
        enabled: Boolean(slug),
    });
}

export function usePublicCategories() {
    return useQuery({
        queryKey: catalogKeys.categories,
        queryFn: async () => (await api.get(PUBLIC_CATEGORIES_PATH)).data,
    });
}
