// Role bundles. Source of truth for default permissions per role.
// Seeders derive rules from this × installed domains.
//
// Domain code naming (TSS 05 [RIGID]):
//   <resource>:read    — list, get, search
//   <resource>:write   — create, update, move
//   <resource>:admin   — delete, restore, ownership transfer
// Wildcards expand at seed time, not at evaluation time.

const ROLES = {
    webmaster: ['*'],

    admin: [
        'users:read',
        'users:write',
        'users:admin',
        'categories:read',
        'categories:write',
        'categories:admin',
        'videos:read',
        'videos:write',
        'videos:admin',
        'channels:read',
        'channels:write',
        'channels:admin',
        'noticias:read',
        'noticias:write',
        'noticias:admin',
        // Replace with real domains from this project once defined.
        'examples:read',
        'examples:write',
        'examples:admin',
        'authz:read',
        'authz:write',
        'audit:read',
    ],

    technician: [
        'users:read',
        'categories:read',
        'videos:read',
        'videos:write',
        'channels:read',
        'channels:write',
        'noticias:read',
        'noticias:write',
        'examples:read',
        'examples:write',
    ],

    owner: [
        'public:*',
    ],
};

module.exports = { ROLES };
