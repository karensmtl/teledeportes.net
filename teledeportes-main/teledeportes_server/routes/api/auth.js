// /api/v1/auth — public auth surface.
//   POST /login     — body: { email, password }    → user payload, sets cookies
//   POST /logout    — clears cookies
//   POST /refresh   — rolls auth_token forward (requires current valid token)
//   GET  /me        — returns the assembled current user
//   POST /change-password — body: { current_password, new_password }
//
// Login uses loginLimiter (TSS 05 [RIGID]). Mutating endpoints are protected
// by the global csrf middleware; mount it before this router or on the
// audience namespace as the project's app.js sees fit.
const express = require('express');

const AuthManager = require('../../services/managers/auth_manager');
const UserManager = require('../../services/managers/user_manager');
const authenticate = require('../../middlewares/auth/authenticate');
const csrf = require('../../middlewares/auth/csrf');
const { loginLimiter, sessionLimiter } = require('../../middlewares/security/rate_limiters');

function authRoutes(parent) {
    const router = express.Router();
    parent.use('/auth', router);

    const authManager = new AuthManager();
    const userManager = new UserManager();

    router.post('/login', loginLimiter, async (req, res, next) => {
        try {
            const user = await authManager.login(req.body, res);
            res.json({ user });
        } catch (err) { next(err); }
    });

    router.post('/logout', csrf, async (_req, res, next) => {
        try {
            res.json(authManager.logout(res));
        } catch (err) { next(err); }
    });

    router.post('/refresh', sessionLimiter, authenticate, csrf, async (req, res, next) => {
        try {
            res.json(await authManager.refresh(req, res));
        } catch (err) { next(err); }
    });

    router.get('/me', authenticate, async (req, res, next) => {
        try {
            res.json(await authManager.me(req));
        } catch (err) { next(err); }
    });

    router.get('/permissions', sessionLimiter, authenticate, async (req, res, next) => {
        try {
            res.json(authManager.permissions(req));
        } catch (err) { next(err); }
    });

    router.post('/change-password', authenticate, csrf, async (req, res, next) => {
        try {
            res.json(await userManager.changePassword(req.user.id, req.body));
        } catch (err) { next(err); }
    });
}

module.exports = authRoutes;
