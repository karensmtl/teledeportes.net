const { Model, DataTypes } = require('sequelize');

const TABLE = 'videos';

// Transcode lifecycle, independent of the soft-delete `status`.
// A video is only watchable when processing_status === 'ready'.
const PROCESSING_STATUSES = ['pending', 'processing', 'ready', 'failed'];

const VideoSchema = {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    processing_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: { isIn: [PROCESSING_STATUSES] },
    },
    duration_seconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    size_bytes: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    original_filename: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    // Paths are stored relative to MEDIA_ROOT; the public URL is composed
    // at assemble time from MEDIA_PUBLIC_URL. The DB never holds absolute URLs.
    source_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    hls_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    thumbnail_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    // Admin-uploaded poster. Takes precedence over the auto-generated thumbnail
    // and survives re-processing.
    custom_thumbnail_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    // Transcode failure detail. Surfaced to admins, never to the public payload.
    error: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
    },
    remarks: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    external_source: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    external_id: {
        type: DataTypes.STRING,
        allowNull: true,
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

class Video extends Model {
    static associate(models) {
        this.belongsTo(models.Category, {
            as: 'categoryData',
            foreignKey: 'category_id',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Video',
            timestamps: true,
            indexes: [
                { fields: ['slug'], unique: true },
                { fields: ['category_id'] },
                { fields: ['status'] },
                { fields: ['processing_status'] },
                { fields: ['external_source', 'external_id'] },
            ],
        };
    }
}

module.exports = { TABLE, VideoSchema, Video, PROCESSING_STATUSES };
