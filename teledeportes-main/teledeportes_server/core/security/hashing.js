// TSS 05 [RIGID]:
//   - User passwords: bcrypt cost 10 minimum (12 recommended).
//   - API keys: sha256(token + pepper).
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const BCRYPT_COST = Number(process.env.BCRYPT_COST) || 12;
const TOKEN_PEPPER = process.env.TOKEN_PEPPER;

function hashPassword(plain) {
    return bcrypt.hash(plain, BCRYPT_COST);
}

function verifyPassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
}

function hashToken(plain) {
    if (!TOKEN_PEPPER) throw new Error('TOKEN_PEPPER not set');
    return crypto
        .createHmac('sha256', TOKEN_PEPPER)
        .update(plain)
        .digest('hex');
}

module.exports = { hashPassword, verifyPassword, hashToken };
