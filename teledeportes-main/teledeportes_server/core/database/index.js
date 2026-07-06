// TSS 01 + 06: model auto-discovery, init/associate two-pass, warn on
// files that look like models but fail discovery (catches typos).
const sequelize = require('./sequelize');
const modules = require('./models');
const logger = require('../logger');

const models = {};

for (const exported of modules) {
    if (!exported || typeof exported !== 'object') continue;

    const Model = Object.values(exported).find(
        v => typeof v?.init === 'function' && typeof v?.config === 'function'
    );
    const schemaKey = Object.keys(exported).find(k => k.toLowerCase().endsWith('schema'));
    const schema = schemaKey ? exported[schemaKey] : null;

    if (Model && !schema) {
        logger.warn({ name: Model.name }, '[models] class found but no schema export');
        continue;
    }
    if (schema && !Model) {
        logger.warn({ schemaKey }, '[models] schema export without a Model class');
        continue;
    }
    if (!Model && !schema) continue;

    Model.init(schema, Model.config(sequelize));
    models[Model.name] = Model;
}

for (const modelName of Object.keys(models)) {
    const model = models[modelName];
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
}

module.exports = { sequelize, models };
