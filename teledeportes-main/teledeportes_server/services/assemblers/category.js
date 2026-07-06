const { Op } = require('sequelize');

const { models } = require('../../core/database');
const { paginate } = require('../../core/utils/pagination');

const CategoryPackage = require('../../data/packages/category');

class CategoryAssembler {
    constructor() {
        this.models = models;
    }

    async assembleById(id) {
        const found = await this.models.Category.findByPk(id, { raw: true });
        if (!found) return null;

        const pkg = new CategoryPackage();
        pkg.addCategory(found);
        pkg.addVideoCount(await this.#videoCount(found.id));
        return pkg.build();
    }

    async assemblePaginated({ limit = 50, offset = 0, status, q } = {}) {
        const where = {};
        where.status = status !== undefined ? status : { [Op.ne]: 0 };
        if (q) where.name = { [Op.iLike]: `%${q}%` };

        const { rows, count } = await this.models.Category.findAndCountAll({
            where,
            limit,
            offset,
            order: [['sort_order', 'ASC'], ['name', 'ASC']],
            raw: true,
        });

        const items = [];
        for (const row of rows) {
            const pkg = new CategoryPackage();
            pkg.addCategory(row);
            pkg.addVideoCount(await this.#videoCount(row.id));
            items.push(pkg.build());
        }
        return { items, pagination: paginate(count, limit, offset) };
    }

    #videoCount(categoryId) {
        return this.models.Video.count({
            where: { category_id: categoryId, status: { [Op.ne]: 0 } },
        });
    }
}

module.exports = CategoryAssembler;
