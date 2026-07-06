const crypto = require('node:crypto');

const express = require('express');

const ChannelManager = require('../../services/managers/channel_manager');
const ChannelAssembler = require('../../services/assemblers/channel');
const { ADMISSION_SECRET } = require('../../core/media/ome');
const { uploadImageSingle } = require('../../core/media/image_upload');
const logger = require('../../core/logger');

const authenticate = require('../../middlewares/auth/authenticate');
const authorize = require('../../middlewares/auth/authorize');
const csrf = require('../../middlewares/auth/csrf');
const { writeLimiter } = require('../../middlewares/security/rate_limiters');

function parsePaging(query, maxLimit = 100) {
    const limit = Math.min(Math.max(Number(query.limit) || 50, 1), maxLimit);
    const offset = Math.max(Number(query.offset) || 0, 0);
    return { limit, offset };
}

function parseOnAir(value) {
    if (value === undefined) return undefined;
    return value === 'true' || value === '1';
}

// OME signs the body with HMAC-SHA1(secret) → Base64URL in X-OME-Signature.
function validSignature(req) {
    if (!ADMISSION_SECRET) return true;   // dev: no secret configured
    const got = req.headers['x-ome-signature'];
    if (!got || !req.rawBody) return false;
    const expected = crypto.createHmac('sha1', ADMISSION_SECRET).update(req.rawBody).digest('base64url');
    try {
        return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
    } catch {
        return false;
    }
}

function channelRoutes(parent) {
    const manager = new ChannelManager();
    const assembler = new ChannelAssembler();

    // ---- admin surface ----
    const admin = express.Router();
    parent.use('/admin/channels', admin);
    admin.use(authenticate);

    admin.get('/', authorize('channels:read'), async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({
                admin: true, limit, offset,
                status: req.query.status !== undefined ? Number(req.query.status) : undefined,
                on_air: parseOnAir(req.query.on_air),
                q: req.query.q,
            }));
        } catch (err) { next(err); }
    });

    admin.get('/:id', authorize('channels:read'), async (req, res, next) => {
        try {
            const built = await assembler.assembleById(Number(req.params.id), { admin: true });
            if (!built) return res.status(404).json({ error: 'Canal no encontrado' });
            res.json(built);
        } catch (err) { next(err); }
    });

    admin.post('/', authorize('channels:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const id = await manager.create(req.body);
            res.status(201).json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.patch('/:id', authorize('channels:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const id = await manager.update({ ...req.body, id: Number(req.params.id) });
            res.json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.post('/:id/on-air', authorize('channels:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const id = await manager.setOnAir(Number(req.params.id), req.body.on_air);
            res.json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.post('/:id/thumbnail', authorize('channels:write'), csrf, writeLimiter, uploadImageSingle('thumbnail'), async (req, res, next) => {
        try {
            const id = await manager.setThumbnail(Number(req.params.id), req.file);
            res.json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.delete('/:id/thumbnail', authorize('channels:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const id = await manager.removeThumbnail(Number(req.params.id));
            res.json(await assembler.assembleById(id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.delete('/:id', authorize('channels:admin'), csrf, writeLimiter, async (req, res, next) => {
        try {
            res.json(await manager.softDelete(Number(req.params.id)));
        } catch (err) { next(err); }
    });

    // ---- public surface (anonymous) ----
    const pub = express.Router();
    parent.use('/public/channels', pub);

    pub.get('/', async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({
                limit, offset, on_air: parseOnAir(req.query.on_air), q: req.query.q,
            }));
        } catch (err) { next(err); }
    });

    pub.get('/:slug', async (req, res, next) => {
        try {
            const built = await assembler.assembleBySlug(req.params.slug);
            if (!built) return res.status(404).json({ error: 'Canal no encontrado' });
            res.json(built);
        } catch (err) { next(err); }
    });

    // ---- OME admission webhook (server-to-server, HMAC-signed) ----
    const agent = express.Router();
    parent.use('/agent/ome', agent);

    agent.post('/admission', async (req, res, next) => {
        try {
            if (!validSignature(req)) {
                logger.warn('[ome] admission webhook: invalid signature');
                return res.status(401).json({ allowed: false });
            }
            res.json(await manager.handleAdmission(req.body));
        } catch (err) { next(err); }
    });
}

module.exports = channelRoutes;
