# syntax=docker/dockerfile:1.7
# Multi-stage build for production. The dev workflow uses `npm run dev` on the
# host; this Dockerfile is for staging / prod images.
#
# Build:    docker build -t my-app:latest .
# Run:      docker run --env-file .env -p 4000:4000 my-app:latest

# ---- dev: full deps + hot reload (used by docker-compose `app` service) -----
# The whole backend (app + its node_modules) lives in this container, so the
# host needs no Node install. Source is bind-mounted at runtime; node_modules
# is kept in a named volume so the Linux-native build (bcrypt) is never
# shadowed by a host build.
FROM node:20-alpine AS dev
WORKDIR /app

ENV NODE_ENV=development \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    CHOKIDAR_USEPOLLING=true

# Toolchain for native modules (bcrypt) + bash/git/wget for the TSS sync
# postinstall and the healthcheck + ffmpeg for the VOD transcode worker.
RUN apk add --no-cache bash git python3 make g++ wget ffmpeg

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 4000
STOPSIGNAL SIGTERM

# Bind-mounted source + polling (CHOKIDAR_USEPOLLING) so host edits hot-reload
# inside the container; --legacy-watch makes nodemon poll too (Windows bind
# mounts don't deliver inotify events).
CMD ["npx", "nodemon", "--legacy-watch", "index.js"]

# ---- deps: production dependencies only ------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# ---- runtime ---------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000 \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Non-root user, owns /app.
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app . .

# .tts/ is gitignored, so it is not in the build context. The image runs
# without standards inside it — that is correct: standards are dev-time.

USER app
EXPOSE 4000

# Native signal forwarding so SIGTERM reaches Node directly.
STOPSIGNAL SIGTERM

# Container-side liveness probe (k8s / ECS will hit /livez over HTTP anyway).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:${PORT}/livez >/dev/null || exit 1

CMD ["node", "index.js"]
