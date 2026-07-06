const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');

const logger = require('./core/logger');
const initRoutes = require('./routes');
const errorHandler = require('./middlewares/error/error');
const requestContext = require('./middlewares/observability/request_context');
const { generalLimiter } = require('./middlewares/security/rate_limiters');

// TSS 05 [RIGID]: MASTER_ACCESS forbidden in production.
if (process.env.NODE_ENV === 'production' && process.env.MASTER_ACCESS === 'true') {
    console.error('[boot] MASTER_ACCESS=true forbidden in production');
    process.exit(1);
}

const app = express();

// TSS 05 [RIGID]: trust proxy when behind a reverse proxy.
app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : true,    // when empty, reflect (dev only)
    credentials: true,
}));

app.use(cookieParser());
// Capture the raw body so the OME admission webhook can verify its HMAC signature.
app.use(express.json({ strict: false, verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use(pinoHttp({ logger, autoLogging: true }));
app.use(requestContext);

app.use('/api', generalLimiter);

initRoutes(app);
app.use(errorHandler);

module.exports = app;
