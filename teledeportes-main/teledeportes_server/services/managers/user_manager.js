// UserManager — transactional writes around the User entity.
// Anything that requires hashing, multi-step state, or future cross-model
// writes (e.g. profile creation) lives here, not in the handler.
const boom = require('@hapi/boom');

const { sequelize, models } = require('../../core/database');
const { hashPassword, verifyPassword } = require('../../core/security/hashing');
const userSchemas = require('../../data/schemas/user');

function validate(name, data) {
    const schema = userSchemas[name];
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
        const fields = {};
        for (const d of error.details) fields[d.path.join('.')] = d.message;
        const err = boom.badRequest('Datos inválidos');
        err.output.payload.fields = fields;
        throw err;
    }
    return value;
}

class UserManager {
    async register(data) {
        const value = validate('create', data);

        const existing = await models.User.findOne({ where: { email: value.email } });
        if (existing) throw boom.conflict('El correo ya está registrado');

        return sequelize.transaction(async tx => {
            const password_hash = await hashPassword(value.password);
            const created = await models.User.create(
                {
                    email: value.email,
                    name: value.name,
                    role: value.role,
                    status: value.status,
                    password_hash,
                    remarks: value.remarks ?? null,
                    external_source: value.external_source ?? null,
                    external_id: value.external_id ?? null,
                },
                { transaction: tx }
            );
            return created.toJSON();      // default scope already excludes password_hash
        });
    }

    async update(data) {
        const value = validate('update', data);
        const target = await models.User.findByPk(value.id);
        if (!target) throw boom.notFound('Usuario no encontrado');

        if (value.email && value.email !== target.email) {
            const dup = await models.User.findOne({ where: { email: value.email } });
            if (dup) throw boom.conflict('El correo ya está registrado');
        }

        const { id, ...rest } = value;
        await target.update(rest);
        return target.toJSON();
    }

    async changePassword(userId, payload) {
        const value = validate('change_password', payload);
        const target = await models.User.scope('withSecret').findByPk(userId);
        if (!target) throw boom.notFound('Usuario no encontrado');

        const ok = await verifyPassword(value.current_password, target.password_hash);
        if (!ok) throw boom.unauthorized('Contraseña actual incorrecta');

        const password_hash = await hashPassword(value.new_password);
        await target.update({ password_hash });
        return { changed: true };
    }

    async setRole(userId, role) {
        const { ROLES } = require('../../data/models/user/user');
        if (!ROLES.includes(role)) throw boom.badRequest('Rol inválido');
        const target = await models.User.findByPk(userId);
        if (!target) throw boom.notFound('Usuario no encontrado');
        await target.update({ role });
        return target.toJSON();
    }

    async deactivate(userId) {
        const target = await models.User.findByPk(userId);
        if (!target) throw boom.notFound('Usuario no encontrado');
        await target.update({ status: 1 });
        return target.toJSON();
    }
}

module.exports = UserManager;
