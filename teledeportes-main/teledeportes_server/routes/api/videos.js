const crypto = require('node:crypto');
const fsp = require('node:fs/promises');
const path = require('node:path');

const express = require('express');
const multer = require('multer');
const boom = require('@hapi/boom');

const VideoManager = require('../../services/managers/video_manager');
const VideoAssembler = require('../../services/assemblers/video');
const { uploadImageSingle } = require('../../core/media/image_upload');

const authenticate = require('../../middlewares/auth/authenticate');
const authorize = require('../../middlewares/auth/authorize');
const csrf = require('../../middlewares/auth/csrf');
const { writeLimiter } = require('../../middlewares/security/rate_limiters');

const MEDIA_ROOT = process.env.MEDIA_ROOT || '/media';
const MAX_BYTES = (Number(process.env.MEDIA_MAX_UPLOAD_MB) || 5120) * 1024 * 1024;
const VIDEO_MIME = /^video\//;

// Uploads land in the shared volume's tmp dir, then VideoManager.upload moves
// them into originals/<id>/ (same filesystem → atomic rename).
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(MEDIA_ROOT, 'tmp');
        fsp.mkdir(dir, { recursive: true }).then(() => cb(null, dir)).catch(cb);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_BYTES },
    fileFilter: (_req, file, cb) => {
        if (VIDEO_MIME.test(file.mimetype)) return cb(null, true);
        cb(boom.badRequest('El archivo debe ser un video'));
    },
});

// Wraps multer so its non-boom errors map to proper HTTP statuses.
function uploadSingle(field) {
    const mw = upload.single(field);
    return (req, res, next) => mw(req, res, (err) => {
        if (!err) return next();
        if (err.isBoom) return next(err);
        if (err.code === 'LIMIT_FILE_SIZE') return next(boom.entityTooLarge('El video supera el tamaño máximo'));
        next(boom.badRequest(err.message || 'Error al subir el archivo'));
    });
}

function parsePaging(query, maxLimit = 100) {
    const limit = Math.min(Math.max(Number(query.limit) || 50, 1), maxLimit);
    const offset = Math.max(Number(query.offset) || 0, 0);
    return { limit, offset };
}

function videoRoutes(parent) {
    const manager = new VideoManager();
    const assembler = new VideoAssembler();

    // ---- admin surface (staff CMS) ----
    const admin = express.Router();
    parent.use('/admin/videos', admin);
    admin.use(authenticate);

    admin.get('/', authorize('videos:read'), async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({
                admin: true,
                limit,
                offset,
                category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
                status: req.query.status !== undefined ? Number(req.query.status) : undefined,
                processing_status: req.query.processing_status,
                q: req.query.q,
                sort: req.query.sort,
            }));
        } catch (err) { next(err); }
    });

    admin.get('/:id', authorize('videos:read'), async (req, res, next) => {
        try {
            const built = await assembler.assembleById(Number(req.params.id), { admin: true });
            if (!built) return res.status(404).json({ error: 'Video no encontrado' });
            res.json(built);
        } catch (err) { next(err); }
    });

    admin.post('/', authorize('videos:write'), csrf, writeLimiter, uploadSingle('file'), async (req, res, next) => {
        try {
            const created = await manager.upload(req.file, req.body);
            const built = await assembler.assembleById(created.id, { admin: true });
            res.status(201).json(built);
        } catch (err) { next(err); }
    });

    admin.patch('/:id', authorize('videos:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            await manager.updateMetadata({ ...req.body, id: Number(req.params.id) });
            res.json(await assembler.assembleById(Number(req.params.id), { admin: true }));
        } catch (err) { next(err); }
    });

    admin.post('/:id/reprocess', authorize('videos:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            await manager.reprocess(Number(req.params.id));
            res.json(await assembler.assembleById(Number(req.params.id), { admin: true }));
        } catch (err) { next(err); }
    });

    admin.post('/:id/thumbnail', authorize('videos:write'), csrf, writeLimiter, uploadImageSingle('thumbnail'), async (req, res, next) => {
        try {
            const id = await manager.setThumbnail(Number(req.params.id), req.file);
            res.json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.delete('/:id/thumbnail', authorize('videos:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const id = await manager.removeThumbnail(Number(req.params.id));
            res.json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.delete('/:id', authorize('videos:admin'), csrf, writeLimiter, async (req, res, next) => {
        try {
            res.json(await manager.softDelete(Number(req.params.id)));
        } catch (err) { next(err); }
    });

    // ---- public surface (anonymous catalog) ----
    const pub = express.Router();
    parent.use('/public/videos', pub);

    pub.get('/', async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({
                admin: false,
                limit,
                offset,
                category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
                q: req.query.q,
                sort: req.query.sort,
            }));
        } catch (err) { next(err); }
    });

    pub.get('/:slug', async (req, res, next) => {
        try {
            const built = await assembler.assembleBySlug(req.params.slug);
            if (!built) return res.status(404).json({ error: 'Video no encontrado' });
            res.json(built);
        } catch (err) { next(err); }
    });
}

module.exports = videoRoutes;
