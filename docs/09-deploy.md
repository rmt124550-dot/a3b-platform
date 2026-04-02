# 09 — Deploy en Producción

## Infraestructura

| Componente | Proveedor | Detalle |
|-----------|----------|---------|
| VPS | Oracle / Dokploy | 163.176.155.185 |
| Deploy platform | Dokploy | http://163.176.155.185:3000 |
| DNS / CDN | Cloudflare | a3bhub.cloud |
| Repositorio | GitHub | rmt124550-dot/a3b-platform |
| CI/CD | GitHub Actions | Push a `main` → deploy automático |

---

## Paso 1 — DNS en Cloudflare

Agregar registros A en Cloudflare → DNS:

| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| A | @ | 163.176.155.185 | ✅ On |
| A | www | 163.176.155.185 | ✅ On |
| A | api | 163.176.155.185 | ✅ On |

---

## Paso 2 — Crear proyecto en Dokploy

1. Abrir http://163.176.155.185:3000
2. **Projects → New Project → "a3b-platform"**
3. **Add Service → Docker Compose**
4. Conectar con GitHub → seleccionar `rmt124550-dot/a3b-platform`
5. Branch: `main`
6. Compose file: `docker-compose.yml`

---

## Paso 3 — Variables de entorno

En Dokploy → proyecto → **Environment**, agregar todas las variables de `.env.example` con valores reales:

```
POSTGRES_USER=a3b_user
POSTGRES_PASSWORD=[password seguro]
POSTGRES_DB=a3b_db
DATABASE_URL=postgresql://a3b_user:[password]@postgres:5432/a3b_db
REDIS_PASSWORD=[password]
REDIS_URL=redis://:[password]@redis:6379
JWT_SECRET=[64 chars random]
JWT_REFRESH_SECRET=[64 chars random]
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
DEEPL_API_KEY=...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@a3bhub.cloud
FRONTEND_URL=https://a3bhub.cloud
NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
ADMIN_EMAIL=admin@a3bhub.cloud
DOMAIN=a3bhub.cloud
```

Generar secrets seguros:
```bash
# JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Paso 4 — Configurar dominios en Dokploy

**Servicio frontend:**
- `a3bhub.cloud` → Puerto 3000 → Activar SSL (Let's Encrypt)
- `www.a3bhub.cloud` → Puerto 3000

**Servicio backend:**
- `api.a3bhub.cloud` → Puerto 4000 → Activar SSL

---

## Paso 5 — Deploy

Dokploy → **Deploy** → esperar ~3-5 minutos para build.

Verificar:
```bash
curl https://api.a3bhub.cloud/health
# → {"status":"ok","timestamp":"...","version":"1.0.0"}

curl -I https://a3bhub.cloud
# → HTTP/2 200
```

---

## Paso 6 — Migraciones post-deploy

```bash
# En el VPS o desde Dokploy → terminal del contenedor backend
npx prisma migrate deploy
```

---

## Paso 7 — Stripe Webhook

1. https://dashboard.stripe.com → Developers → Webhooks
2. **Add endpoint:** `https://api.a3bhub.cloud/api/billing/webhook`
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Copiar **Signing secret** → pegar en variable `STRIPE_WEBHOOK_SECRET` en Dokploy → redeploy

---

## Paso 8 — CI/CD con GitHub Actions

En GitHub → Settings → Secrets → Actions, agregar:

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | `163.176.155.185` |
| `VPS_USER` | `ubuntu` |
| `VPS_SSH_KEY` | Clave SSH privada del VPS |
| `DOMAIN` | `a3bhub.cloud` |

A partir de este punto, cada `git push origin main` desplegará automáticamente en el VPS.

---

## Comandos útiles en producción

```bash
# Logs en tiempo real
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx

# Estado de todos los servicios
docker compose ps

# Reiniciar servicio
docker compose restart backend

# Migraciones manuales
docker compose exec backend npx prisma migrate deploy

# Acceder a PostgreSQL
docker compose exec postgres psql -U a3b_user -d a3b_db

# Backup de la base de datos
docker compose exec postgres pg_dump -U a3b_user a3b_db > backup_$(date +%Y%m%d).sql

# Limpiar imágenes antiguas tras deploy
docker image prune -f
```
