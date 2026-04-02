FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl netcat-openbsd

# Dependencias de producción
FROM base AS deps
COPY package.json ./
RUN npm install --omit=dev

# Builder — instalar todo y compilar
FROM base AS builder
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner final
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

COPY --from=deps    /app/node_modules       ./node_modules
COPY --from=builder /app/dist               ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma             ./prisma
COPY --from=builder /app/package.json       ./

# Script de inicio: espera postgres y redis antes de arrancar
COPY --from=builder /app/package.json ./
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "⏳ Esperando PostgreSQL..."' >> /app/start.sh && \
    echo 'until nc -z postgres 5432 2>/dev/null; do sleep 2; done' >> /app/start.sh && \
    echo 'echo "✅ PostgreSQL listo"' >> /app/start.sh && \
    echo 'echo "⏳ Esperando Redis..."' >> /app/start.sh && \
    echo 'until nc -z redis 6379 2>/dev/null; do sleep 2; done' >> /app/start.sh && \
    echo 'echo "✅ Redis listo"' >> /app/start.sh && \
    echo 'echo "🗄️ Ejecutando migraciones..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy --schema ./prisma/schema.prisma' >> /app/start.sh && \
    echo 'echo "🚀 Arrancando API..."' >> /app/start.sh && \
    echo 'exec node dist/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

USER expressjs
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["/app/start.sh"]
