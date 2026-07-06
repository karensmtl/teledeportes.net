// TSS 05 [RIGID]: API key format `<projectprefix>_<32 base62 chars>`.
// Plaintext shown ONCE at creation. DB stores sha256(token + pepper) only.
const crypto = require('node:crypto');

const TOKEN_PREFIX = process.env.TOKEN_PREFIX || 'project';
const TOKEN_LENGTH = 32;

const BASE62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateToken() {
    const bytes = crypto.randomBytes(TOKEN_LENGTH);
    let body = '';
    for (let i = 0; i < TOKEN_LENGTH; i++) {
        body += BASE62[bytes[i] % BASE62.length];
    }
    return `${TOKEN_PREFIX}_${body}`;
}

function prefixOf(token) {
    return token.slice(0, 12);
}

module.exports = { generateToken, prefixOf, TOKEN_PREFIX };
