const crypto = require('node:crypto');

const { Op } = require('sequelize');
const boom = require('@hapi/boom');

const { models } = require('../../core/database');
const logger = require('../../core/logger');
const channelSchemas = require('../../data/schemas/channel');
const { slugify, ensureUniqueSlug } = require('../../core/utils/slug');
const { streamNameFromUrl, rewriteStreamName } = require('../../core/media/ome');
const { saveThumbnail, removeFileQuiet } = require('../../core/media/thumbnails');

function validate(name, data) {
    const schema = channelSchemas[name];
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
        const fields = {};
        for (const d of error.details) fields[d.path.join('.')] = d.message;
        const err = boom.badRequest('Datos inválidos');
        err.output.payload.fields = fields;
        throw err;
    }
    return value;
}

class ChannelManager {
    async create(data) {
        const value = validate('create', data);
        const slug = await ensureUniqueSlug(models.Channel, slugify(value.name));
        const stream_key = await this.#uniqueStreamKey();
        const created = await models.Channel.create({
            name:        value.name,
            slug,
            stream_key,
            description: value.description ?? null,
            external_hls_url: value.external_hls_url || null,
            sort_order:  value.sort_order ?? 0,
            status:      value.status ?? 2,
            remarks:     value.remarks ?? null,
        });
        return created.id;
    }

    async update(data) {
        const value = validate('update', data);
        const target = await models.Channel.findByPk(value.id);
        if (!target) throw boom.notFound('Canal no encontrado');

        if (value.name && value.name !== target.name) {
            value.slug = await ensureUniqueSlug(models.Channel, slugify(value.name), value.id);
        }
        const { id, ...rest } = value;
        if (rest.external_hls_url === '') rest.external_hls_url = null;   // clear, don't store ''
        await target.update(rest);
        return target.id;
    }

    async softDelete(id) {
        const target = await models.Channel.findByPk(id);
        if (!target) throw boom.notFound('Canal no encontrado');
        await target.update({ status: 0, is_on_air: false });
        return target.toJSON();
    }

    async setThumbnail(id, file) {
        if (!file) {
            const err = boom.badRequest('Datos inválidos');
            err.output.payload.fields = { thumbnail: 'La imagen es requerida' };
            throw err;
        }
        const target = await models.Channel.findByPk(id);
        if (!target) throw boom.notFound('Canal no encontrado');

        const rel = await saveThumbnail(file, 'channel', id);
        if (target.thumbnail_path && target.thumbnail_path !== rel) {
            await removeFileQuiet(target.thumbnail_path);
        }
        await target.update({ thumbnail_path: rel });
        return target.id;
    }

    async removeThumbnail(id) {
        const target = await models.Channel.findByPk(id);
        if (!target) throw boom.notFound('Canal no encontrado');
        await removeFileQuiet(target.thumbnail_path);
        await target.update({ thumbnail_path: null });
        return target.id;
    }

    // Manual override (ops). The webhook normally drives this automatically.
    async setOnAir(id, onAir) {
        const { on_air } = validate('on_air', { on_air: onAir });
        const target = await models.Channel.findByPk(id);
        if (!target) throw boom.notFound('Canal no encontrado');
        await target.update({ is_on_air: on_air });
        return target.id;
    }

    // OME admission webhook. Publishers (ingest) are validated against the
    // stream_key and rewritten to the public slug; players are allowed through.
    // Publish start/stop flips is_on_air automatically.
    async handleAdmission(body) {
        const req = body?.request || {};
        const { direction, status, url } = req;

        if (direction !== 'incoming') return { allowed: true };   // playback — allow

        const name = streamNameFromUrl(url);

        if (status === 'opening') {
            const channel = await models.Channel.scope('withKey').findOne({ where: { stream_key: name } });
            if (!channel || channel.status === 0) {
                logger.warn({ name }, '[ome] publish rejected — unknown/inactive stream key');
                return { allowed: false };
            }
            await channel.update({ is_on_air: true });
            logger.info({ channel: channel.slug }, '[ome] channel on air');
            return { allowed: true, new_url: rewriteStreamName(url, channel.slug) };
        }

        if (status === 'closing') {
            const channel = await models.Channel.scope('withKey').findOne({
                where: { [Op.or]: [{ slug: name }, { stream_key: name }] },
            });
            if (channel) {
                await channel.update({ is_on_air: false });
                logger.info({ channel: channel.slug }, '[ome] channel off air');
            }
            return { allowed: true };
        }

        return { allowed: true };
    }

    async #uniqueStreamKey() {
        for (;;) {
            const key = crypto.randomBytes(20).toString('hex');
            const clash = await models.Channel.scope('withKey').findOne({
                where: { stream_key: key }, attributes: ['id'],
            });
            if (!clash) return key;
        }
    }
}

module.exports = ChannelManager;
