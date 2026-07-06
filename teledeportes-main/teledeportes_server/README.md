# Trianametria Core Template

Template repository for new Trianametria backend services. Conforms to TSS (Trianametria Software Standards) at the version pinned below.

## What's in here

A Node.js + Express + Sequelize + Postgres skeleton that already satisfies every `[RIGID]` rule from the TSS standards published at the time of this template's release. Drop your domain models, handlers, and routes into the existing layout; the cross-cutting infrastructure is already wired and conformant.

## TSS version pinned

This template implements:

- TSS `01 — Project Structure` (v1.1.0)
- TSS `02 — Code Structure` (v1.0.0)
- TSS `03 — Data Structure` (v1.0.0)
- TSS `04 — API Contract` (v1.0.0)
- TSS `05 — Security` (v1.0.0)
- TSS `06 — Operational` (v1.0.0)

As more standards ship, this section grows and the template's own version bumps.

## Template version

`0.9.0` — production-ready Tier 1: graceful shutdown (SIGTERM/SIGINT, DB pool drain), AsyncLocalStorage request context auto-bound to logger, `/livez` + `/readyz` split, multi-stage non-root `Dockerfile`, example migration file, `.nvmrc` + Node engines, `node:test` smoke suite (`npm test`). Pre-1.0.

`0.8.x` — User preset, AuthManager (login/logout/refresh/me + cookie+CSRF), authenticate / authorize middlewares, `/api/v1/auth/*` and `/api/v1/admin/users/*` routes, idempotent webmaster seeder, docker-compose with Postgres + pgAdmin, `.sequelizerc` for sequelize-cli scaffolding.

## Quick start

```bash
# 1. Clone or copy this folder
cp -r /path/to/templates/core ./my-new-project
cd ./my-new-project

# 2. Initialize git
rm -rf .git           # if cloned with the template's history
git init

# 3. Install dependencies (postinstall pulls TSS into .tts/)
npm install

# 4. Configure
cp .env.example .env
# edit .env (DB creds, JWT_SECRET_PRIMARY, TOKEN_PEPPER, SEED_WEBMASTER_*)

# 5. Bring up Postgres (docker compose, Postgres 16 alpine)
npm run db:up

# 6. Create schema + seed bootstrap user
npm run sync:users
npm run seed:users

# 7. Boot
npm run dev
```

DB lifecycle helpers:

```bash
npm run db:up                         # bring up db + pgadmin
docker compose up -d db               # only the database, no pgadmin
npm run db:down                       # stop (data persists in volume)
npm run db:reset                      # nuke volume and start fresh
npm run migration:create -- add-foo   # scaffold scripts/migrations/<ts>-add-foo.js (sequelize-cli)
npm run migrate                       # apply pending migrations (custom runner)
```

**pgAdmin** is included for local browsing. After `npm run db:up`:

- URL: `http://localhost:${PGADMIN_PORT:-5050}`
- Login: `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` from `.env`
- The "Local (compose)" server is auto-registered (host `db`, user `app`).
  Enter the value of `DB_PASSWORD` from `.env` on first connect.

The `npm install` step runs `scripts/sync_tss.sh` automatically, cloning the
TSS repo (`Trianametria-Software/standards`, `core` track) into `.tts/`. That
folder is gitignored — it is a working copy, not vendored. To refresh later or
pin to a different ref:

```bash
npm run tss:sync                       # latest main
TSS_REF=v1.0.0 npm run tss:sync        # specific tag
TSS_TRACK=core npm run tss:sync        # explicit track (default)
```

`.tts/.sync_meta` records the commit SHA the snapshot was pinned to.

## What this template ships out of the box

- **User preset** — `data/models/user/`, `data/schemas/user.js`, `data/packages/user.js`, `data/seeders/user.js`, `services/managers/user_manager.js`, `services/managers/auth_manager.js`, `services/assemblers/user_assembler.js`, `services/handlers/user_handler.js`, `middlewares/auth/authenticate.js`, `middlewares/auth/authorize.js`, `routes/api/auth.js`, `routes/api/users.js`. Cookie+CSRF, JWT dual-secret, bcrypt cost 12 — all wired.
- **Example preset** — `data/models/example/` and friends. Reference implementation of every TSS pattern. Delete or replace once your real domain models exist.
- **Operational** — env validation at boot, `npm run migrate`, per-feature `sync_*.js` runners, prod guard, `_meta_sync` + `_meta_migrations` audit tables.
- **Security** — helmet, trust proxy, CORS allowlist, MASTER_ACCESS guard, four rate-limit tiers (general, login, session, write).

## What this template does NOT include

- Your domain models. Drop them in `data/models/<domain>/<name>.js` — auto-discovery picks them up at boot.
- Production secrets. Fill `.env` from `.env.example` — `JWT_SECRET_PRIMARY`, `TOKEN_PEPPER`, DB credentials, `SEED_WEBMASTER_*`.
- CI/CD config. Will be added with TSS `08 — Git Workflow`.
- Tests. Will be added with TSS `07 — Testing`.

If you need anything beyond the above before TSS publishes the corresponding standard, copy the proven implementation from `cowre_server` and document the deviation in your project's `docs/decisions/`.

## Where the standards live

`.tts/` at this template root. Treat them as read-only; updates flow downstream from the central TSS repo (or from `cowre_server/.tts` while v1 is under construction).

To check what version a project is conformant against:

```bash
grep "^Version:" .tts/README.md
```

## Bumping the template

When a new TSS standard is published or an existing one bumps:

1. Apply the standard's materialization here.
2. Bump `package.json` version (semver).
3. Update the "TSS version pinned" section above.
4. Existing projects can pull the diff manually or wait for a sync tool (forthcoming).

## Why a template instead of a CLI generator

A CLI generator hides the structure behind a black box. A template is grep-able, diff-able, and inspectable from the first second. It also doubles as documentation: a developer learning TSS can read the template and see every rule manifested as code.

Once TSS stabilizes (v1.0 published, all 9 standards) we may add a thin generator on top to fill placeholders (project name, default port, etc.). Until then, manual clone is the canonical path.

## Contributing

Direct edits here are not the right path. Edits flow from:

1. A change in the TSS standards, applied to a real project (cowre, triarc).
2. A PR to the central TSS repo updating the standard.
3. A separate PR here updating the template to match.

Drift between cowre and the template is a bug.
