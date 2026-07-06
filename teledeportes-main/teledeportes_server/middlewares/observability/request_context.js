// Wraps each request in an AsyncLocalStorage scope seeded with a stable
// request id. Mount BEFORE any business middleware. pino-http already
// generates `req.id` — we adopt it as the canonical id.
const crypto = require('node:crypto');

const { run } = require('../../core/context');

function requestContext(req, res, next) {
    const requestId = req.id || req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('x-request-id', requestId);
    run({ requestId, startedAt: Date.now() }, () => next());
}

module.exports = requestContext;
