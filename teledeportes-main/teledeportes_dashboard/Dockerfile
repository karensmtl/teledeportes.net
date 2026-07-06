# Multi-stage build: Node for vite build, nginx for serving the SPA.
# TSS vite/06 — Operational.

# ---- build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build-time env vars (VITE_*) must be present at this point — they are
# baked into the bundle. Pass them with --build-arg or .env.production.
ARG VITE_API_ENDPOINT
ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT}

RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine

# Copy SPA build output.
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config with the SPA-aware one.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Drop privileges — runtime user. nginx:nginx already exists in the image.
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Healthcheck (TSS vite/06 §Health checks).
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
