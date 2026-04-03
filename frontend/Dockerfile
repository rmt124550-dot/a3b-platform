# ─── Stage 1: Build Next.js ──────────────────────────────────────────────────
# Usamos node desde mirror.gcr.io para evitar rate limit de Docker Hub
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
RUN npm run build

# ─── Stage 2: Nginx para servir archivos estáticos ────────────────────────────
FROM nginx:1.25-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
