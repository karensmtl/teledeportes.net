// authenticate — accepts the auth_token cookie or an Authorization: Bearer header.
// Cookie path is the [RIGID] default for browser clients (TSS 05). Bearer is
// kept for server-to-server and CLI scripts. On success: req.user is set with
// { id, email, role }. On failure: 401.
const boom = require('@hapi/boom');

const jwtTool = require('../../core/security/jwt');
const { setUser } = require('../../core/context');

function extractToken(req) {
    if (req.cookies?.auth_token) return req.cookies.auth_token;
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) return header.slice(7).trim();
    return null;
}

function authenticate(req, _res, next) {
    const token = extractToken(req);
    if (!token) return next(boom.unauthorized('No autenticado'));

    try {
        const payload = jwtTool.verify(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        setUser(req.user);
        return next();
    } catch (err) {
        return next(boom.unauthorized('Token inválido o expirado'));
    }
}

module.exports = authenticate;
