// /api/v1/admin/users — admin surface for User CRUD.
//   GET    /            — list with pagination
//   GET    /:id         — assembled user
//   POST   /            — register a new user (UserManager.register)
//   PATCH  /:id         — update non-secret fields (UserManager.update)
//   PATCH  /:id/role    — set role (UserManager.setRole)
//   DELETE /:id         — soft-deactivate (status = 1)
//
// Every route requires authenticate + a permission. Writes also go through
// csrf and writeLimiter.
const express = require('express');

const UserManager = require('../../services/managers/user_manager');
const UserAssembler = require('../../services/assemblers/user_assembler');
const UserHandler = require('../../services/handlers/user_handler');

const authenticate = require('../../middlewares/auth/authenticate');
const authorize = require('../../middlewares/auth/authorize');
const csrf = require('../../middlewares/auth/csrf');
const { writeLimiter } = require('../../middlewares/security/rate_limiters');

function userRoutes(parent) {
    const router = express.Router();
    parent.use('/admin/users', router);

    const manager = new UserManager();
    const assembler = new UserAssembler();
    const handler = new UserHandler();

    router.use(authenticate);

    router.get('/', authorize('users:read'), async (req, res, next) => {
        try {
            const limit = Math.min(Number(req.query.limit) || 25, 100);
            const offset = Math.max(Number(req.query.offset) || 0, 0);
            const items = await handler.findAll({ limit, offset, order: [['id', 'DESC']] });
            const total = await handler.model.count();
            res.json({ items, pagination: { total, limit, offset } });
        } catch (err) { next(err); }
    });

    router.get('/:id', authorize('users:read'), async (req, res, next) => {
        try {
            const built = await assembler.assembleById(req.params.id);
            if (!built) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(built);
        } catch (err) { next(err); }
    });

    router.post('/', authorize('users:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const created = await manager.register(req.body);
            res.status(201).json(created);
        } catch (err) { next(err); }
    });

    router.patch('/:id', authorize('users:write'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const updated = await manager.update({ ...req.body, id: Number(req.params.id) });
            res.json(updated);
        } catch (err) { next(err); }
    });

    router.patch('/:id/role', authorize('users:admin'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const updated = await manager.setRole(Number(req.params.id), req.body.role);
            res.json(updated);
        } catch (err) { next(err); }
    });

    router.delete('/:id', authorize('users:admin'), csrf, writeLimiter, async (req, res, next) => {
        try {
            const removed = await manager.deactivate(Number(req.params.id));
            res.json(removed);
        } catch (err) { next(err); }
    });
}

module.exports = userRoutes;
