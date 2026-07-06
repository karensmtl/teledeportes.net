// TSS 05 [RIGID]: HS256 with two active secrets (primary + previous).
// Verification tries both; signing always uses primary.
const jwt = require('jsonwebtoken');

const PRIMARY  = process.env.JWT_SECRET_PRIMARY;
const PREVIOUS = process.env.JWT_SECRET_PREVIOUS;
const KID      = process.env.JWT_KID || 'primary';

function sign(payload, opts = {}) {
    if (!PRIMARY) throw new Error('JWT_SECRET_PRIMARY not set');
    return jwt.sign(
        { ...payload, kid: KID },
        PRIMARY,
        { algorithm: 'HS256', expiresIn: opts.expiresIn || '7d' }
    );
}

function verify(token) {
    if (!PRIMARY) throw new Error('JWT_SECRET_PRIMARY not set');
    try {
        return jwt.verify(token, PRIMARY, { algorithms: ['HS256'] });
    } catch (errPrimary) {
        if (!PREVIOUS) throw errPrimary;
        try {
            return jwt.verify(token, PREVIOUS, { algorithms: ['HS256'] });
        } catch {
            throw errPrimary;
        }
    }
}

module.exports = { sign, verify };
