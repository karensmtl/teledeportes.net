const { Op } = require('sequelize');

const { models } = require('../../core/database');
const { paginate } = require('../../core/utils/pagination');

const NoticiaPackage = require('../../data/packages/noticia');

class NoticiaAssembler {
    constructor() {
        this.models = models;
    }

    async assembleById(id, { admin = false } = {}) {
        const where = { id };
        if (!admin) where.status = 2;
        const found = await this.models.Noticia.findOne({ where, raw: true });
        if (!found) return null;
        return this.#build(found, admin);
    }

    // Public lookup by slug — only published articles, so drafts/deleted 404.
    async assembleBySlug(slug, { admin = false } = {}) {
        const where = { slug };
        if (!admin) where.status = 2;
        const found = await this.models.Noticia.findOne({ where, raw: true });
        if (!found) return null;
        return this.#build(found, admin);
    }

    // Public site: only published (status=2). Admin: everything except deleted,
    // with optional status/category/search filters. Newest first.
    async assemblePaginated(opts = {}) {
        const { limit = 50, offset = 0, admin = false, category, q, status } = opts;

        const where = {};
        if (category) where.category = category;
        if (q) where.title = { [Op.iLike]: `%${q}%` };

        if (admin) {
            where.status = status !== undefined ? status : { [Op.ne]: 0 };
        } else {
            where.status = 2;
        }

        const { rows, count } = await this.models.Noticia.findAndCountAll({
            where,
            limit,
            offset,
            order: [['published_at', 'DESC'], ['id', 'DESC']],
            raw: true,
        });

        const items = rows.map(row => this.#build(row, admin));
        return { items, pagination: paginate(count, limit, offset) };
    }

    #build(row, admin) {
        const pkg = new NoticiaPackage();
        pkg.addNoticia(row);
        if (admin) pkg.addAdmin(row);
        return pkg.build();
    }
}

module.exports = NoticiaAssembler;
