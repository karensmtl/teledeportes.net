# Trianametria Vite Template

Template repository for new Trianametria frontend services. Conforms to TSS (Trianametria Software Standards), `vite/` track, at the version pinned below.

## What's in here

A Vite + React + react-router skeleton that already satisfies every `[RIGID]` rule from the TSS vite/ standards published at the time of this template's release. Drop your domain features into the existing layout; the cross-cutting infrastructure (HTTP client, TanStack Query setup, auth context, route guards, build config, Docker, deployment) is already wired and conformant.

## TSS version pinned

This template implements:

- TSS `vite/01 — Project Structure` (v1.0.0)
- TSS `vite/02 — Code Structure` (v1.0.0)
- TSS `vite/03 — State and Data Flow` (v1.0.0)
- TSS `vite/04 — API Consumption` (v1.0.0)
- TSS `vite/05 — Security` (v1.0.0)
- TSS `vite/06 — Operational` (v1.0.0)

Drafts pinned for reference (provisional rules apply):

- TSS `vite/07 — Testing` (v0.1.0)
- TSS `vite/08 — Git Workflow` (v0.1.0)
- TSS `vite/09 — Documentation` (v0.2.0)

As drafts graduate, this section grows and the template's own version bumps.

## Template version

`0.2.0` — Tier 2: adds the Example feature and SimpleCrud generic component.

- **Example feature** (`src/features/example/`) — reference end-to-end implementation of TSS vite/03 + /04 + /05. Demonstrates `useQuery` / `useMutation` over `api`, per-flow context for multi-field forms (`CreateItemProvider`), URL state for filters, debounced search, refreshing-state CSS, `<Gate>`-wrapped actions, `error.fields` rendered inline. Mounted at `/admin/example`.
- **SimpleCrud component** (`src/common/components/SimpleCrud/`) — generic CRUD UI for `{ id, name, description }` catalog entities. Drop-in for any backend endpoint with a unique-name constraint. Permission-aware via `readDomain` / `writeDomain` props. FK-usage hint blocks deletion when a foreign key references the row. Mounted at `/admin/example/categories` as a working demo.
- **Icon set** (`src/common/icons/`) — foundational SVG icons (Edit, Trash, Plus, Eye, EyeOff) using `currentColor`.

`0.1.0` — Tier 1 foundation: TSS-conformant skeleton that boots end-to-end. Includes the new HTTP client (`api` + `ApiError` + content-type auto-detection + `useBridge` shim), the canonical 4-tier provider composition (Router → Auth → QueryClient → cross-app), the cookie+CSRF-ready auth context with `<Gate>` + route guards, the dp-scheme changelog, footer/header skeletons, login + unauthorized pages, multi-stage Dockerfile + SPA-aware nginx config.

## Quick start

```bash
# 1. Clone or copy this folder
cp -r /path/to/templates/vite ./my-new-frontend
cd ./my-new-frontend

# 2. Initialize git
rm -rf .git           # if cloned with the template's history
git init

# 3. Install dependencies (postinstall pulls TSS into .tts/)
npm install

# 4. Configure
cp .env.example .env.local
# edit .env.local (VITE_API_ENDPOINT pointing at your backend)

# 5. Boot
npm run dev
```

Open http://localhost:5173 — you'll land on `/login` because no session exists. The form won't authenticate until the backend exposes `POST /auth/login` per TSS `core/05` (cookie+CSRF transport).

The `npm install` step runs `scripts/sync_tss.sh` automatically, cloning the TSS repo (`Trianametria-Software/standards`) into `.tts/`. That folder is gitignored — it's a working copy, not vendored. Default ref is `vite-standards` until the track merges to `main`. To refresh or pin to a different ref:

```bash
npm run tss:sync                          # default (vite-standards branch)
TSS_REF=main npm run tss:sync             # post-merge
TSS_REF=v1.0.0 npm run tss:sync           # specific tag
TSS_TRACK=vite npm run tss:sync           # explicit track (default)
```

`.tts/.sync_meta` records the commit SHA the snapshot was pinned to.

## What this template ships out of the box

- **HTTP client** (`src/core/network/`) — axios instance + `ApiError` class + content-type auto-detection (FormData / Blob / URLSearchParams / object) + `X-Request-ID` injection + dev-mode response logging + backward-compatible `useBridge` shim + `uploadFile` / `downloadFile` helpers.
- **TanStack Query** wired as the 3rd provider layer with sensible defaults (staleTime 30s, retry 1, refetch on focus).
- **Auth context** (`src/global/contexts/auth/auth.jsx`) — `AuthProvider`, `useAuth()` with `can/canAny/canAll`, `<Gate>` component (the ONLY way to gate JSX by permission per TSS vite/05), `<ProtectedRoute>` and `<AuthRoute>` route guards, permission refresh on focus + on 403, multi-tab logout sync.
- **App shell** (`src/app/app.jsx`) — providers composed in the canonical order, router with login/unauthorized/dashboard routes, `<Toaster>` for toasts.
- **Footer with dp versioning** — `src/features/footer/changelog.js` is the authoritative version source (starts at `dp1.0`). Footer renders the current version as a link to `/admin/changelog`.
- **Header skeleton** — permission-aware menu using `can/canAny` outside JSX (the allowed exception per TSS vite/05).
- **Pre-auth pages** — `pages/login.jsx`, `pages/unauthorized.jsx` with their own styles.
- **Operational** — env validation at boot (`global/config/api.js` throws if `VITE_API_ENDPOINT` missing), `<StrictMode>` wrapping, eslint config, multi-stage Dockerfile, nginx config with SPA fallback + cache headers + security headers.

## What this template does NOT include

- Your domain features. Drop them in `src/features/<entity>/...` per TSS vite/01.
- A real login backend integration. The login flow assumes the backend exposes `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `GET /auth/permissions` with cookie+CSRF transport per TSS `core/05`. The template's `AuthProvider` is wired to call those; bring the backend up to match.
- An Example feature demonstrating end-to-end CRUD. Will ship in 0.5.x as the second-tier preset (matching what `templates/core/` does with its Example preset).
- Tests. Will be added when TSS `vite/07 — Testing` graduates to stable.
- CI/CD config. Will be added when TSS `vite/08 — Git Workflow` graduates to stable.
- Production secrets. Fill `.env.production` (gitignored) or set env vars in your deploy platform.

## Where the standards live

`.tts/` at this template root. Treat as read-only; updates flow downstream from the central TSS repo. To check what version a project is conformant against:

```bash
grep "^Version:" .tts/README.md
cat .tts/.sync_meta
```

## Bumping the template

When a new TSS standard publishes or an existing one bumps:

1. Apply the standard's materialization here.
2. Bump `package.json` version (template's own semver).
3. Update the "TSS version pinned" section above.
4. Update `package.json.tssVersion` to match the new pin.
5. Add a changelog entry to `src/features/footer/changelog.js` with the next `dp<M>.<N>`.

## Why a template instead of a CLI generator

A CLI generator hides the structure behind a black box. A template is grep-able, diff-able, and inspectable from the first second. It also doubles as documentation: a developer learning TSS can read the template and see every rule manifested as code.

Once TSS stabilizes (all 9 standards stable) we may add a thin generator on top to fill placeholders (project name, default port, brand color). Until then, manual clone is the canonical path.

## Contributing

Direct edits here are not the right path. Edits flow from:

1. A change in the TSS standards, applied to a real project (`cowre_dashboard`).
2. A PR to the central TSS repo updating the standard.
3. A separate PR here updating the template to match.

Drift between `cowre_dashboard` and the template is a bug.
