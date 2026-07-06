const { sequelize } = require('../core/database');
const logger = require('../core/logger');
const { requireExplicitProdConfirm } = require('./_lib/guards');
const seedNoticias = require('../data/seeders/noticia');

async function run() {
    requireExplicitProdConfirm();
    try {
        const result = await seedNoticias();
        logger.info(result, 'seed_noticias finished');
    } catch (err) {
        logger.fatal({ err: err.message }, 'seed_noticias failed');
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

run();
