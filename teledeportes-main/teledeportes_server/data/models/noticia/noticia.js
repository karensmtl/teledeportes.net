const { Model, DataTypes } = require('sequelize');

const TABLE = 'noticias';

// Editorial sections shown in the public site nav. Fixed enum — this is the
// news taxonomy, independent of the VOD `categories` table.
const NEWS_CATEGORIES = ['NOTICIAS', 'DEPORTES', 'CULTURA', 'POLÍTICA'];

const NoticiaSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
    },
    category: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'NOTICIAS',
        validate: { isIn: [NEWS_CATEGORIES] },
    },
    author: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    // Short deck shown on cards; `body` is the full HTML article.
    summary: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    reading_time: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    // Free-text tags and a list of related article ids. Stored as JSON to keep
    // the domain "básico" — no join tables.
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    related_ids: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    // Soft delete: 0 = deleted, 1 = hidden/draft, 2 = published.
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
    },
};

class Noticia extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Noticia',
            timestamps: true,
            indexes: [
                { fields: ['slug'], unique: true },
                { fields: ['category'] },
                { fields: ['status'] },
                { fields: ['published_at'] },
            ],
        };
    }
}

module.exports = { TABLE, NoticiaSchema, Noticia, NEWS_CATEGORIES };
