# 01 — Visión General

## Nombre del proyecto
`a3b-platform` — A3B Cloud Platform

## Descripción
A3B Platform es una plataforma SaaS completa que permite a hispanohablantes estudiar en plataformas de e-learning en inglés (Coursera, YouTube, Udemy, edX, LinkedIn Learning) escuchando el contenido traducido y narrado en voz alta en su idioma, en tiempo real.

El producto se distribuye como **extensión de navegador** conectada a un **backend propio** con autenticación, historial, diccionario personal y traducción de alta calidad (DeepL) disponible para usuarios de pago.

## Objetivo principal
Eliminar la barrera del idioma en el aprendizaje online para hispanohablantes, sin depender de subtítulos manuales ni traducciones externas. La versión gratuita funciona sin cuenta; los planes de pago desbloquean calidad superior y funciones de productividad.

## Versiones

| Versión | Descripción |
|---------|-------------|
| v1.0.0 | Extensión standalone — Google TTS, EN→ES, Coursera |
| v2.0.0 | Soporte Firefox Android, Bookmarklet, UI rediseñada |
| **v3.0.0** | **Plataforma completa — Backend, auth, Stripe, DeepL, historial** |

## Stack tecnológico completo

### Extensión (client-side)
| Tecnología | Uso |
|-----------|-----|
| Manifest V3 | Estándar moderno Chrome, Edge, Firefox |
| Web Speech API | Síntesis de voz nativa del navegador |
| MutationObserver | Detección de subtítulos en tiempo real |
| chrome.storage.local | Persistencia local de configuración y tokens |
| Fetch API | Comunicación con el backend A3B |

### Backend
| Tecnología | Uso |
|-----------|-----|
| Node.js 20 + Express | Servidor HTTP |
| TypeScript | Tipado estático |
| Prisma ORM | Acceso a base de datos |
| PostgreSQL 16 | Base de datos principal |
| Redis 7 | Cache de traducciones + sesiones JWT |
| Stripe SDK | Pagos y suscripciones |
| Resend | Emails transaccionales |
| JWT (jsonwebtoken) | Autenticación stateless |
| Zod | Validación de schemas |

### Frontend
| Tecnología | Uso |
|-----------|-----|
| Next.js 14 (App Router) | Framework React SSR/SSG |
| Tailwind CSS | Estilos utilitarios |
| Zustand | Estado global (auth) |
| Axios + SWR | HTTP client + data fetching |
| DM Serif Display + DM Mono | Tipografía distintiva |

### Infraestructura
| Tecnología | Uso |
|-----------|-----|
| Docker + Docker Compose | Contenedorización de todos los servicios |
| Nginx | Reverse proxy + SSL termination |
| Dokploy | Plataforma de deploy en VPS |
| GitHub Actions | CI/CD automático |
| Cloudflare | DNS, CDN, protección |

## Compatibilidad de la extensión

| Navegador | Plataforma | Método | Plan requerido |
|-----------|-----------|--------|---------------|
| Google Chrome | Desktop | Extensión | Free |
| Microsoft Edge | Desktop | Extensión | Free |
| Firefox | Desktop | Extensión | Free |
| Kiwi Browser | Android | Extensión (ZIP) | Free |
| Firefox Nightly | Android | Colección AMO | Free |
| Chrome Android | Android | Bookmarklet | Free |
| Samsung Browser | Android | Bookmarklet | Free |
| Opera Android | Android | Bookmarklet | Free |

## Plataformas de e-learning soportadas

| Plataforma | Estado |
|-----------|--------|
| Coursera | ✅ Completo |
| YouTube | ✅ Completo |
| Udemy | ✅ Completo |
| edX | ✅ Completo |
| LinkedIn Learning | ✅ Completo |

## URLs en producción

| Servicio | URL |
|---------|-----|
| Frontend | https://a3bhub.cloud |
| API | https://api.a3bhub.cloud |
| Health check | https://api.a3bhub.cloud/health |
| Dashboard | https://a3bhub.cloud/dashboard |
| Admin | https://a3bhub.cloud/admin |

## Estado del proyecto
- Versión actual: **3.0.0**
- Estado: ✅ Funcional — listo para deploy
- Licencia: MIT © 2025 A3B Cloud
