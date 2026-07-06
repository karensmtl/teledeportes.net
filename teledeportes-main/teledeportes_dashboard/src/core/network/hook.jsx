import { useCallback, useState } from 'react';

import { api } from './api';
import { ApiError } from './error';

// TSS vite/04 §"Backward-compatible useBridge shim".
//
// Exists for migration only. New code uses `api` directly via TanStack
// Query (useQuery / useMutation) per TSS vite/03. The signature and
// return shape match the legacy bridge so old callers do not change.

export function useBridge() {
    const [status, setStatus] = useState('idle');
    const [data, setData]     = useState(null);
    const [code, setCode]     = useState(null);
    const [error, setError]   = useState(null);

    const fetch = useCallback(async (method, server, endpoint, body, params, headers, extra = {}) => {
        setStatus('pending');
        try {
            const res = await api.request({
                method,
                url:           server ? `${server}/${endpoint}` : endpoint,
                data:          body,
                params,
                headers:       headers || {},
                signal:        extra.signal,
                responseType:  extra.responseType,
                onUploadProgress:   extra.onUploadProgress,
                onDownloadProgress: extra.onDownloadProgress,
                timeout:       extra.timeout,
            });
            setStatus('success');
            setData(res.data);
            setCode(res.status);
            return {
                status: 'success',
                data:   res.data,
                code:   res.status,
                details: {},
                error:  null,
            };
        } catch (err) {
            const apiErr = err instanceof ApiError ? err : ApiError.fromAxios(err);
            setStatus('failed');
            setError(apiErr);
            setCode(apiErr.status);
            return {
                status: 'failed',
                data:   null,
                code:   apiErr.status,
                details: {},
                error:  apiErr,
            };
        }
    }, []);

    return { fetch, status, data, code, error };
}
