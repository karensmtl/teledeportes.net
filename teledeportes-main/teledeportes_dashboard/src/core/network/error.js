import axios from 'axios';

// TSS vite/04 §"Error shape — ApiError".
// Every error thrown by the api instance is an ApiError.

export class ApiError extends Error {
    constructor({ status, message, code, fields, isNetwork, isTimeout, cause }) {
        super(message);
        this.name = 'ApiError';
        this.status = status ?? null;
        this.code = code ?? null;
        this.fields = fields ?? null;
        this.isNetwork = !!isNetwork;
        this.isTimeout = !!isTimeout;
        this.cause = cause;
    }

    get isClientError() { return this.status >= 400 && this.status < 500; }
    get isServerError() { return this.status >= 500; }
    get isRetryable()   { return this.isNetwork || this.isTimeout || this.isServerError; }

    static fromAxios(error) {
        if (axios.isCancel(error)) {
            return new ApiError({
                message: 'Solicitud cancelada',
                code: 'CANCELLED',
                cause: error,
            });
        }
        if (error.code === 'ECONNABORTED') {
            return new ApiError({
                message: 'Tiempo de espera agotado',
                isTimeout: true,
                cause: error,
            });
        }
        if (!error.response) {
            return new ApiError({
                message: 'Error de red',
                isNetwork: true,
                cause: error,
            });
        }
        const { status, data } = error.response;
        return new ApiError({
            status,
            message: data?.error || data?.message || `Error ${status}`,
            fields:  data?.fields || null,
            code:    data?.code   || null,
            cause:   error,
        });
    }
}
