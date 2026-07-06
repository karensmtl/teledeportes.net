// authorize(permission) — enforces a single permission against the role
// bundle in core/authz/roles.js. Wildcards are supported:
//   - 'examples:*'  matches 'examples:read', 'examples:write', etc.
//   - '*'           matches everything (webmaster).
//
// Replace this with a database-backed rules engine once the project's
// permission model outgrows static bundles. The interface stays the same:
// authorize('users:write') in routes.
const boom = require('@hapi/boom');

const { ROLES } = require('../../core/authz/roles');

function matches(granted, required) {
    if (granted === '*' || granted === required) return true;
    if (granted.endsWith(':*')) {
        const prefix = granted.slice(0, -1);
        return required.startsWith(prefix);
    }
    return false;
}

function authorize(permission) {
    return function (req, _res, next) {
        if (!req.user) return next(boom.unauthorized('No autenticado'));
        const granted = ROLES[req.user.role] || [];
        const ok = granted.some(g => matches(g, permission));
        if (!ok) return next(boom.forbidden('Permiso denegado'));
        return next();
    };
}

module.exports = authorize;
