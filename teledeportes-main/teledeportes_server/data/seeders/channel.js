const crypto = require('node:crypto');

const { models } = require('../../core/database');
const { slugify } = require('../../core/utils/slug');

// One demo channel so the live module has something to point an encoder at.
const DEFAULT_CHANNELS = [
    { name: 'Canal 1', description: 'Canal principal de partidos en vivo', sort_order: 1 },
];

async function seedChannels() {
    const result = { created: 0, skipped: 0 };
    for (const channel of DEFAULT_CHANNELS) {
        const slug = slugify(channel.name);
        const [, created] = await models.Channel.findOrCreate({
            where: { slug },
            defaults: {
                ...channel,
                slug,
                stream_key: crypto.randomBytes(20).toString('hex'),
                status: 2,
                is_on_air: false,
            },
        });
        if (created) result.created += 1;
        else result.skipped += 1;
    }
    return result;
}

module.exports = seedChannels;
