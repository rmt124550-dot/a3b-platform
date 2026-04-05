# ─── Stage 1: Build Next.js ──────────────────────────────────────────────────
FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
RUN npm run build
# Verificar que el export generó archivos
RUN ls -la /app/out/ && test -f /app/out/index.html || (echo "ERROR: out/index.html not found" && exit 1)
RUN echo "Build files:" && find /app/out -name "*.html" | head -20

# ─── Stage 2: nginx static server ────────────────────────────────────────────
FROM public.ecr.aws/docker/library/nginx:1.25-alpine
COPY --from=builder /app/out /usr/share/nginx/html

# Verificar que los archivos se copiaron
RUN ls -la /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
