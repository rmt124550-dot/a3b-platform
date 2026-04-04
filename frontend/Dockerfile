# ─── Stage 1: Build Next.js ─────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
RUN npm run build

# ─── Stage 2: Nginx ──────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html

# Configuración nginx para SPA + health check
RUN printf '\
server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri.html $uri/index.html /index.html;\n\
    }\n\
    location = /health {\n\
        return 200 "ok";\n\
        add_header Content-Type text/plain;\n\
    }\n\
}\n\
' > /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
