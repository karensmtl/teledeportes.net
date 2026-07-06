// TSS 05 [RIGID]: every project's logger redacts these paths.
// Adding a sensitive field to a model triggers a redact-list update in the
// same PR.
const pino = require('pino');

const REDACT_PATHS = [
    'req.body.password',
    'req.body.current',
    'req.body.new',
    'req.body.token',
    'req.body.api_key',
    'req.body.secret',
    'req.headers.authorization',
    'req.headers.cookie',
    'req.headers["x-csrf-token"]',
    '*.password',
    '*.token',
    '*.token_hash',
    '*.secret',
    '*.api_key',
    '*.jwt',
    '*.csrf_token',
];

const baseLogger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
});

// Proxy the base logger so every call (`logger.info(...)`) automatically
// binds the active request context — requestId, userId — when present.
// Background jobs and boot-time logs fall back to baseLogger.
const { getContext } = require('./context');

function bindFromContext() {
    const ctx = getContext();
    if (!ctx) return baseLogger;
    return baseLogger.child({
        requestId: ctx.requestId,
        userId: ctx.userId,
    });
}

const handler = {
    get(_target, prop) {
        const target = bindFromContext();
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
    },
};

module.exports = new Proxy(baseLogger, handler);
