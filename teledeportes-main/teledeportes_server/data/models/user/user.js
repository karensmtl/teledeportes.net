// User model — TSS 03 conformant. Reference for any new project.
// Status: 0 deleted, 1 inactive, 2 active. Role names match keys in core/authz/roles.js.
// Password is stored as a bcrypt hash; password_hash is excluded from default scope.
const { Model, DataTypes } = require('sequelize');

const TABLE = 'users';

const ROLES = ['webmaster', 'admin', 'technician', 'owner'];

const UserSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    password_hash: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'owner',
        validate: { isIn: [ROLES] },
    },
    last_login_at: {
        type: DataTypes.DATE,
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

class User extends Model {
    static associate(_models) {
        // Add User-owned relations as the project grows.
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TABLE,
            modelName: 'User',
            timestamps: true,
            defaultScope: {
                attributes: { exclude: ['password_hash'] },
            },
            scopes: {
                withSecret: { attributes: { include: ['password_hash'] } },
            },
            indexes: [
                { fields: ['email'], unique: true },
                { fields: ['status'] },
                { fields: ['role'] },
                { fields: ['external_source', 'external_id'] },
            ],
        };
    }
}

module.exports = { TABLE, UserSchema, User, ROLES };
