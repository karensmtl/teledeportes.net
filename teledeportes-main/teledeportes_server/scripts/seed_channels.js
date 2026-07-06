const { sequelize } = require('../core/database');
const logger = require('../core/logger');
const { requireExplicitProdConfirm } = require('./_lib/guards');
const seedChannels = require('../data/seeders/channel');

async function run() {
    requireExplicitProdConfirm();
    try {
        const result = await seedChannels();
        logger.info(result, 'seed_channels finished');
    } catch (err) {
        logger.fatal({ err: err.message }, 'seed_channels failed');
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

run();
