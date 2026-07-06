const { sequelize } = require('../core/database');
const logger = require('../core/logger');
const { requireExplicitProdConfirm } = require('./_lib/guards');
const seedCategories = require('../data/seeders/category');

async function run() {
    requireExplicitProdConfirm();
    try {
        const result = await seedCategories();
        logger.info(result, 'seed_videos finished');
    } catch (err) {
        logger.fatal({ err: err.message }, 'seed_videos failed');
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

run();
