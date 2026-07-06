const express = require('express');

const CategoryHandler = require('../../services/handlers/category');
const CategoryAssembler = require('../../services/assemblers/category');

const authenticate = require('../../middlewares/auth/authenticate');
const authorize = require('../../middlewares/auth/authorize');
const csrf = require('../../middlewares/auth/csrf');
const { writeLimiter } = require('../../middlewares/security/rate_limiters');

function parsePaging(query, maxLimit = 100) {
    const limit = Math.min(Math.max(Number(query.limit) || 50, 1), maxLimit);
    const offset = Math.max(Number(query.offset) || 0, 0);
    return { limit, offset };
}

function categoryRoutes(parent) {
    const handler = new CategoryHandler();
    const assembler = new CategoryAssembler();

    // ---- admin surface (staff CMS) ----
    const admin = express.Router();
    parent.use('/admin/categories', admin);
    admin.use(authenticate);

    admin.get('/', authorize('categories:read'), async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            const status = req.query.status !== undefined ? Number(req.query.status) : undefined;
            res.json(await assembler.assemblePaginated({ limit, offset, status, q: req.query.q }));
        } catch (err) { next(err); }
    });

    admin.get('/:id', authorize('categories:read'), async (req, res, next) => {
        try {
            const built = await assembler.assembleById(Number(req.params.id));
            if (!built) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.json(built);
        } catch (err) { next(err); }
    });

    admin.post('/', authorize('categories:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            res.status(201).json(await handler.create(req.body));
        } catch (err) { next(err); }
    });

    admin.patch('/:id', authorize('categories:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            res.json(await handler.update({ ...req.body, id: Number(req.params.id) }));
        } catch (err) { next(err); }
    });

    admin.delete('/:id', authorize('categories:admin'), csrf, writeLimiter, async (req, res, next) => {
        try {
            res.json(await handler.softDelete(Number(req.params.id)));
        } catch (err) { next(err); }
    });

    // ---- public surface (anonymous catalog) ----
    const pub = express.Router();
    parent.use('/public/categories', pub);

    pub.get('/', async (req, res, next) => {
        try {
            const { limit, offset } = parsePaging(req.query);
            res.json(await assembler.assemblePaginated({ limit, offset, q: req.query.q }));
        } catch (err) { next(err); }
    });
}

module.exports = categoryRoutes;
