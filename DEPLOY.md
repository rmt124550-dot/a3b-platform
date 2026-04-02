# 🚀 Guía de Deploy — A3B Platform en Dokploy

## Prerequisitos
- VPS con Dokploy instalado (http://163.176.155.185:3000)
- Dominio `a3bhub.cloud` apuntando al VPS en Cloudflare
- Repo en GitHub con el código

---

## Paso 1 — Configurar DNS en Cloudflare

En Cloudflare → DNS → Agregar registros:

| Tipo | Nombre | Valor             | Proxy |
|------|--------|-------------------|-------|
| A    | @      | 163.176.155.185   | ✅ On  |
| A    | api    | 163.176.155.185   | ✅ On  |
| A    | www    | 163.176.155.185   | ✅ On  |

---

## Paso 2 — Subir código a GitHub

```bash
cd a3b-platform
git init
git add .
git commit -m "feat: initial platform setup"
git remote add origin https://github.com/TU_USUARIO/a3b-platform.git
git push -u origin main
```

---

## Paso 3 — Crear proyecto en Dokploy

1. Abre http://163.176.155.185:3000
2. **Projects → New Project → "a3b-platform"**
3. **Add Service → Docker Compose**
4. Conecta con tu repositorio GitHub
5. Apunta al archivo `docker-compose.yml` en la raíz

---

## Paso 4 — Variables de entorno en Dokploy

En el proyecto → **Environment** → agrega cada variable:

```
POSTGRES_USER=a3b_user
POSTGRES_PASSWORD=TU_PASSWORD_SEGURO
POSTGRES_DB=a3b_db
DATABASE_URL=postgresql://a3b_user:TU_PASSWORD@postgres:5432/a3b_db

REDIS_PASSWORD=TU_REDIS_PASSWORD
REDIS_URL=redis://:TU_REDIS_PASSWORD@redis:6379

JWT_SECRET=TU_JWT_SECRET_64_CHARS
JWT_REFRESH_SECRET=TU_REFRESH_SECRET_64_CHARS

STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...

DEEPL_API_KEY=tu_deepl_key
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@a3bhub.cloud

FRONTEND_URL=https://a3bhub.cloud
NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
ADMIN_EMAIL=admin@a3bhub.cloud
DOMAIN=a3bhub.cloud
```

---

## Paso 5 — Configurar dominios en Dokploy

En el servicio **frontend**:
- Domain: `a3bhub.cloud` → Port `3000`
- Domain: `www.a3bhub.cloud` → Port `3000`
- Activar **SSL automático (Let's Encrypt)**

En el servicio **backend**:
- Domain: `api.a3bhub.cloud` → Port `4000`
- Activar **SSL automático (Let's Encrypt)**

---

## Paso 6 — Deploy

1. En Dokploy → **Deploy** → ✅
2. Espera ~3 minutos para el build
3. Verifica en: https://api.a3bhub.cloud/health

Respuesta esperada:
```json
{"status":"ok","timestamp":"...","version":"1.0.0"}
```

---

## Paso 7 — Configurar Stripe Webhook

1. Ve a https://dashboard.stripe.com/webhooks
2. **Add endpoint**: `https://api.a3bhub.cloud/api/billing/webhook`
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Copia el **Signing secret** → pégalo en `STRIPE_WEBHOOK_SECRET`

---

## Paso 8 — CI/CD con GitHub Actions

1. En GitHub → Settings → Secrets → Actions:
   - `VPS_HOST`: `163.176.155.185`
   - `VPS_USER`: `ubuntu`
   - `VPS_SSH_KEY`: tu clave SSH privada
   - `DOMAIN`: `a3bhub.cloud`

2. Cada push a `main` desplegará automáticamente ✅

---

## Verificación final

```bash
# API health
curl https://api.a3bhub.cloud/health

# Frontend
curl -I https://a3bhub.cloud

# Logs en tiempo real
docker compose logs -f backend
```

---

## Comandos útiles en el VPS

```bash
cd /opt/a3b-platform

# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Reiniciar un servicio
docker compose restart backend

# Ejecutar migraciones manualmente
docker compose exec backend npx prisma migrate deploy

# Acceder a la DB
docker compose exec postgres psql -U a3b_user -d a3b_db

# Acceder a Redis
docker compose exec redis redis-cli -a TU_REDIS_PASSWORD
```
