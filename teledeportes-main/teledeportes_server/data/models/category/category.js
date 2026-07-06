const { Model, DataTypes } = require('sequelize');

const TABLE = 'categories';

const CategorySchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
    },
    slug: {
        type: DataTypes.STRING(140),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
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
        defaultValue: 2,        // 0 = deleted, 1 = inactive, 2 = active
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

class Category extends Model {
    static associate(models) {
        this.hasMany(models.Video, {
            as: 'videos',
            foreignKey: 'category_id',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Category',
            timestamps: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['slug'], unique: true },
                { fields: ['status'] },
                { fields: ['sort_order'] },
                { fields: ['external_source', 'external_id'] },
            ],
        };
    }
}

module.exports = { TABLE, CategorySchema, Category };
