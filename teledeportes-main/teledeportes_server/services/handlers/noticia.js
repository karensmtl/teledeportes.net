const boom = require('@hapi/boom');

const BaseHandler = require('./handler');
const { models } = require('../../core/database');
const noticiaSchemas = require('../../data/schemas/noticia');
const { slugify, ensureUniqueSlug } = require('../../core/utils/slug');

class NoticiaHandler extends BaseHandler {
    constructor() {
        super(models.Noticia, noticiaSchemas);
    }

    async create(data) {
        const value = this.validate('create', data);
        value.slug = await ensureUniqueSlug(this.model, slugify(value.title));
        const created = await this.model.create(value);
        return this._sanitize(created);
    }

    async update(data) {
        const value = this.validate('update', data);
        const target = await this.model.findByPk(value.id);
        if (!target) throw boom.notFound('Noticia no encontrada');

        if (value.title && value.title !== target.title) {
            value.slug = await ensureUniqueSlug(this.model, slugify(value.title), value.id);
        }
        const { id, ...rest } = value;
        await target.update(rest);
        return this._sanitize(target);
    }

    // Soft delete (status=0). The article disappears from the public site but
    // stays in the DB for audit/restore.
    async softDelete(id) {
        const target = await this.model.findByPk(id);
        if (!target) throw boom.notFound('Noticia no encontrada');
        await target.update({ status: 0 });
        return this._sanitize(target);
    }
}

module.exports = NoticiaHandler;
