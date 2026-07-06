// TSS 06 [RIGID]: validate required env vars at boot. Crash with a clear
// message if any is missing. Add new required vars here in the same PR
// that introduces the dependency on them.
require('dotenv').config();

const REQUIRED = [
    'NODE_ENV',
    'PORT',
    'TZ',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
    'DB_DATABASE',
    'JWT_SECRET_PRIMARY',
    'TOKEN_PEPPER',
];

const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) {
    console.error(`[boot] missing env: ${missing.join(', ')}`);
    process.exit(1);
}

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    port:    Number(process.env.PORT),
    timezone: process.env.TZ,
    sqlLog:  process.env.SQL_LOG === 'true',
    trustProxy: Number(process.env.TRUST_PROXY) || 1,
    masterAccess: process.env.MASTER_ACCESS === 'true',
    db: {
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host:     process.env.DB_HOST,
        port:     Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
        ssl:      process.env.DB_SSL === 'true',
        poolMax:  Number(process.env.DB_POOL_MAX) || 10,
        poolMin:  Number(process.env.DB_POOL_MIN) || 0,
    },
};
