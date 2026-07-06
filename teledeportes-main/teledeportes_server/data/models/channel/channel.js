const { Model, DataTypes } = require('sequelize');

const TABLE = 'channels';

const ChannelSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    // Public stream name in OvenMediaEngine → used to build the playback URL.
    slug: {
        type: DataTypes.STRING(170),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // Optional external HLS source (a .m3u8 already running elsewhere). When set,
    // the channel plays this URL directly instead of the OME WebRTC/LL-HLS
    // pipeline, and is treated as on-air while active.
    external_hls_url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    // Secret ingest key. The encoder publishes to .../app/<stream_key>; the OME
    // admission webhook rewrites it to <slug> so the key is never public.
    stream_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
    },
    // Flipped by the OME admission webhook on publish start/stop (or manually).
    is_on_air: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    // Admin-uploaded channel poster (relative to MEDIA_ROOT).
    thumbnail_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

class Channel extends Model {
    static associate(_models) {
        // Channels stand alone for now; EPG/program relations come later.
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Channel',
            timestamps: true,
            defaultScope: {
                attributes: { exclude: ['stream_key'] },   // ingest secret hidden by default
            },
            scopes: {
                withKey: { attributes: { include: ['stream_key'] } },
            },
            indexes: [
                { fields: ['slug'], unique: true },
                { fields: ['stream_key'], unique: true },
                { fields: ['status'] },
                { fields: ['is_on_air'] },
                { fields: ['sort_order'] },
                { fields: ['external_source', 'external_id'] },
            ],
        };
    }
}

module.exports = { TABLE, ChannelSchema, Channel };
