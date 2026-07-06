// TSS 06 [RIGID]: production-grade Sequelize options every time.
const { Sequelize } = require('sequelize');

const config = require('../config/env');

const URI = `postgres://${encodeURIComponent(config.db.user)}:${encodeURIComponent(config.db.password)}@${config.db.host}:${config.db.port}/${config.db.database}`;

const sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: config.sqlLog ? console.log : false,
    pool: {
        max:     config.db.poolMax,
        min:     config.db.poolMin,
        acquire: 30000,
        idle:    10000,
    },
    retry: { max: 3 },
    dialectOptions: config.db.ssl
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
});

module.exports = sequelize;
