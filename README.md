# A3B Platform 🔊

Plataforma completa para **A3B Coursera Voice Narrator** — Backend API + Frontend + Pagos + Base de datos.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL 16 |
| Cache | Redis 7 |
| Pagos | Stripe (Checkout + Webhooks + Portal) |
| Email | Resend |
| Traducción | Google Translate (Free) / DeepL (PRO) |
| Proxy | Nginx |
| Deploy | Dokploy / Docker Compose |

## Estructura

```
a3b-platform/
├── docker-compose.yml        # Orquestación de servicios
├── .env.example              # Variables de entorno
├── backend/                  # API Express/TypeScript
│   ├── src/
│   │   ├── routes/           # auth, billing, translate, admin...
│   │   ├── middleware/       # authenticate, validate, errorHandler
│   │   ├── services/         # email
│   │   └── utils/            # prisma, redis
│   └── prisma/schema.prisma  # ORM schema
├── frontend/                 # Next.js App
│   └── src/app/              # Pages: /, /pricing, /dashboard, /admin
├── nginx/nginx.conf          # Reverse proxy + SSL
└── scripts/
    ├── init.sql              # Schema PostgreSQL
    └── deploy.sh             # Script de deploy
```

## Setup rápido

```bash
# 1. Clonar
git clone https://github.com/a3bcloud/a3b-platform.git
cd a3b-platform

# 2. Variables de entorno
cp .env.example .env
# → Editar .env con tus keys reales

# 3. Levantar servicios
docker compose up -d

# 4. Ejecutar migraciones
docker compose exec backend npm run db:migrate

# 5. Verificar
curl http://localhost:4000/health
```

## Servicios

| Servicio | Puerto | URL |
|---|---|---|
| Frontend | 3000 | https://a3bhub.cloud |
| Backend API | 4000 | https://api.a3bhub.cloud |
| PostgreSQL | 5432 | interno |
| Redis | 6379 | interno |

## API Endpoints

### Auth
- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/logout` — Logout
- `GET  /api/auth/me` — Usuario actual

### Traducción
- `POST /api/translate` — Traducir texto (Google/DeepL según plan)

### Historial
- `GET  /api/history` — Obtener historial
- `POST /api/history` — Guardar traducción

### Diccionario
- `GET    /api/dictionary` — Listar términos
- `POST   /api/dictionary` — Agregar término
- `DELETE /api/dictionary/:id` — Eliminar término

### Billing (Stripe)
- `POST /api/billing/checkout` — Crear sesión de pago
- `POST /api/billing/portal` — Portal de gestión
- `GET  /api/billing/status` — Estado de suscripción
- `POST /api/billing/webhook` — Webhook Stripe (raw)

### Admin
- `GET   /api/admin/metrics` — Métricas MRR, usuarios, actividad
- `GET   /api/admin/users` — Listar usuarios con filtros
- `PATCH /api/admin/users/:id` — Cambiar plan/rol
- `DELETE /api/admin/users/:id` — Suspender usuario

## Planes

| Plan | Precio | Features |
|---|---|---|
| Free | $0 | Google TTS, EN→ES, Coursera |
| Pro | $4.99/mes | DeepL, 10 idiomas, historial, diccionario |
| Team | $19.99/mes | Todo PRO + admin dashboard + API |

## Deploy en Dokploy

1. Conecta tu repositorio en Dokploy
2. Configura las variables de entorno desde `.env.example`
3. Dokploy detecta el `docker-compose.yml` automáticamente
4. Activa el dominio `a3bhub.cloud` en Cloudflare → Dokploy

## Licencia

MIT © 2025 A3B Cloud
