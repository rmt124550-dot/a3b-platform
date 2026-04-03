# ── Etapa 1: Build Next.js static export ──
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json ./
RUN npm install

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Etapa 2: Nginx sirve los archivos estáticos ──
FROM nginx:alpine AS runner

# Remover config por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestra configuración
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiar el export estático
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

CMD ["nginx", "-g", "daemon off;"]
