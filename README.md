# 🔊 A3B Platform

**Plataforma completa de A3B Cloud** — Extensión de navegador con backend SaaS, pagos, historial y panel de administración.

[![Deploy](https://img.shields.io/badge/deploy-Dokploy-6366f1?style=flat-square)](https://a3bhub.cloud)
[![Version](https://img.shields.io/badge/version-3.0.0-6366f1?style=flat-square)](https://github.com/rmt124550-dot/a3b-platform/releases)
[![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)](./LICENSE)

---

## ¿Qué es A3B Platform?

A3B Platform es el ecosistema completo detrás de **A3B Coursera Voice Narrator** — una extensión de navegador que detecta subtítulos en inglés de plataformas de e-learning, los traduce y los narra en voz alta en tiempo real.

La plataforma incluye extensión de navegador (Chrome, Edge, Firefox, Kiwi, Android), backend API con autenticación y pagos, frontend web con dashboard de usuario y panel admin, y un modelo de negocio con planes Free / PRO / Team.

---

## Documentación

| Doc | Descripción |
|-----|-------------|
| [01 — Visión general](./docs/01-vision-general.md) | Qué es, objetivos, stack, compatibilidad |
| [02 — Arquitectura](./docs/02-arquitectura.md) | Servicios, flujo de datos, estructura de archivos |
| [03 — Modelo de negocio](./docs/03-modelo-negocio.md) | Planes, precios, Stripe, flujo de pagos |
| [04 — Frontend](./docs/04-frontend.md) | Páginas, diseño, componentes, auth |
| [05 — Backend API](./docs/05-backend-api.md) | Endpoints, autenticación, guards de plan |
| [06 — Extensión](./docs/06-extension.md) | content.js, popup, background, plataformas |
| [07 — Base de datos](./docs/07-base-de-datos.md) | Schema PostgreSQL, modelos Prisma |
| [08 — Instalación](./docs/08-instalacion.md) | Setup local, Docker, variables de entorno |
| [09 — Deploy](./docs/09-deploy.md) | Dokploy, Cloudflare, SSL, CI/CD |
| [10 — Roadmap](./docs/10-roadmap.md) | Versiones, próximas features, contribuir |

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Extensión | Manifest V3 · Web Speech API · MutationObserver |
| Frontend | Next.js 14 · Tailwind CSS · Zustand · App Router |
| Backend | Node.js · Express · TypeScript · Prisma ORM |
| Base de datos | PostgreSQL 16 |
| Cache | Redis 7 |
| Pagos | Stripe (Checkout · Webhooks · Portal) |
| Email | Resend |
| Traducción | Google Translate (Free) · DeepL API (PRO/Team) |
| Proxy | Nginx |
| Deploy | Docker Compose · Dokploy · GitHub Actions |
| DNS / CDN | Cloudflare |

---

## Inicio rápido

```bash
git clone https://github.com/rmt124550-dot/a3b-platform.git
cd a3b-platform
cp .env.example .env
docker compose up -d
docker compose exec backend npx prisma migrate deploy
```

Frontend → http://localhost:3000  
API → http://localhost:4000/health

---

MIT © 2025 A3B Cloud
