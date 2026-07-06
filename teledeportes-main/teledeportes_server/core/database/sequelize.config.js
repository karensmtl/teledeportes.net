// Config consumed by sequelize-cli (.sequelizerc points here).
// Used only when scaffolding stubs; the runtime connection is built in
// core/database/sequelize.js. Keep both consistent.
require('dotenv').config();

const common = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host:     process.env.DB_HOST || 'localhost',
    port:     Number(process.env.DB_PORT) || 5432,
    dialect:  'postgres',
};

module.exports = {
    development: { ...common },
    test:        { ...common, database: `${process.env.DB_DATABASE || 'app'}_test` },
    production:  { ...common, dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } },
};
