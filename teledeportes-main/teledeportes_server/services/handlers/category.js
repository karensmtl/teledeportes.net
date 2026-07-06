const { Op } = require('sequelize');
const boom = require('@hapi/boom');

const BaseHandler = require('./handler');
const { models } = require('../../core/database');
const categorySchemas = require('../../data/schemas/category');
const { slugify, ensureUniqueSlug } = require('../../core/utils/slug');

class CategoryHandler extends BaseHandler {
    constructor() {
        super(models.Category, categorySchemas);
    }

    async create(data) {
        const value = this.validate('create', data);
        value.slug = await ensureUniqueSlug(this.model, slugify(value.name));
        const created = await this.model.create(value);
        return this._sanitize(created);
    }

    async update(data) {
        const value = this.validate('update', data);
        const target = await this.model.findByPk(value.id);
        if (!target) throw boom.notFound('Categoría no encontrada');

        if (value.name && value.name !== target.name) {
            value.slug = await ensureUniqueSlug(this.model, slugify(value.name), value.id);
        }
        const { id, ...rest } = value;
        await target.update(rest);
        return this._sanitize(target);
    }

    // Soft delete (status=0). Refuses while non-deleted videos reference it,
    // so the catalog never ends up with dangling category links.
    async softDelete(id) {
        const target = await this.model.findByPk(id);
        if (!target) throw boom.notFound('Categoría no encontrada');

        const inUse = await models.Video.count({
            where: { category_id: id, status: { [Op.ne]: 0 } },
        });
        if (inUse > 0) {
            throw boom.conflict('La categoría tiene videos asociados');
        }
        await target.update({ status: 0 });
        return this._sanitize(target);
    }
}

module.exports = CategoryHandler;
