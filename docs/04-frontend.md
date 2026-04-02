# 04 — Frontend

## Stack
- **Next.js 14** con App Router y SSR
- **Tailwind CSS** con design tokens custom
- **Zustand** para estado global de autenticación
- **Axios** con interceptor para auto-refresh JWT
- **react-hot-toast** para notificaciones

## Diseño

**Dirección estética:** Dark luxury minimal — negro profundo (#0d0d14), acentos índigo (#6366f1), tipografía DM Serif Display + DM Mono.

**Sistema de diseño (globals.css):**

| Token | Valor | Uso |
|-------|-------|-----|
| `--surface` | #0d0d14 | Fondo base |
| `--surface-1` | #13131f | Cards, sidebar |
| `--surface-2` | #191926 | Inputs, selects |
| `--indigo` | #6366f1 | Acento principal, CTAs |
| `--emerald` | #34d399 | Success, checkmarks |
| `--rose` | #f87171 | Errores, alertas |
| `--border` | rgba(255,255,255,0.07) | Bordes sutiles |

**Componentes base (CSS classes):**
- `.card` — contenedor con borde sutil y hover
- `.btn-primary` — botón índigo con hover y disabled
- `.btn-ghost` — botón outline transparente
- `.input` — campo de texto dark
- `.badge` — etiqueta de estado (indigo, emerald, rose, amber)
- `.animate-fadeup` — animación de entrada estándar

## Páginas

### Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `app/page.tsx` | Landing: hero, how it works, pricing preview, footer |
| `/login` | `app/login/page.tsx` | Formulario email + password, link a register |
| `/register` | `app/register/page.tsx` | Selector de plan + formulario + redirect Stripe si pago |
| `/pricing` | `app/pricing/page.tsx` | Comparativa 3 planes + FAQ + Stripe checkout |

### Dashboard (autenticadas)

Layout compartido (`dashboard/layout.tsx`): sidebar con navegación, plan badge, logout.

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/dashboard` | `dashboard/page.tsx` | Overview: stats, acceso rápido, estado extensión |
| `/dashboard/history` | `dashboard/history/page.tsx` | Historial con búsqueda, filtros plataforma, paginación, export SRT |
| `/dashboard/dictionary` | `dashboard/dictionary/page.tsx` | CRUD diccionario con form inline |
| `/dashboard/settings` | `dashboard/settings/page.tsx` | Sliders de voz, selector idioma, toggle overlay |
| `/dashboard/billing` | `dashboard/billing/page.tsx` | Suscripción activa, facturas, portal Stripe |

### Admin (rol = admin)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin` | `admin/page.tsx` | Métricas MRR + tabla usuarios con cambio de plan y suspensión |

## Autenticación (lib/auth-store.ts)

Estado global con Zustand + persist en localStorage:

```typescript
interface AuthState {
  user: User | null          // datos del usuario
  accessToken: string | null  // JWT de corta duración (15min)
  refreshToken: string | null // JWT de larga duración (7d) — persiste
  setAuth(user, accessToken, refreshToken): void
  logout(): void
  isAuthenticated(): boolean
}
```

El `accessToken` **no se persiste** — se renueva automáticamente al cargar la app usando el `refreshToken` guardado.

## Cliente HTTP (lib/api.ts)

Axios configurado con:
- `baseURL` desde `NEXT_PUBLIC_API_URL`
- Interceptor de request: agrega `Authorization: Bearer {token}`
- Interceptor de response: en 401, intenta refresh automático. Si falla, logout + redirect a `/login`

```typescript
// Uso en cualquier página
import { api } from '@/lib/api'

const { data } = await api.get('/api/user/profile')
const { data } = await api.post('/api/billing/checkout', { plan: 'pro' })
```

## Guards de acceso

Los planes se guardan en el store de Zustand. Cada página verifica el plan del usuario y muestra una pantalla de "upgrade" si no tiene acceso:

```typescript
if (user?.plan === 'free') {
  return <UpgradeGate feature="Historial" />
}
```

## Variables de entorno (frontend)

```bash
NEXT_PUBLIC_API_URL=https://api.a3bhub.cloud
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```
