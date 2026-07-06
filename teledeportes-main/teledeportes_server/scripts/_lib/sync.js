// TSS 06 [RIGID]: shared sync runner. Per-feature sync_*.js scripts call this.
const { sequelize, models } = require('../../core/database');
const logger = require('../../core/logger');
const { requireExplicitProdConfirm } = require('./guards');

async function ensureMetaSyncTable() {
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS _meta_sync (
            id           SERIAL PRIMARY KEY,
            script       TEXT NOT NULL,
            targets      JSONB,
            started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            finished_at  TIMESTAMPTZ,
            status       TEXT,
            error        TEXT,
            host         TEXT,
            git_sha      TEXT
        )
    `);
}

async function metaStart(script, targets) {
    const [rows] = await sequelize.query(
        `INSERT INTO _meta_sync (script, targets, status, host)
         VALUES (:s, :t::jsonb, 'in_progress', :h)
         RETURNING id`,
        { replacements: { s: script, t: JSON.stringify(targets), h: require('os').hostname() } }
    );
    return rows[0].id;
}

async function metaFinish(id, status, error = null) {
    await sequelize.query(
        `UPDATE _meta_sync SET finished_at = NOW(), status = :status, error = :error WHERE id = :id`,
        { replacements: { id, status, error } }
    );
}

async function syncTargets(scriptName, targets) {
    requireExplicitProdConfirm();
    await ensureMetaSyncTable();
    const id = await metaStart(scriptName, targets);
    try {
        for (const name of targets) {
            const model = models[name];
            if (!model) { logger.warn({ name }, 'model not found, skipping'); continue; }
            await model.sync({ alter: true });
            logger.info({ name }, 'synced');
        }
        await metaFinish(id, 'ok');
        logger.info({ script: scriptName, metaSyncId: id }, 'sync finished');
    } catch (err) {
        await metaFinish(id, 'error', err.message);
        logger.fatal({ err: err.message, script: scriptName }, 'sync failed');
        throw err;
    } finally {
        await sequelize.close();
    }
}

module.exports = syncTargets;
