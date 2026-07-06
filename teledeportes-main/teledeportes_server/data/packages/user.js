// User payload skeleton. The package is passive; assemblers fill it.
// Never include password_hash, even transiently — the model's default scope
// already excludes it, but we re-enforce here.
class UserPackage {
    constructor() {
        this.packaged = {
            id: null,
            email: null,
            name: null,
            role: null,
            status: null,
            permissions: [],
            last_login_at: null,
            created_at: null,
            updated_at: null,
        };
    }

    addUser(user) {
        if (!user) return;
        this.packaged.id            = user.id;
        this.packaged.email         = user.email;
        this.packaged.name          = user.name;
        this.packaged.role          = user.role;
        this.packaged.status        = user.status;
        this.packaged.last_login_at = user.last_login_at ?? user.lastLoginAt ?? null;
        this.packaged.created_at    = user.created_at ?? user.createdAt ?? null;
        this.packaged.updated_at    = user.updated_at ?? user.updatedAt ?? null;
    }

    addPermissions(permissions) {
        this.packaged.permissions = Array.from(new Set(permissions || []));
    }

    build() {
        return this.packaged;
    }
}

module.exports = UserPackage;
