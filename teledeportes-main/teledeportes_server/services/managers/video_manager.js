const fsp = require('node:fs/promises');
const path = require('node:path');

const boom = require('@hapi/boom');

const { sequelize, models } = require('../../core/database');
const logger = require('../../core/logger');
const videoSchemas = require('../../data/schemas/video');
const { enqueueTranscode } = require('../../core/queue');
const { saveThumbnail, removeFileQuiet } = require('../../core/media/thumbnails');
const { slugify, ensureUniqueSlug } = require('../../core/utils/slug');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';

function validate(name, data) {
    const schema = videoSchemas[name];
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

function fieldError(field, message) {
    const err = boom.badRequest('Datos inválidos');
    err.output.payload.fields = { [field]: message };
    return err;
}

async function safeUnlink(filePath) {
    if (!filePath) return;
    try { await fsp.unlink(filePath); }
    catch (err) { logger.warn({ err: err.message, filePath }, 'temp upload cleanup failed'); }
}

class VideoManager {
    // `file` is the multer file ({ path, originalname, size }). The original is
    // moved onto the media volume, the row is created in `pending`, and a
    // transcode job is enqueued. The worker fills duration/dimensions/paths.
    async upload(file, metadata) {
        if (!file) throw fieldError('file', 'El archivo de video es requerido');

        let value;
        try {
            value = validate('create', metadata);
        } catch (err) {
            await safeUnlink(file.path);
            throw err;
        }

        const category = await models.Category.findByPk(value.category_id);
        if (!category || category.status === 0) {
            await safeUnlink(file.path);
            throw fieldError('category_id', 'La categoría no existe');
        }

        const created = await sequelize.transaction(async tx => {
            const slug = await ensureUniqueSlug(models.Video, slugify(value.title));
            return models.Video.create({
                title:             value.title,
                slug,
                description:       value.description ?? null,
                category_id:       value.category_id,
                processing_status: 'pending',
                original_filename: file.originalname,
                size_bytes:        file.size,
                status:            2,
                remarks:           value.remarks ?? null,
            }, { transaction: tx });
        });

        // Move the temp upload into originals/<id>/ on the shared media volume.
        const ext = (path.extname(file.originalname) || '.mp4').toLowerCase();
        const relPath = path.posix.join('originals', String(created.id), `original${ext}`);
        const absPath = path.join(MEDIA_ROOT, relPath);
        await fsp.mkdir(path.dirname(absPath), { recursive: true });
        await fsp.rename(file.path, absPath);
        await created.update({ source_path: relPath });

        await enqueueTranscode(created.id);
        logger.info({ videoId: created.id }, 'video uploaded, transcode enqueued');
        return created.toJSON();
    }

    async updateMetadata(data) {
        const value = validate('update', data);
        const target = await models.Video.findByPk(value.id);
        if (!target) throw boom.notFound('Video no encontrado');

        if (value.category_id && value.category_id !== target.category_id) {
            const category = await models.Category.findByPk(value.category_id);
            if (!category || category.status === 0) {
                throw fieldError('category_id', 'La categoría no existe');
            }
        }
        if (value.title && value.title !== target.title) {
            value.slug = await ensureUniqueSlug(models.Video, slugify(value.title), value.id);
        }
        const { id, ...rest } = value;
        await target.update(rest);
        return target.toJSON();
    }

    async softDelete(id) {
        const target = await models.Video.findByPk(id);
        if (!target) throw boom.notFound('Video no encontrado');
        await target.update({ status: 0 });
        return target.toJSON();
    }

    // Re-runs the transcode (after a failure, or to regenerate renditions).
    async reprocess(id) {
        const target = await models.Video.findByPk(id);
        if (!target) throw boom.notFound('Video no encontrado');
        if (!target.source_path) throw boom.badRequest('El video no tiene archivo original');

        await target.update({ processing_status: 'pending', error: null });
        await enqueueTranscode(id);
        return target.toJSON();
    }

    async setThumbnail(id, file) {
        if (!file) throw fieldError('thumbnail', 'La imagen es requerida');
        const target = await models.Video.findByPk(id);
        if (!target) { await safeUnlink(file.path); throw boom.notFound('Video no encontrado'); }

        const rel = await saveThumbnail(file, 'video', id);
        if (target.custom_thumbnail_path && target.custom_thumbnail_path !== rel) {
            await removeFileQuiet(target.custom_thumbnail_path);
        }
        await target.update({ custom_thumbnail_path: rel });
        return target.id;
    }

    async removeThumbnail(id) {
        const target = await models.Video.findByPk(id);
        if (!target) throw boom.notFound('Video no encontrado');
        await removeFileQuiet(target.custom_thumbnail_path);
        await target.update({ custom_thumbnail_path: null });
        return target.id;
    }
}

module.exports = VideoManager;
