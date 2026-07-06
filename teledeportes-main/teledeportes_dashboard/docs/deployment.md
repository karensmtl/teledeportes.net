# Deployment

> Required by TSS `vite/06 §Deployment runbook`. Fill in the project-specific
> details before the first production deploy.

## Target

Document the deploy target:

- Provider: (Hostinger VPS / Vercel / Netlify / Cloudflare Pages / other)
- Domain(s): (e.g., `app.example.com`, `staging.example.com`)
- TLS: managed by (Let's Encrypt via certbot / Cloudflare / platform-managed)

## Build

```bash
npm ci
npm run build
# Output: dist/
```

Build-time env vars (Vite bakes `VITE_*` into the bundle at build time, not at runtime):

| Var | Required | Notes |
|---|---|---|
| `VITE_API_ENDPOINT` | yes | Backend API root, no trailing slash. |
| `VITE_CDN_PUBLIC` | no | CDN base for public assets. |
| `VITE_PROJECT_NAME` | no | Rendered in the footer. |

If using Docker:

```bash
docker build \
    --build-arg VITE_API_ENDPOINT=https://api.example.com/api/v1 \
    -t my-frontend .
docker run -p 80:80 my-frontend
```

## Reverse proxy (nginx / self-hosted)

See `docker/nginx.conf` for the reference config. Required behaviors:

- SPA fallback: `try_files $uri $uri/ /index.html;` so client routes resolve.
- Cache headers: `immutable; max-age=1y` on `/assets/*`, `no-cache` on `index.html`.
- gzip + brotli on text assets.
- Security headers per TSS `vite/05`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Content-Security-Policy`.
- HTTPS only — redirect HTTP → HTTPS, HSTS enabled.

## Env vars in production

Document where the env vars are set (deploy platform UI, build-time secrets, etc.) and which person/role can rotate them. Never check secrets into git.

## Cold start

```bash
# Pull latest
git pull origin main

# Install + build
npm ci && npm run build

# Serve dist/ via nginx (already running) — usually nothing else to do
# since dist/ is the document root.
```

If using PM2 or systemd to manage nginx/static-host: document the unit name and how to restart.

## Rollback

The dp scheme is the rollback unit. To roll back to dp5.14:

```bash
git checkout dp5.14
npm ci && npm run build
# redeploy dist/
```

Tag every release (`git tag dpN.M && git push --tags`) so this works.

## Health check

The static host responds 200 on `/` when alive. For deeper checks (asset
integrity, dependency reachability) the SPA itself reports via the backend's
`/api/v<N>/health`.

## On-call

(Document the escalation path — email, Slack channel, phone — and the SLA
for restoration.)
