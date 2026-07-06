// CLI wrapper for data/seeders/user.js. TSS 06: prod-guarded.
const { sequelize } = require('../core/database');
const logger = require('../core/logger');
const { requireExplicitProdConfirm } = require('./_lib/guards');
const seedUsers = require('../data/seeders/user');

async function run() {
    requireExplicitProdConfirm();
    try {
        const result = await seedUsers();
        logger.info(result, 'seed_users finished');
    } catch (err) {
        logger.fatal({ err: err.message }, 'seed_users failed');
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

run();
