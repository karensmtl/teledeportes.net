// TSS 06 [RIGID]: explicit migration runner for non-additive schema changes.
// Reads scripts/migrations/*.js (alphabetical = chronological by filename),
// runs the pending up() in order, records each in _meta_migrations.
const fs = require('node:fs');
const path = require('node:path');

const { sequelize } = require('../core/database');
const logger = require('../core/logger');
const { requireExplicitProdConfirm } = require('./_lib/guards');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMetaTable() {
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS _meta_migrations (
            id          SERIAL PRIMARY KEY,
            name        TEXT NOT NULL UNIQUE,
            applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            git_sha     TEXT,
            direction   TEXT NOT NULL
        )
    `);
}

async function alreadyApplied() {
    const [rows] = await sequelize.query(
        `SELECT name FROM _meta_migrations WHERE direction = 'up' ORDER BY id ASC`
    );
    return new Set(rows.map(r => r.name));
}

async function record(name, direction) {
    await sequelize.query(
        `INSERT INTO _meta_migrations (name, direction) VALUES (:name, :direction)
         ON CONFLICT (name) DO UPDATE SET applied_at = NOW(), direction = EXCLUDED.direction`,
        { replacements: { name, direction } }
    );
}

async function run() {
    requireExplicitProdConfirm();
    await ensureMetaTable();

    if (!fs.existsSync(MIGRATIONS_DIR)) {
        logger.info('no migrations directory, nothing to do');
        await sequelize.close();
        return;
    }

    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.js'))
        .sort();

    const applied = await alreadyApplied();
    const pending = files.filter(f => !applied.has(f.replace(/\.js$/, '')));

    if (!pending.length) {
        logger.info('no pending migrations');
        await sequelize.close();
        return;
    }

    const qi = sequelize.getQueryInterface();
    for (const file of pending) {
        const m = require(path.join(MIGRATIONS_DIR, file));
        const name = m.name || file.replace(/\.js$/, '');
        logger.info({ name }, 'applying migration');
        try {
            await m.up(qi, sequelize);
            await record(name, 'up');
            logger.info({ name }, 'migration applied');
        } catch (err) {
            logger.fatal({ name, err: err.message }, 'migration failed');
            await sequelize.close();
            process.exit(1);
        }
    }

    await sequelize.close();
}

run();
