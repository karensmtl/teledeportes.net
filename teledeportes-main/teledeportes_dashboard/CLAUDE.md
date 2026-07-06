# CLAUDE.md

Project-specific notes for the Claude Code agent. Keep this short and current.

## Project context

**TeleDeportes** (teledeportes.net) — sports streaming frontend. Two surfaces: live football
channels (sub-second WebRTC/WHEP playback, 2-3 channels at once) and a static VOD catalog browser
ordered by DB. Talks to `teledeportes-server` (Express control plane) via `api` for all metadata
(auth, catalog, channel list + their WHEP URLs).

Live video does **not** flow through the backend: the player connects directly to the
**OvenMediaEngine** media server using the WHEP URL the backend hands it. VOD plays from CDN/HLS.

Brand: blue `#0074B2`, orange `#E68526`. Logo at `../common/logo.jpeg`.

## TSS conformance — READ FIRST

This project is governed by the **Trianametria Software Standards (TSS)**, `vite/` track. The full set of rules lives in `.tts/` (working copy, gitignored). Source of truth: `https://github.com/Trianametria-Software/standards`.

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

- Vite 7 + React 19 (`@vitejs/plugin-react-swc`)
- react-router-dom v7
- @tanstack/react-query for server state
- axios for the HTTP client
- react-hot-toast for notifications
- (Add tools as the project adopts them.)

## Conventions worth remembering

- **Six top-level folders** under `src/`: `app/`, `core/`, `common/`, `global/`, `features/`, `pages/`. Imports flow downward — pages → features → global/common/core. See `.tts/vite/01-project-structure.md`.
- **Pages are thin** — they mount a feature layout, that's it. Data fetching, business logic, forms all live inside the feature.
- **New features**: drop a folder in `src/features/<entity>/` with `{contexts, forms, layouts, styles, utils}`. CSS lives in `styles/`, never colocated.
- **Server state**: `useQuery` / `useMutation` only. No `useState` holding backend responses. The cache (TanStack Query) handles dedup, refetch, and lifecycle.
- **UI gating by permission**: `<Gate domain="...">` is the ONLY way in JSX. Inline `{can('foo') && <X/>}` is forbidden. Use `can/canAny/canAll` only in route guards, builders, and event handlers — never in JSX.
- **HTTP**: every call goes through `api` from `src/core/network/api.js`. Token auth, CSRF, content-type detection, 401/403 side effects, and `X-Request-ID` are handled automatically. Errors thrown are always `ApiError` — read `.fields`, `.status`, `.isNetwork`, etc.
- **CSS classes**: explicit BEM (`.user-card__name--inactive`). No 2-3 letter prefixes (`.uc-name` is forbidden).
- **Constants**: live in `src/core/constants/<domain>.js`. Don't define `const MAX_LEN = 255` at the top of a component file — import it.
- **Versioning**: `dp<M>.<N>` per `vite/06`. The changelog is at `src/features/footer/changelog.js`. Adding a release means prepending an entry to that array and committing as `release: dp<M>.<N> — <title>`.

## Commands

```bash
npm run dev           # vite dev server (--host so LAN/mobile testing works)
npm run build         # production build to dist/
npm run preview       # preview the prod build locally
npm run lint          # eslint
npm run tss:sync      # refresh .tts/ from the standards repo
```

## Environment

`.env.local` (gitignored) for dev overrides. `.env.production` (gitignored) for prod values; in real deployments those live in the deploy platform's env-var store. See `.env.example` for the full list.

## Where to look for examples

Real implementations of the patterns live in `cowre_dashboard` (the source from which this template was distilled). Search there before designing from scratch. The migration backlog in `.tts/vite/_backlog.md` lists the places where cowre_dashboard still drifts from the standard — useful to see what's "in flight" vs settled.
