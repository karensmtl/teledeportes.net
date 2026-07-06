const { Op } = require('sequelize');

const { models } = require('../../core/database');
const { paginate } = require('../../core/utils/pagination');
const { playbackUrls, ingestUrls } = require('../../core/media/ome');

const ChannelPackage = require('../../data/packages/channel');

const MEDIA_PUBLIC_URL = () => process.env.MEDIA_PUBLIC_URL || '';

function thumbUrl(relativePath) {
    if (!relativePath) return null;
    return `${MEDIA_PUBLIC_URL().replace(/\/+$/, '')}/${String(relativePath).replace(/^\/+/, '')}`;
}

class ChannelAssembler {
    constructor() {
        this.models = models;
    }

    #model(admin) {
        return admin ? this.models.Channel.scope('withKey') : this.models.Channel;
    }

    async assembleById(id, { admin = false } = {}) {
        const found = await this.#model(admin).findByPk(id, { raw: true });
        return found ? this.#build(found, admin) : null;
    }

    async assembleBySlug(slug, { admin = false } = {}) {
        const found = await this.#model(admin).findOne({ where: { slug }, raw: true });
        return found ? this.#build(found, admin) : null;
    }

    async assemblePaginated(opts = {}) {
        const { limit = 50, offset = 0, admin = false, status, q, on_air } = opts;

        const where = {};
        if (q) where.name = { [Op.iLike]: `%${q}%` };
        if (on_air !== undefined) where.is_on_air = on_air;
        if (admin) where.status = status !== undefined ? status : { [Op.ne]: 0 };
        else where.status = 2;

        const { rows, count } = await this.#model(admin).findAndCountAll({
            where,
            limit,
            offset,
            order: [['sort_order', 'ASC'], ['name', 'ASC']],
            raw: true,
        });
        const items = rows.map(row => this.#build(row, admin));
        return { items, pagination: paginate(count, limit, offset) };
    }

    #build(channel, admin) {
        const pkg = new ChannelPackage();
        pkg.addChannel(channel);
        pkg.addThumbnail(thumbUrl(channel.thumbnail_path));
        pkg.addPlayback(playbackUrls(channel.slug));
        if (admin) pkg.addAdmin(channel, ingestUrls(channel.stream_key));
        return pkg.build();
    }
}

module.exports = ChannelAssembler;
