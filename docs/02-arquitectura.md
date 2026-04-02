# 02 — Arquitectura

## Diagrama general

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO FINAL                            │
│                                                                 │
│   Extensión de navegador (Chrome / Edge / Firefox / Kiwi)      │
│   └── popup.html + popup.js   → UI con login, controles        │
│   └── content.js              → Detecta subtítulos + TTS       │
│   └── background.js           → JWT refresh + relay msgs       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE CDN                             │
│   a3bhub.cloud → Frontend    |   api.a3bhub.cloud → Backend    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOKPLOY VPS                                │
│                  (163.176.155.185)                              │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────────────────────┐   │
│  │   NGINX         │    │        FRONTEND                  │   │
│  │   :80 / :443    │───▶│        Next.js 14                │   │
│  │   Reverse proxy │    │        Puerto 3000               │   │
│  │   SSL / Rate    │    │                                  │   │
│  │   limiting      │    │  / → Landing + Pricing           │   │
│  └────────┬────────┘    │  /login, /register               │   │
│           │             │  /dashboard/* → Panel usuario    │   │
│           │             │  /admin → Panel A3B              │   │
│           │             └──────────────────────────────────┘   │
│           │                                                     │
│           │             ┌──────────────────────────────────┐   │
│           └────────────▶│        BACKEND API               │   │
│                         │        Express + TypeScript      │   │
│                         │        Puerto 4000               │   │
│                         │                                  │   │
│                         │  /api/auth/*    → JWT auth       │   │
│                         │  /api/translate → DeepL/Google   │   │
│                         │  /api/history   → Historial      │   │
│                         │  /api/dictionary→ Diccionario    │   │
│                         │  /api/billing/* → Stripe         │   │
│                         │  /api/user/*    → Perfil         │   │
│                         │  /api/admin/*   → Admin          │   │
│                         └───────────┬──────────────────────┘   │
│                                     │                           │
│           ┌─────────────────────────┼──────────────────┐       │
│           │                         │                  │       │
│           ▼                         ▼                  ▼       │
│  ┌────────────────┐   ┌─────────────────────┐  ┌───────────┐  │
│  │  PostgreSQL 16 │   │      Redis 7        │  │  Stripe   │  │
│  │  Puerto 5432   │   │      Puerto 6379    │  │  Webhook  │  │
│  │                │   │                     │  │  (externo)│  │
│  │  users         │   │  Cache traducciones │  └───────────┘  │
│  │  subscriptions │   │  JWT refresh tokens │                  │
│  │  payments      │   │  Rate limiting      │                  │
│  │  history       │   └─────────────────────┘                  │
│  │  dictionary    │                                            │
│  │  settings      │                                            │
│  └────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de datos — Traducción en tiempo real

```
Video en Coursera/YouTube/Udemy
        │
        │  Subtítulo aparece en el DOM
        ▼
MutationObserver (content.js)
        │
        │  Debounce 180ms
        ▼
¿Usuario autenticado y plan PRO/Team?
        │
   SÍ ──┤──────────────────────────────────────────┐
        │                                          │
        ▼                                          ▼
¿En cache Redis?                    POST /api/translate
        │                           (con JWT en header)
   SÍ ──┤── Respuesta inmediata              │
        │                                   ▼
        NO                         ¿Motor en settings?
        │                                   │
        ▼                          DeepL (PRO) o Google
  Google Translate                          │
  API pública (fallback)                   │
        │                                   │
        └───────────────────────────────────┘
                        │
                        ▼
              Texto traducido
                        │
                        ├── SpeechSynthesisUtterance → TTS voz
                        │   (velocidad, tono, volumen, voz)
                        │
                        ├── Overlay en pantalla (opcional)
                        │   (texto original + traducción)
                        │
                        └── POST /api/history (si PRO/Team)
                            Guarda en PostgreSQL async
```

## Flujo de datos — Autenticación

```
Usuario abre popup de extensión
        │
        ▼
¿Token en chrome.storage.local?
        │
   SÍ ──┤── Válido → usar directamente
        │
        NO / Expirado
        │
        ▼
background.js → POST /api/auth/refresh
        │
        ├── OK → nuevo accessToken en storage
        │
        └── Error → limpiar storage → mostrar login
```

## Flujo de datos — Pagos (Stripe)

```
Usuario elige plan PRO/Team
        │
        ▼
POST /api/billing/checkout
        │
        ▼
Stripe Checkout Session creada
        │
        ▼
Redirect a Stripe (hosted page)
        │
        ▼
Usuario paga con tarjeta
        │
        ▼
Stripe → Webhook → POST /api/billing/webhook
        │
        ├── checkout.session.completed
        │   → Actualizar subscription en DB
        │   → Cambiar user.plan a 'pro' o 'team'
        │   → Email de bienvenida PRO (Resend)
        │
        ├── invoice.payment_succeeded
        │   → Guardar pago en tabla payments
        │
        ├── invoice.payment_failed
        │   → subscription.status = 'past_due'
        │   → Email de pago fallido
        │
        └── customer.subscription.deleted
            → user.plan = 'free'
            → subscription.status = 'canceled'
```

## Estructura de archivos

```
a3b-platform/
│
├── docker-compose.yml          # Orquestación: frontend + backend + postgres + redis + nginx
├── .env.example                # Variables de entorno (template)
├── README.md                   # Índice de documentación
├── DEPLOY.md                   # Guía de deploy paso a paso
│
├── docs/                       # Documentación completa
│   ├── 01-vision-general.md
│   ├── 02-arquitectura.md
│   ├── 03-modelo-negocio.md
│   ├── 04-frontend.md
│   ├── 05-backend-api.md
│   ├── 06-extension.md
│   ├── 07-base-de-datos.md
│   ├── 08-instalacion.md
│   ├── 09-deploy.md
│   └── 10-roadmap.md
│
├── backend/                    # API Express + TypeScript
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma       # ORM schema completo
│   └── src/
│       ├── server.ts           # Entry point + middlewares globales
│       ├── routes/
│       │   ├── auth.ts         # Register, login, refresh, logout, /me
│       │   ├── user.ts         # Perfil, settings, password, forgot/reset
│       │   ├── translate.ts    # Proxy Google/DeepL con cache Redis
│       │   ├── history.ts      # CRUD historial + export SRT
│       │   ├── dictionary.ts   # CRUD diccionario + lookup
│       │   ├── billing.ts      # Stripe checkout + portal + status
│       │   ├── webhook.ts      # Stripe webhook handler
│       │   └── admin.ts        # Métricas + gestión usuarios
│       ├── middleware/
│       │   ├── authenticate.ts # JWT guard + requireAdmin + requirePlan
│       │   ├── validate.ts     # Validación Zod
│       │   ├── errorHandler.ts # Handler global de errores
│       │   └── notFound.ts     # 404
│       ├── services/
│       │   └── email.ts        # Resend: bienvenida, upgrade, reset, pago fallido
│       └── utils/
│           ├── prisma.ts       # Singleton PrismaClient
│           └── redis.ts        # Singleton Redis (ioredis)
│
├── frontend/                   # Next.js 14 App Router
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── app/
│       │   ├── layout.tsx          # Root layout: fuentes, Toaster
│       │   ├── globals.css         # Design system: tokens, componentes, animaciones
│       │   ├── page.tsx            # Landing page
│       │   ├── login/page.tsx      # Login
│       │   ├── register/page.tsx   # Registro + selección de plan
│       │   ├── pricing/page.tsx    # Comparativa de planes + Stripe
│       │   ├── dashboard/
│       │   │   ├── layout.tsx      # Sidebar con navegación
│       │   │   ├── page.tsx        # Overview con stats
│       │   │   ├── history/        # Historial de traducciones
│       │   │   ├── dictionary/     # Diccionario personal
│       │   │   ├── settings/       # Configuración de voz
│       │   │   └── billing/        # Suscripción y facturas
│       │   └── admin/page.tsx      # Panel admin: MRR + usuarios
│       └── lib/
│           ├── api.ts              # Axios + auto-refresh JWT
│           └── auth-store.ts       # Zustand + persist
│
├── extension/                  # Extensión v3.0 MV3
│   ├── manifest.json           # MV3: permisos, host_permissions
│   ├── compat.js               # Polyfill chrome.* ↔ browser.*
│   ├── background.js           # Service Worker: JWT refresh, relay
│   ├── content.js              # Motor: detección + traducción + TTS + historial
│   ├── popup.html              # UI: login, controles, ajustes, cuenta
│   ├── popup.js                # Lógica del popup
│   └── icons/                  # icon16, icon48, icon128
│
├── nginx/
│   └── nginx.conf              # Reverse proxy + SSL + rate limiting
│
├── scripts/
│   ├── init.sql                # Schema PostgreSQL inicial
│   ├── deploy.sh               # Deploy básico
│   └── setup-vps.sh            # Setup completo primer deploy
│
└── .github/
    └── workflows/
        └── deploy.yml          # CI/CD: push a main → deploy automático
```

## Servicios Docker

| Servicio | Imagen | Puerto | Función |
|---------|--------|--------|---------|
| frontend | custom (Next.js) | 3000 | App web |
| backend | custom (Express) | 4000 | API REST |
| postgres | postgres:16-alpine | 5432 | Base de datos |
| redis | redis:7-alpine | 6379 | Cache + sesiones |
| nginx | nginx:alpine | 80, 443 | Proxy + SSL |
