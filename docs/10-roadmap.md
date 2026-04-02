# 10 — Roadmap y Cómo Contribuir

## Versiones

### ✅ v1.0.0 (2025)
- Extensión standalone
- Google TTS + Google Translate
- Coursera únicamente
- Overlay en pantalla
- Controles básicos de voz

### ✅ v2.0.0 (2025)
- Soporte Firefox Android (gecko_android)
- Polyfill compat.js Chrome/Firefox
- Bookmarklet universal para Android
- Panel Android en popup
- UI rediseñada con 3 tabs
- Branding A3B Cloud

### ✅ v3.0.0 — Actual (2025)
- **Plataforma SaaS completa**
- Backend Express + TypeScript + PostgreSQL + Redis
- Autenticación JWT con refresh automático
- Planes Free / PRO / Team con Stripe
- DeepL para planes de pago
- Historial de traducciones (PRO+)
- Diccionario personal (PRO+)
- Exportar .SRT (Team)
- 5 plataformas: Coursera, YouTube, Udemy, edX, LinkedIn
- Frontend Next.js con dashboard completo
- Panel admin con métricas MRR
- Emails transaccionales (Resend)
- CI/CD con GitHub Actions
- Deploy en Dokploy + Cloudflare

---

## Roadmap

### v3.1.0 — Calidad y estabilidad
- [ ] Tests unitarios backend (Jest + Supertest)
- [ ] Tests E2E frontend (Playwright)
- [ ] Logging estructurado (Pino)
- [ ] Monitoreo de errores (Sentry)
- [ ] Rate limiting inteligente por usuario
- [ ] Página `/privacy` y `/terms` completas

### v3.2.0 — Extensión mejorada
- [ ] OAuth (Google) en el popup
- [ ] Modo offline con cache local extendido
- [ ] Sincronización de settings en tiempo real entre dispositivos
- [ ] Atajo de teclado para activar/desactivar narrador
- [ ] Selección de fragmento de texto para traducción puntual

### v4.0.0 — Publicación en stores
- [ ] Publicación en Chrome Web Store
- [ ] Publicación en Microsoft Edge Add-ons
- [ ] Publicación en Firefox Add-ons (AMO)
- [ ] Review de seguridad para stores
- [ ] Política de privacidad verificada por Google

### v4.1.0 — Features avanzadas
- [ ] Modo "solo subtítulos" sin narración
- [ ] Velocidad automática sincronizada con el video
- [ ] Selección de idioma origen (no solo EN)
- [ ] Flashcards de vocabulario desde el historial
- [ ] Integración con Anki (exportar al deck)

### v5.0.0 — Mobile app
- [ ] App nativa iOS/Android (React Native)
- [ ] Soporte para apps de e-learning en móvil
- [ ] Sincronización completa con la plataforma web

---

## Cómo contribuir

### Setup del entorno

```bash
git clone https://github.com/rmt124550-dot/a3b-platform.git
cd a3b-platform
cp .env.example .env
docker compose up -d
docker compose exec backend npx prisma migrate dev
```

### Flujo de trabajo

```bash
# Crear rama para tu feature o fix
git checkout -b feat/nombre-de-la-mejora
# o
git checkout -b fix/descripcion-del-bug

# Desarrollo...

git add .
git commit -m "feat: descripción clara del cambio"

git push origin feat/nombre-de-la-mejora
# Abrir Pull Request en GitHub
```

### Convención de commits

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Cambios de UI/CSS sin lógica |
| `refactor:` | Refactorización sin cambio de funcionalidad |
| `test:` | Agregar o corregir tests |
| `chore:` | Dependencias, configuración, scripts |

### Reportar bugs

Al abrir un issue incluir:
- Navegador y versión
- Sistema operativo o dispositivo Android
- Plan (Free / PRO / Team)
- Pasos exactos para reproducir el error
- Screenshot o video si es posible
- Versión de la extensión (visible en el popup → v3.0.0)

---

## Contacto y créditos

**Desarrollado por A3B Cloud**
- 🌐 Web: [a3bhub.cloud](https://a3bhub.cloud)
- 📦 Repositorio: [github.com/rmt124550-dot/a3b-platform](https://github.com/rmt124550-dot/a3b-platform)

**Tecnologías de terceros:**
- [Stripe](https://stripe.com) — Pagos
- [DeepL API](https://www.deepl.com/pro-api) — Traducción PRO
- [Google Translate API](https://translate.googleapis.com) — Traducción Free
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — TTS nativo
- [Resend](https://resend.com) — Email
- [Prisma](https://prisma.io) — ORM
- [Dokploy](https://dokploy.com) — Deploy

---

## Licencia

MIT © 2025 A3B Cloud — Libre para uso personal y comercial con atribución.
