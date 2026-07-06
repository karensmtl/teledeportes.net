const express = require('express');
const { sequelize } = require('../core/database');

const API_VERSION = 'v1';

function initRoutes(app) {
    const root = express.Router();
    app.use(`/api/${API_VERSION}`, root);

    // Liveness: is the process up? Cheap, no dependencies. The orchestrator
    // restarts the container if this fails.
    const livez = (_req, res) => res.status(200).json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
    });

    // Readiness: are dependencies (DB, etc.) reachable? The orchestrator
    // routes traffic away from a not-ready instance without restarting it.
    const readyz = async (_req, res) => {
        const checks = { db: 'ok' };
        let ready = true;
        try { await sequelize.authenticate(); }
        catch { checks.db = 'down'; ready = false; }
        res.status(ready ? 200 : 503).json({
            status: ready ? 'ready' : 'not_ready',
            checks,
            timestamp: new Date(),
        });
    };

    // Un-versioned probes (orchestrators usually want plain paths).
    app.get('/livez', livez);
    app.get('/readyz', readyz);

    // Back-compat: /health resolves to readiness for callers that still use it.
    app.get('/health', readyz);
    root.get('/health', readyz);

    // Audience namespaces — mount as the project grows.
    require('./api/auth')(root);          // /api/v1/auth/*
    require('./api/users')(root);         // /api/v1/admin/users/*
    require('./api/categories')(root);    // /api/v1/admin|public/categories/*
    require('./api/videos')(root);        // /api/v1/admin|public/videos/*
    require('./api/channels')(root);      // /api/v1/admin|public/channels/* + /agent/ome/*
    require('./api/noticias')(root);      // /api/v1/admin|public/noticias/*
    // require('./api/agent')(root);      // /api/v1/agent/*
}

module.exports = initRoutes;
