const { models } = require('../../core/database');
const { slugify } = require('../../core/utils/slug');

// Starter catalog for the VOD CMS. Idempotent: matched by name.
const DEFAULT_CATEGORIES = [
    { name: 'Resúmenes',   description: 'Resúmenes de partidos',           sort_order: 1 },
    { name: 'Goles',       description: 'Los mejores goles',               sort_order: 2 },
    { name: 'Entrevistas', description: 'Entrevistas y ruedas de prensa',  sort_order: 3 },
    { name: 'Análisis',    description: 'Análisis táctico',                sort_order: 4 },
    { name: 'Destacados',  description: 'Jugadas y momentos destacados',   sort_order: 5 },
];

async function seedCategories() {
    const result = { created: 0, skipped: 0 };
    for (const category of DEFAULT_CATEGORIES) {
        const [, created] = await models.Category.findOrCreate({
            where: { name: category.name },
            defaults: { ...category, slug: slugify(category.name), status: 2 },
        });
        if (created) result.created += 1;
        else result.skipped += 1;
    }
    return result;
}

module.exports = seedCategories;
