const { Op } = require('sequelize');

const { models } = require('../../core/database');
const { paginate } = require('../../core/utils/pagination');

const VideoPackage = require('../../data/packages/video');

const PUBLIC_BASE = () => process.env.MEDIA_PUBLIC_URL || '';

class VideoAssembler {
    constructor() {
        this.models = models;
    }

    async assembleById(id, { admin = false } = {}) {
        const found = await this.models.Video.findByPk(id, { raw: true });
        if (!found) return null;

        const category = found.category_id
            ? await this.models.Category.findByPk(found.category_id, { raw: true })
            : null;

        return this.#build(found, category, admin);
    }

    // Public lookup by slug. Returns null unless the video is ready + active,
    // so unprocessed/deleted videos 404 (no enumeration leak).
    async assembleBySlug(slug, { admin = false } = {}) {
        const where = { slug };
        if (!admin) { where.status = 2; where.processing_status = 'ready'; }

        const found = await this.models.Video.findOne({ where, raw: true });
        if (!found) return null;

        const category = found.category_id
            ? await this.models.Category.findByPk(found.category_id, { raw: true })
            : null;

        return this.#build(found, category, admin);
    }

    // Public catalog: only ready, non-deleted videos. Admin: everything,
    // with extra filters (processing_status, status, category, search).
    async assemblePaginated(opts = {}) {
        const {
            limit = 50,
            offset = 0,
            admin = false,
            category_id,
            q,
            status,
            processing_status,
            sort = '-createdAt',
        } = opts;

        const where = {};
        if (category_id) where.category_id = category_id;
        if (q) where.title = { [Op.iLike]: `%${q}%` };

        if (admin) {
            if (status !== undefined) where.status = status;
            else where.status = { [Op.ne]: 0 };
            if (processing_status) where.processing_status = processing_status;
        } else {
            where.status = 2;
            where.processing_status = 'ready';
        }

        const { rows, count } = await this.models.Video.findAndCountAll({
            where,
            limit,
            offset,
            order: this.#order(sort),
            raw: true,
        });

        const categoryMap = await this.#categoryMap(rows.map(r => r.category_id));
        const items = rows.map(row => this.#build(row, categoryMap.get(row.category_id), admin));
        return { items, pagination: paginate(count, limit, offset) };
    }

    #build(video, category, admin) {
        const pkg = new VideoPackage();
        pkg.addVideo(video);
        pkg.addCategory(category);
        pkg.addMedia(PUBLIC_BASE(), video);
        if (admin) pkg.addAdmin(video);
        return pkg.build();
    }

    async #categoryMap(ids) {
        const unique = [...new Set(ids.filter(Boolean))];
        if (!unique.length) return new Map();
        const cats = await this.models.Category.findAll({
            where: { id: { [Op.in]: unique } },
            raw: true,
        });
        return new Map(cats.map(c => [c.id, c]));
    }

    #order(sort) {
        // Whitelisted sort fields → safe Sequelize order tuples.
        const allowed = { createdAt: 'createdAt', title: 'title', duration: 'duration_seconds' };
        const desc = String(sort).startsWith('-');
        const key = desc ? sort.slice(1) : sort;
        const column = allowed[key] || 'createdAt';
        return [[column, desc ? 'DESC' : 'ASC']];
    }
}

module.exports = VideoAssembler;
