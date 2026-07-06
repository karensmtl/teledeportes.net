// Reference model conformant to TSS 03.
// Demonstrates: status (soft delete), remarks (JSON), external refs,
// timestamps with field mapping, indexes on FKs and lookup columns.
const { Model, DataTypes } = require('sequelize');

const TABLE = 'examples';

const ExampleSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
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

class Example extends Model {
    static associate(_models) {
        // Associations go here once other models exist.
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'Example',
            timestamps: true,
            indexes: [
                { fields: ['status'] },
                { fields: ['external_source', 'external_id'] },
            ],
        };
    }
}

module.exports = { TABLE, ExampleSchema, Example };
