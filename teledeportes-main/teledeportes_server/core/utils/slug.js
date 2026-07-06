const { Op } = require('sequelize');

// Accent-stripping, lowercase, hyphenated slug. Bounded to 100 chars so it
// always fits the slug columns with room for a uniqueness suffix.
function slugify(text) {
    return String(text || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')   // strip diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 100) || 'item';
}

// Returns `base`, or `base-2`, `base-3`, ... until no other row holds it.
// `exceptId` lets an update keep its own slug. Collisions are rare, so the
// linear probe is fine.
async function ensureUniqueSlug(model, base, exceptId = null) {
    let slug = base;
    let n = 1;
    for (;;) {
        const where = { slug };
        if (exceptId) where.id = { [Op.ne]: exceptId };
        const clash = await model.findOne({ where, attributes: ['id'] });
        if (!clash) return slug;
        n += 1;
        slug = `${base}-${n}`;
    }
}

module.exports = { slugify, ensureUniqueSlug };
