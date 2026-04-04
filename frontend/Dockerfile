# ─── Stage 1: Build Next.js ─────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
RUN npm run build

# ─── Stage 2: nginx static server ────────────────────────────────────────────
FROM nginx:1.25-alpine
# Copiar archivos estáticos compilados
COPY --from=builder /app/out /usr/share/nginx/html
# Copiar config nginx con SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Verificar config antes de arrancar
RUN nginx -t
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
