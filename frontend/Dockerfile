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

# ─── Stage 2: nginx static server ────────────────────────────────────────────
FROM public.ecr.aws/docker/library/nginx:1.25-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
