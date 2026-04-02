# 08 — Instalación y Desarrollo Local

## Prerrequisitos

- Docker + Docker Compose
- Node.js 20+ (para desarrollo sin Docker)
- Git

## Setup rápido con Docker (recomendado)

```bash
# 1. Clonar
git clone https://github.com/rmt124550-dot/a3b-platform.git
cd a3b-platform

# 2. Variables de entorno
cp .env.example .env
# Editar .env con valores locales (ver sección Variables)

# 3. Levantar todos los servicios
docker compose up -d

# 4. Migraciones de base de datos
docker compose exec backend npx prisma migrate deploy

# 5. Verificar
curl http://localhost:4000/health
# → {"status":"ok","version":"1.0.0"}
```

**URLs locales:**
- Frontend: http://localhost:3000
- API: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Variables de entorno para desarrollo local

Editar `.env` con estos valores mínimos:

```bash
# DB — usar los defaults del docker-compose
POSTGRES_USER=a3b_user
POSTGRES_PASSWORD=localpass123
POSTGRES_DB=a3b_db
DATABASE_URL=postgresql://a3b_user:localpass123@postgres:5432/a3b_db

# Redis
REDIS_PASSWORD=localredis123
REDIS_URL=redis://:localredis123@redis:6379

# JWT — cualquier string largo
JWT_SECRET=local_jwt_secret_at_least_32_characters_long
JWT_REFRESH_SECRET=local_refresh_secret_at_least_32_characters_long

# Stripe — usar claves TEST (no LIVE)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # de Stripe CLI
STRIPE_PRICE_PRO_MONTHLY=price_test_...
STRIPE_PRICE_TEAM_MONTHLY=price_test_...

# Deepl — opcional en local
DEEPL_API_KEY=

# Email — opcional en local (se puede dejar vacío)
RESEND_API_KEY=

# URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Desarrollo del Backend (sin Docker)

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev

npm run dev
# → API en http://localhost:4000
```

## Desarrollo del Frontend (sin Docker)

```bash
cd frontend
npm install
npm run dev
# → App en http://localhost:3000
```

## Prueba de Stripe en local

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks a tu API local
stripe listen --forward-to http://localhost:4000/api/billing/webhook

# El CLI imprime el webhook secret — copiar a .env como STRIPE_WEBHOOK_SECRET

# Simular un pago exitoso
stripe trigger checkout.session.completed
```

## Instalar la extensión en modo desarrollo

```bash
# No requiere build — cargar directamente la carpeta /extension

# Chrome / Edge
chrome://extensions → Activar "Modo desarrollador" → Cargar descomprimida → seleccionar /extension

# Firefox
about:debugging → Este Firefox → Cargar complemento temporal → seleccionar extension/manifest.json
```

## Comandos útiles Docker

```bash
# Ver logs en tiempo real
docker compose logs -f backend
docker compose logs -f frontend

# Reiniciar un servicio tras cambios
docker compose restart backend

# Acceder a la DB
docker compose exec postgres psql -U a3b_user -d a3b_db

# Acceder a Redis
docker compose exec redis redis-cli -a localredis123

# Ejecutar migraciones
docker compose exec backend npx prisma migrate dev

# Abrir Prisma Studio (GUI de la DB)
docker compose exec backend npx prisma studio
```

## Estructura de commits

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Cambios de UI/CSS |
| `refactor:` | Refactorización |
| `test:` | Tests |
| `chore:` | Tareas de mantenimiento |
