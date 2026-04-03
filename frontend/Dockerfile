# Etapa 1: Build Next.js static export
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# La URL del API debe estar en build time para Next.js static export
ENV NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
RUN npm run build

# Etapa 2: nginx servir archivos estáticos
FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
