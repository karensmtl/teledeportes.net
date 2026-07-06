// UserAssembler — read-only, hydrates a UserPackage with permissions
// derived from core/authz/roles.js. Replace the permission expansion
// when the project promotes authz to a database-backed rules engine.
const { models } = require('../../core/database');
const { ROLES } = require('../../core/authz/roles');

const UserPackage = require('../../data/packages/user');

class UserAssembler {
    constructor() {
        this.models = models;
    }

    async assembleById(id) {
        const found = await this.models.User.findByPk(id, { raw: true });
        if (!found) return null;

        const pkg = new UserPackage();
        pkg.addUser(found);
        pkg.addPermissions(this.#permissionsFor(found.role));
        return pkg.build();
    }

    async assembleByEmail(email) {
        if (!email) return null;
        const found = await this.models.User.findOne({
            where: { email: String(email).toLowerCase() },
            raw: true,
        });
        if (!found) return null;

        const pkg = new UserPackage();
        pkg.addUser(found);
        pkg.addPermissions(this.#permissionsFor(found.role));
        return pkg.build();
    }

    #permissionsFor(role) {
        return ROLES[role] || [];
    }
}

module.exports = UserAssembler;
