# Etapa 1: Build Next.js static export
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Etapa 2: Nginx en puerto 8080
FROM nginx:1.25-alpine AS runner

# Crear config de nginx embebida en el RUN (sin COPY de archivos externos)
RUN echo 'server { listen 8080; server_name _; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ $uri.html /index.html; } }' \
    > /tmp/a3b.conf && \
    cp /tmp/a3b.conf /etc/nginx/conf.d/default.conf && \
    # Verificar que el config es válido
    nginx -t && \
    echo "✅ nginx config OK - listen 8080"

# Copiar archivos estáticos
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080 || exit 1

CMD ["nginx", "-g", "daemon off;"]
