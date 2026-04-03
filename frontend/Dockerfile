# Etapa 1: Build Next.js static export
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Etapa 2: nginx:1.25-alpine stock + reemplazar solo el HTML
FROM nginx:1.25-alpine AS runner

# Copiar archivos estáticos reemplazando el welcome page de nginx
COPY --from=builder /app/out /usr/share/nginx/html

# nginx:1.25-alpine escucha en puerto 80 por defecto — NO modificamos nada más

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
