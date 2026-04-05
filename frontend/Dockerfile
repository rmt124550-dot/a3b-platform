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

# ─── Stage 2: Next.js standalone runner ──────────────────────────────────────
FROM public.ecr.aws/docker/library/node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
