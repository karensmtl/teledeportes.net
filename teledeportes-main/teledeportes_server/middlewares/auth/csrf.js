// TSS 05 [RIGID]: double-submit cookie pattern.
// Mutating requests must echo the csrf_token cookie value as X-CSRF-Token.
// GET / HEAD are skipped — they should be side-effect-free.

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrfMiddleware(req, res, next) {
    if (SAFE_METHODS.has(req.method)) return next();

    const fromCookie = req.cookies?.csrf_token;
    const fromHeader = req.headers['x-csrf-token'];

    if (!fromCookie || !fromHeader || fromCookie !== fromHeader) {
        return res.status(403).json({ error: 'CSRF check failed' });
    }

    next();
}

module.exports = csrfMiddleware;
