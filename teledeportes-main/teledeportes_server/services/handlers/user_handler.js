// UserHandler — thin reads over the User entity. Writes go through UserManager
// (services/managers/user_manager.js) because they hash passwords and may
// expand to multi-model transactions. The handler is intentionally read-only.
const BaseHandler = require('./handler');

const { models } = require('../../core/database');
const userSchemas = require('../../data/schemas/user');

class UserHandler extends BaseHandler {
    constructor() {
        super(models.User, userSchemas);
    }

    async create() {
        throw new Error('Use UserManager.register — never create users via the handler.');
    }

    async update() {
        throw new Error('Use UserManager.update — handler updates would skip transactional rules.');
    }
}

module.exports = UserHandler;
