FROM public.ecr.aws/docker/library/node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl netcat-openbsd

# Dependencias producción
FROM base AS deps
COPY package.json ./
RUN npm install --omit=dev

# Builder
FROM base AS builder
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps    /app/node_modules         ./node_modules
COPY --from=builder /app/dist                 ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma               ./prisma
COPY --from=builder /app/package.json         ./

# Startup script
RUN printf '#!/bin/sh\n\
echo "Esperando postgres..."\n\
until nc -z postgres 5432 2>/dev/null; do sleep 2; done\n\
echo "Postgres listo"\n\
echo "Sincronizando schema..."\n\
node_modules/.bin/prisma db push --schema=./prisma/schema.prisma --accept-data-loss --skip-generate\n\
echo "Arrancando API..."\n\
exec node dist/server.js\n' > /app/start.sh && chmod 755 /app/start.sh

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["/bin/sh", "/app/start.sh"]
