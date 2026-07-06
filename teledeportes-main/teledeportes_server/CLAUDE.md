# CLAUDE.md

Project-specific notes for the Claude Code agent. Keep this short and current.

## Project context

**TeleDeportes** (teledeportes.net) — sports streaming platform: live football channels at
sub-second latency (2-3 simultaneous channels) plus a static VOD catalog ordered by DB.

This Express service is the **control plane only**. It owns: auth/users/permissions (TSS preset),
the VOD catalog (videos, categories, ordering), live-channel metadata (each channel's name, state,
and the WHEP/stream key it maps to on the media server), and EPG/scheduling. It **never serves video
bytes** — `[RIGID]` boundary.

The **media plane is separate** and self-hosted on **OvenMediaEngine** (SRT/RTMP ingest →
sub-second WebRTC/WHEP delivery, LL-HLS fallback). The backend only stores *which OME stream a
channel points to*; players hit OME directly for the actual stream. Do not add video
transcode/relay logic here.

Brand: blue `#0074B2`, orange `#E68526`.

## TSS conformance — READ FIRST

This project is governed by the **Trianametria Software Standards (TSS)**. The full set of rules lives in `.tts/` (working copy, gitignored). Source of truth: `https://github.com/Trianametria-Software/standards`.

Before doing **any** work in this repo, you MUST:

1. Verify `.tts/` exists. If it does not, run `npm run tss:sync` (or `bash scripts/sync_tss.sh`) before proceeding.
2. Read `.tts/README.md` — it indexes every standard with its current version and status.
3. For each task, identify which standards are in scope and skim the relevant sections.

Then, **strictly**:

- `[RIGID]` rules are non-negotiable. Do not break them. If a task seems to require breaking one, stop and surface it to the user — do not invent a workaround.
- `[CONTEXTUAL]` rules use the documented default unless an exemption exists in `docs/decisions/`. If you deviate, write the decision file.
- `[GUIDELINE]` rules are followed by default. Deviating is allowed but expect to justify it in PR review.

The pinned snapshot in `.tts/.sync_meta` records the exact commit SHA you are conforming to. If you suspect drift, re-run `npm run tss:sync`.

If `.tts/` and the code in this repo disagree, **the standard wins** unless there is a `docs/decisions/` file justifying the exception. Flag the conflict to the user.

## Stack

- Node.js + Express 5
- Sequelize 6 + Postgres
- Joi for validation
- Pino for structured logging
- (Add tools as the project adopts them.)

## Conventions worth remembering

- Layered architecture is `[RIGID]`: routes → handlers/managers/assemblers → models. A route never imports a model directly.
- New models: drop a file in `data/models/<domain>/<name>.js` exporting `{ Model, ModelSchema }`. Auto-discovery picks it up at boot.
- New endpoints: extend `BaseHandler` (`services/handlers/handler.js`) for thin CRUD; promote to a manager when you need a transaction or cross-model writes.
- Errors throw Boom or set `err.statusCode + err.fields`. `middlewares/error/error.js` formats them.

## Commands you may need

Dev runs **fully in Docker** — the app, its node_modules, Postgres and pgAdmin
are all containers; the host needs no Node install. Source is bind-mounted and
nodemon hot-reloads (`--legacy-watch` + `CHOKIDAR_USEPOLLING` for Windows mounts).

```bash
docker compose up -d --build         # build + start the whole stack
docker compose logs -f app           # tail API logs (nodemon)
docker compose exec app sh           # shell into the app container
docker compose exec app npm run sync:users   # create/sync schema (run once)
docker compose exec app npm run seed:users   # bootstrap webmaster
docker compose exec app npm test             # run the test suite in-container
docker compose restart app           # force a restart
docker compose down                  # stop (db volume persists)
docker compose down -v               # stop + wipe data
```

- App: http://localhost:4000  ·  pgAdmin: http://localhost:5050  ·  db: localhost:5432
- The `app` service sets `DB_HOST=db` (compose env) overriding the `.env`
  `localhost` used by host-side tooling. `dotenv` doesn't override existing env.
- After changing dependencies (`package.json`), rebuild: `docker compose up -d --build app`.
- Known issue: the prod `Dockerfile` runtime stage uses `npm ci --ignore-scripts`,
  which skips bcrypt's native-binary install — fix before the first prod image build.

## Where to look for examples

Real implementations of the patterns live in `cowre_server` (the source from which this template was distilled). Search there before designing from scratch.
