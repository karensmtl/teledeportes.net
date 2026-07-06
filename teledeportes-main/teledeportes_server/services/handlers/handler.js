const boom = require('@hapi/boom');

class BaseHandler {
    constructor(model, schemas = {}) {
        this.model = model;
        this.schemas = schemas;
    }

    validate(name, data) {
        const schema = this.schemas[name];
        if (!schema) return data;
        const { error, value } = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const fields = {};
            for (const detail of error.details) {
                fields[detail.path.join('.')] = detail.message;
            }
            const err = boom.badRequest('Datos inválidos');
            err.output.payload.fields = fields;
            throw err;
        }
        return value;
    }

    _sanitize(instance) {
        if (!instance) return instance;
        if (Array.isArray(instance)) return instance.map(i => this._sanitize(i));
        return typeof instance.toJSON === 'function' ? instance.toJSON() : instance;
    }

    async create(data, options = {}) {
        const value = this.validate('create', data);
        const created = await this.model.create(value, options);
        return this._sanitize(created);
    }

    async update(data, options = {}) {
        const value = this.validate('update', data);
        await this.model.update(value, { where: { id: value.id }, ...options });
        return this._sanitize(await this.model.findByPk(value.id));
    }

    async findAll(opts = {}) {
        const list = await this.model.findAll(opts);
        return this._sanitize(list);
    }

    async findById(id) {
        const found = await this.model.findByPk(id);
        if (!found) throw boom.notFound('Resource not found');
        return this._sanitize(found);
    }

    async destroy(id) {
        const removed = await this.model.destroy({ where: { id } });
        return { removed };
    }
}

module.exports = BaseHandler;
