// Idempotent seeder for the bootstrap webmaster user.
// Reads SEED_WEBMASTER_EMAIL / _NAME / _PASSWORD from env. If the email
// already exists, the seeder is a no-op. Never overwrite an existing
// password — re-running this script must not lock anyone out.
const { models } = require('../../core/database');
const { hashPassword } = require('../../core/security/hashing');

async function seedUsers() {
    const email = (process.env.SEED_WEBMASTER_EMAIL || '').toLowerCase();
    const name = process.env.SEED_WEBMASTER_NAME || 'Webmaster';
    const password = process.env.SEED_WEBMASTER_PASSWORD;

    if (!email || !password) {
        return { skipped: true, reason: 'SEED_WEBMASTER_EMAIL or SEED_WEBMASTER_PASSWORD not set' };
    }

    const existing = await models.User.findOne({ where: { email } });
    if (existing) return { skipped: true, reason: 'webmaster already exists', id: existing.id };

    const password_hash = await hashPassword(password);
    const created = await models.User.create({
        email,
        name,
        role: 'webmaster',
        status: 2,
        password_hash,
    });

    return { created: true, id: created.id, email };
}

module.exports = seedUsers;
