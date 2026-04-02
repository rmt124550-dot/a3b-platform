# 05 — Backend API

## Base URL
```
https://api.a3bhub.cloud
```

## Autenticación

Todos los endpoints protegidos requieren:
```
Authorization: Bearer {accessToken}
```

Los tokens expiran en 15 minutos. Usar `/api/auth/refresh` con el `refreshToken` para renovar.

## Guards de plan

El middleware `requirePlan(['pro', 'team'])` retorna `403` con este body si el plan no es suficiente:

```json
{
  "error": "This feature requires pro or team plan",
  "upgrade": true
}
```

---

## Endpoints

### Auth — `/api/auth`

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/register` | No | `{ name, email, password }` | Crea cuenta, retorna tokens |
| POST | `/login` | No | `{ email, password }` | Login, retorna tokens |
| POST | `/refresh` | No | `{ refreshToken }` | Renueva accessToken |
| POST | `/logout` | Sí | `{ refreshToken }` | Invalida refresh token en Redis |
| GET | `/me` | Sí | — | Retorna usuario + settings |

---

### Usuario — `/api/user`

| Método | Ruta | Auth | Plan | Descripción |
|--------|------|------|------|-------------|
| GET | `/profile` | Sí | Any | Perfil + counts de history y dictionary |
| PATCH | `/profile` | Sí | Any | Actualizar name, avatarUrl |
| PATCH | `/password` | Sí | Any | Cambiar contraseña |
| GET | `/settings` | Sí | Any | Obtener configuración de voz |
| PATCH | `/settings` | Sí | Any | Actualizar configuración de voz |
| DELETE | `/account` | Sí | Any | Soft delete (deletedAt) |
| POST | `/forgot-password` | No | — | Enviar email con token de reset |
| POST | `/reset-password` | No | — | Restablecer contraseña con token |

---

### Traducción — `/api/translate`

| Método | Ruta | Auth | Plan | Descripción |
|--------|------|------|------|-------------|
| POST | `/` | Sí | Any | Traduce texto. PRO/Team usa DeepL, Free usa Google. Cache en Redis 1h |

**Body:**
```json
{ "text": "Hello world", "source": "en", "target": "es" }
```

**Response:**
```json
{ "translated": "Hola mundo", "cached": false, "engine": "deepl" }
```

---

### Historial — `/api/history`

| Método | Ruta | Auth | Plan | Descripción |
|--------|------|------|------|-------------|
| GET | `/` | Sí | PRO+ | Listar con filtros (q, platform, page) |
| POST | `/` | Sí | PRO+ | Guardar traducción |
| DELETE | `/:id` | Sí | PRO+ | Eliminar entrada |
| DELETE | `/` | Sí | PRO+ | Limpiar todo el historial |
| GET | `/export/srt` | Sí | Team | Exportar historial como archivo .srt |

**Filtros GET:**
```
?q=machine+learning&platform=coursera&page=1&limit=50
```

**Nota:** Pro limita automáticamente a los últimos 30 días. Team sin límite.

---

### Diccionario — `/api/dictionary`

| Método | Ruta | Auth | Plan | Descripción |
|--------|------|------|------|-------------|
| GET | `/` | Sí | PRO+ | Listar términos (con búsqueda) |
| POST | `/` | Sí | PRO+ | Agregar término (upsert si existe) |
| PATCH | `/:id` | Sí | PRO+ | Actualizar término |
| DELETE | `/:id` | Sí | PRO+ | Eliminar término |
| GET | `/lookup?term=` | Sí | PRO+ | Buscar término exacto (usado por la extensión) |

**Body POST/PATCH:**
```json
{ "term": "machine learning", "translation": "aprendizaje automático", "notes": "Opcional" }
```

---

### Facturación — `/api/billing`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/checkout` | Sí | Crea sesión Stripe Checkout, retorna `{ url }` |
| POST | `/portal` | Sí | Abre Stripe Customer Portal, retorna `{ url }` |
| GET | `/status` | Sí | Retorna suscripción activa + últimos 10 pagos |
| POST | `/webhook` | No* | Handler de webhooks Stripe (body raw) |

*El webhook usa `stripe-signature` header para verificación, no JWT.

**Body checkout:**
```json
{ "plan": "pro" }
```

---

### Admin — `/api/admin` *(rol admin)*

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/metrics` | MRR, ingresos, distribución de planes, traducciones hoy, últimos registros |
| GET | `/users` | Listar usuarios con filtros (plan, search, page) |
| PATCH | `/users/:id` | Cambiar plan o rol |
| DELETE | `/users/:id` | Suspender usuario (soft delete) |

---

## Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Bad request / validación fallida |
| 401 | No autenticado / token inválido |
| 403 | Plan insuficiente / rol insuficiente |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: email ya registrado) |
| 422 | Validación Zod fallida (con `details`) |
| 429 | Rate limit excedido |
| 500 | Error interno |

## Rate Limiting

| Zona | Límite | Aplica a |
|------|--------|---------|
| Global API | 100 req / 15 min por IP | Todos los endpoints |
| Auth | 5 req / min por IP | `/api/auth/login`, `/register` |
| Traducción Free | 30 req / min por user | `/api/translate` con plan free |
