const express = require('express');

const NoticiaHandler = require('../../services/handlers/noticia');
const NoticiaAssembler = require('../../services/assemblers/noticia');

const authenticate = require('../../middlewares/auth/authenticate');
const authorize = require('../../middlewares/auth/authorize');
const csrf = require('../../middlewares/auth/csrf');
const { writeLimiter } = require('../../middlewares/security/rate_limiters');

function parsePaging(query, maxLimit = 100) {
    const limit = Math.min(Math.max(Number(query.limit) || 50, 1), maxLimit);
    const offset = Math.max(Number(query.offset) || 0, 0);
    return { limit, offset };
}

function noticiaRoutes(parent) {
    const handler = new NoticiaHandler();
    const assembler = new NoticiaAssembler();

    // ---- admin surface (staff CMS) ----
    const admin = express.Router();
    parent.use('/admin/noticias', admin);
    admin.use(authenticate);

    admin.get('/', authorize('noticias:read'), async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({
                admin: true,
                limit,
                offset,
                category: req.query.category,
                status: req.query.status !== undefined ? Number(req.query.status) : undefined,
                q: req.query.q,
            }));
        } catch (err) { next(err); }
    });

    admin.get('/:id', authorize('noticias:read'), async (req, res, next) => {
        try {
            const built = await assembler.assembleById(Number(req.params.id), { admin: true });
            if (!built) return res.status(404).json({ error: 'Noticia no encontrada' });
            res.json(built);
        } catch (err) { next(err); }
    });

    admin.post('/', authorize('noticias:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const created = await handler.create(req.body);
            res.status(201).json(await assembler.assembleById(created.id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.patch('/:id', authorize('noticias:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const updated = await handler.update({ ...req.body, id: Number(req.params.id) });
            res.json(await assembler.assembleById(updated.id, { admin: true }));
        } catch (err) { next(err); }
    });

    admin.delete('/:id', authorize('noticias:admin'), csrf, writeLimiter, async (req, res, next) => {
        try {
            res.json(await handler.softDelete(Number(req.params.id)));
        } catch (err) { next(err); }
    });

    // ---- public surface (anonymous site) ----
    const pub = express.Router();
    parent.use('/public/noticias', pub);

    pub.get('/', async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({
                admin: false,
                limit,
                offset,
                category: req.query.category,
                q: req.query.q,
            }));
        } catch (err) { next(err); }
    });

    // Accepts a numeric id or a slug.
    pub.get('/:idOrSlug', async (req, res, next) => {
        try {
            const p = req.params.idOrSlug;
            const built = /^\d+$/.test(p)
                ? await assembler.assembleById(Number(p))
                : await assembler.assembleBySlug(p);
            if (!built) return res.status(404).json({ error: 'Noticia no encontrada' });
            res.json(built);
        } catch (err) { next(err); }
    });
}

module.exports = noticiaRoutes;
