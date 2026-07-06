// AuthManager — login / logout / refresh / me. TSS 05 [RIGID] cookie+CSRF.
// Login sets two cookies:
//   - auth_token   (HttpOnly, Secure, SameSite=Lax) — the JWT itself
//   - csrf_token   (Not HttpOnly — read by frontend, echoed in X-CSRF-Token)
// Both expire together. Logout clears both.
const crypto = require('node:crypto');
const boom = require('@hapi/boom');

const { models } = require('../../core/database');
const { ROLES } = require('../../core/authz/roles');
const { verifyPassword } = require('../../core/security/hashing');
const jwtTool = require('../../core/security/jwt');
const userSchemas = require('../../data/schemas/user');
const UserAssembler = require('../assemblers/user_assembler');

const SESSION_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS) || 168;     // 7d
const COOKIE_BASE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
};

function validate(name, data) {
    const { error, value } = userSchemas[name].validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
        const fields = {};
        for (const d of error.details) fields[d.path.join('.')] = d.message;
        const err = boom.badRequest('Datos inválidos');
        err.output.payload.fields = fields;
        throw err;
    }
    return value;
}

class AuthManager {
    constructor() {
        this.assembler = new UserAssembler();
    }

    async login(payload, res) {
        const value = validate('login', payload);

        const user = await models.User.scope('withSecret').findOne({
            where: { email: value.email },
        });
        if (!user || user.status !== 2) throw boom.unauthorized('Credenciales inválidas');

        const ok = await verifyPassword(value.password, user.password_hash);
        if (!ok) throw boom.unauthorized('Credenciales inválidas');

        await user.update({ last_login_at: new Date() });

        const token = jwtTool.sign(
            { sub: user.id, email: user.email, role: user.role },
            { expiresIn: `${SESSION_TTL_HOURS}h` }
        );
        const csrf = crypto.randomBytes(24).toString('hex');
        const maxAge = SESSION_TTL_HOURS * 60 * 60 * 1000;

        res.cookie('auth_token', token, { ...COOKIE_BASE, maxAge });
        res.cookie('csrf_token', csrf,  { ...COOKIE_BASE, httpOnly: false, maxAge });

        return this.assembler.assembleById(user.id);
    }

    logout(res) {
        res.clearCookie('auth_token', { ...COOKIE_BASE });
        res.clearCookie('csrf_token', { ...COOKIE_BASE, httpOnly: false });
        return { logged_out: true };
    }

    async refresh(req, res) {
        if (!req.user) throw boom.unauthorized('No autenticado');
        const token = jwtTool.sign(
            { sub: req.user.id, email: req.user.email, role: req.user.role },
            { expiresIn: `${SESSION_TTL_HOURS}h` }
        );
        const maxAge = SESSION_TTL_HOURS * 60 * 60 * 1000;
        res.cookie('auth_token', token, { ...COOKIE_BASE, maxAge });
        return { refreshed: true };
    }

    async me(req) {
        if (!req.user) throw boom.unauthorized('No autenticado');
        return this.assembler.assembleById(req.user.id);
    }

    // Permission codes the frontend gates on. Computed from the role bundle
    // (may contain wildcards like '*' or 'videos:*' — the client expands them).
    permissions(req) {
        if (!req.user) throw boom.unauthorized('No autenticado');
        return { permissions: ROLES[req.user.role] || [], denied: [] };
    }
}

module.exports = AuthManager;
