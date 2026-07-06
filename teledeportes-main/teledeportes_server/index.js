const app = require('./app');
const logger = require('./core/logger');
const { sequelize } = require('./core/database');

const port = Number(process.env.PORT) || 4000;

// Node's default requestTimeout (5 min) aborts large media uploads mid-transfer.
// Lift it so heavy videos finish; configurable via env, 0 disables it entirely.
const REQUEST_TIMEOUT_MS = process.env.REQUEST_TIMEOUT_MS !== undefined
    ? Number(process.env.REQUEST_TIMEOUT_MS)
    : 30 * 60 * 1000;

let server;
let shuttingDown = false;

function start() {
    server = app.listen(port, () => {
        logger.info({ port, requestTimeoutMs: REQUEST_TIMEOUT_MS }, 'Server running');
    });
    // Applies to the whole request incl. the streamed upload body. headersTimeout
    // (60s default) still bounds how long headers may take, which is fine.
    server.requestTimeout = REQUEST_TIMEOUT_MS;
    server.on('error', err => {
        logger.fatal({ err: err.message }, 'Listen failed');
        process.exit(1);
    });
}

async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'Shutdown initiated');

    try {
        if (server) await new Promise(r => server.close(r));
        logger.info('HTTP server closed');
        await sequelize.close();
        logger.info('DB pool closed');
        process.exit(0);
    } catch (err) {
        logger.error({ err: err.message }, 'Error during shutdown');
        process.exit(1);
    }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', err => {
    logger.error({ err: err?.message || String(err) }, 'Unhandled rejection');
});
process.on('uncaughtException', err => {
    logger.fatal({ err: err.message, stack: err.stack }, 'Uncaught exception');
    shutdown('uncaughtException');
});

start();
