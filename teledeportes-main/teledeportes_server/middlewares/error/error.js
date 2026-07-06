const logger = require('../../core/logger');

module.exports = function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    if (err.isBoom) {
        const { statusCode, payload } = err.output;
        return res.status(statusCode).json({
            ...payload,
            ...(payload.fields ? { fields: payload.fields } : {}),
        });
    }

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const fields = {};
        for (const e of err.errors || []) fields[e.path] = e.message;
        return res.status(400).json({ error: 'Validation error', fields });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Malformed JSON' });
    }

    logger.error(
        { err: { message: err.message, stack: err.stack, name: err.name }, url: req.originalUrl },
        'unhandled error'
    );

    return res.status(err.statusCode || 500).json({
        error: err.statusCode === 500 || !err.statusCode ? 'Internal server error' : err.message,
    });
};
