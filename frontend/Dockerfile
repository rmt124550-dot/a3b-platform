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

# Copiar el export estático de Next.js
COPY --from=builder /app/out /usr/share/nginx/html

# Configuración de nginx
RUN printf 'server {\n\
    listen 3000;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    # SPA routing — todas las rutas al index.html\n\
    location / {\n\
        try_files $uri $uri/ $uri.html /index.html;\n\
    }\n\
    \n\
    # Cache para assets estáticos\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    \n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

CMD ["nginx", "-g", "daemon off;"]
