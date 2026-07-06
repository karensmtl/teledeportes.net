import { QueryClient } from '@tanstack/react-query';

// TSS vite/03 §"TanStack Query is the standard".
// Single QueryClient instance, mounted as the 3rd provider layer in app.jsx.

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            // Don't retry 4xx (a 401/403 must not fire twice before the
            // interceptor's redirect). Retry once for 5xx / network errors.
            retry: (failureCount, error) =>
                (error?.status >= 400 && error?.status < 500) ? false : failureCount < 1,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 0,
        },
    },
});
