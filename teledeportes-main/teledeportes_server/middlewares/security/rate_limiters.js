// TSS 05 [RIGID]: every project ships these four tiers.
// Tune the limits per project but do not remove the tiers.
const { rateLimit } = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-8',
    message: { error: 'Too many requests, please try again later.' },
});

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-8',
    skipSuccessfulRequests: true,
    message: { error: 'Demasiados intentos fallidos. Espera un minuto.' },
});

const sessionLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    message: { error: 'Demasiadas peticiones. Espera un momento.' },
});

const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-8',
    message: { error: 'Demasiadas peticiones de escritura. Espera un momento.' },
});

module.exports = {
    generalLimiter,
    loginLimiter,
    sessionLimiter,
    writeLimiter,
};
