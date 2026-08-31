// Additive-only schema convergence — `npm run db:migrate:soft`.
//
// Brings the database forward to match the models WITHOUT any destructive DDL.
// It only ever runs three kinds of statement:
//
//   - CREATE TABLE (for a model with no table yet)
//   - ADD COLUMN   (for a model attribute the table lacks, when it is safe)
//   - CREATE INDEX (for an index declared in the model and missing)
//
// It NEVER drops, renames or retypes anything. Whatever it cannot do safely it
// reports and leaves alone, so the output doubles as the to-do list for a real
// migration in scripts/migrations/.
//
// Why this exists next to the other two tools:
//
//   sync:*             Model.sync({ alter: true }). Sequelize diffs the model
//                      against the table and emits whatever ALTERs it thinks
//                      are needed — including dropping columns the model no
//                      longer declares. Fine on a dev database, never on data
//                      you care about.
//   migrate            The explicit, reviewed, forward-only runner (TSS 06).
//                      The right tool for anything non-additive.
//   db:migrate:soft    This. The safe subset of `sync`, for the common case of
//                      "a new nullable column landed and the table lacks it".
//                      Idempotent: re-running converges, so a partial run is
//                      always safe to repeat.
//
// Usage:
//   npm run db:migrate:soft                 # every model
//   npm run db:migrate:soft -- Channel      # only these models
//   npm run db:migrate:soft -- --dry-run    # print the plan, touch nothing

const os = require('node:os');

const { sequelize, models } = require('../core/database');
const logger = require('../core/logger');
const { requireExplicitProdConfirm } = require('./_lib/guards');
const {
    parseArgs, tableNameOf, columnDefinition, additionSafety, driftReport, missingColumns,
} = require('./_lib/soft_schema');

const SCRIPT = 'db_migrate_soft';

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

async function metaStart(targets) {
    const [rows] = await sequelize.query(
        `INSERT INTO _meta_sync (script, targets, status, host)
         VALUES (:s, :t::jsonb, 'in_progress', :h)
         RETURNING id`,
        { replacements: { s: SCRIPT, t: JSON.stringify(targets), h: os.hostname() } }
    );
    return rows[0].id;
}

async function metaFinish(id, status, error = null) {
    await sequelize.query(
        `UPDATE _meta_sync SET finished_at = NOW(), status = :status, error = :error WHERE id = :id`,
        { replacements: { id, status, error } }
    );
}

async function describeOrNull(queryInterface, tableName) {
    try {
        return await queryInterface.describeTable(tableName);
    } catch {
        return null;   // table does not exist yet
    }
}

async function hasRows(tableName) {
    const quoted = sequelize.getQueryInterface().queryGenerator.quoteTable(tableName);
    const [rows] = await sequelize.query(`SELECT 1 FROM ${quoted} LIMIT 1`);
    return rows.length > 0;
}

async function convergeModel(model, name, { queryInterface, dryRun, applied, blocked, drift }) {
    const tableName = tableNameOf(model);
    const description = await describeOrNull(queryInterface, tableName);

    // No table at all: Model.sync() with no options is CREATE TABLE IF NOT
    // EXISTS plus the model's indexes. Additive by construction — the `alter`
    // branches inside Sequelize's sync() are the destructive ones and we never
    // pass it.
    if (!description) {
        if (dryRun) logger.info({ model: name, tableName }, '[plan] crearía la tabla y sus índices');
        else { await model.sync(); logger.info({ model: name, tableName }, 'tabla creada'); }
        applied.push({ model: name, action: 'create_table', tableName });
        return;
    }

    for (const { column, attribute } of missingColumns(model, description)) {
        const safety = await additionSafety(attribute, () => hasRows(tableName));
        if (!safety.safe) {
            blocked.push({ model: name, column, reason: safety.reason });
            logger.warn({ model: name, column, reason: safety.reason }, 'columna omitida');
            continue;
        }
        if (dryRun) logger.info({ model: name, column }, '[plan] añadiría la columna');
        else {
            await queryInterface.addColumn(tableName, column, columnDefinition(attribute));
            logger.info({ model: name, column }, 'columna añadida');
        }
        applied.push({ model: name, action: 'add_column', column });
    }

    // sync() on an existing table only fills in missing indexes; without
    // `alter` it does not touch columns.
    if (!dryRun) await model.sync();

    const { orphaned, retyped } = driftReport(model, description);
    for (const column of orphaned) {
        drift.push({ model: name, column, issue: 'está en la tabla pero no en el modelo (borrarla sería destructivo)' });
    }
    for (const item of retyped) {
        drift.push({ model: name, column: item.column, issue: item.change });
    }
}

async function run() {
    requireExplicitProdConfirm();

    const { dryRun, targets } = parseArgs(process.argv.slice(2));
    const names = targets.length ? targets : Object.keys(models);

    const unknown = names.filter(name => !models[name]);
    if (unknown.length) {
        logger.fatal({ unknown, known: Object.keys(models) }, 'modelo desconocido');
        await sequelize.close();
        process.exit(1);
    }

    await ensureMetaSyncTable();
    const runId = dryRun ? null : await metaStart(names);

    const context = {
        queryInterface: sequelize.getQueryInterface(),
        dryRun,
        applied: [],
        blocked: [],
        drift: [],
    };

    try {
        for (const name of names) {
            await convergeModel(models[name], name, context);
        }

        const { applied, blocked, drift } = context;
        if (blocked.length) logger.warn({ blocked }, 'cambios NO aditivos omitidos — requieren una migración en scripts/migrations/');
        if (drift.length) logger.warn({ drift }, 'divergencias detectadas — este script nunca las corrige');
        logger.info(
            { aplicados: applied.length, omitidos: blocked.length, divergencias: drift.length, dryRun },
            dryRun ? 'plan calculado (no se aplicó nada)' : 'convergencia aditiva terminada',
        );

        if (runId) await metaFinish(runId, 'ok');
        await sequelize.close();
    } catch (err) {
        logger.fatal({ err: err.message }, 'db:migrate:soft falló');
        if (runId) await metaFinish(runId, 'error', err.message);
        await sequelize.close();
        process.exit(1);
    }
}

run();
