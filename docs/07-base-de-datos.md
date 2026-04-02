# 07 — Base de Datos

## Motor: PostgreSQL 16

## Modelos (Prisma Schema)

### users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| email | VARCHAR UNIQUE | Email del usuario |
| password_hash | VARCHAR | Bcrypt hash (null si OAuth futuro) |
| name | VARCHAR | Nombre visible |
| avatar_url | TEXT | URL del avatar |
| email_verified | BOOLEAN | Estado de verificación |
| plan | ENUM (free/pro/team) | Plan actual |
| role | VARCHAR | 'user' o 'admin' |
| created_at | TIMESTAMPTZ | Fecha de registro |
| last_login_at | TIMESTAMPTZ | Último acceso |
| deleted_at | TIMESTAMPTZ | Soft delete |
| reset_token | VARCHAR | Token de reset de contraseña |
| reset_token_expires | TIMESTAMPTZ | Expiración del token de reset |

### subscriptions
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID FK | Referencia a users |
| stripe_customer_id | VARCHAR UNIQUE | ID de cliente en Stripe |
| stripe_subscription_id | VARCHAR UNIQUE | ID de suscripción en Stripe |
| stripe_price_id | VARCHAR | ID del precio en Stripe |
| plan | ENUM | Plan de la suscripción |
| status | ENUM (active/canceled/past_due/trialing) | Estado |
| current_period_start | TIMESTAMPTZ | Inicio del período |
| current_period_end | TIMESTAMPTZ | Fin del período / próximo cobro |
| cancel_at_period_end | BOOLEAN | Cancelación programada |
| trial_end | TIMESTAMPTZ | Fin de la prueba gratuita |

### payments
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID FK | Referencia a users |
| stripe_invoice_id | VARCHAR UNIQUE | ID de factura en Stripe |
| amount | INTEGER | Monto en centavos (499 = $4.99) |
| currency | VARCHAR | 'usd' |
| status | VARCHAR | succeeded / failed / pending |
| receipt_url | TEXT | URL de recibo de Stripe |

### translation_history
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID FK | Referencia a users |
| original_text | TEXT | Texto original en inglés |
| translated_text | TEXT | Texto traducido |
| source_lang | VARCHAR | 'en' |
| target_lang | VARCHAR | 'es', 'fr', etc. |
| platform | VARCHAR | coursera / youtube / udemy / edx / linkedin |
| course_url | TEXT | URL del video (opcional) |
| created_at | TIMESTAMPTZ | Fecha de la traducción |

### user_dictionary
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID FK | Referencia a users |
| term | VARCHAR | Término original |
| translation | VARCHAR | Traducción personalizada |
| notes | TEXT | Notas del usuario (opcional) |
| UNIQUE | (user_id, term) | No duplicar términos por usuario |

### user_settings
| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| id | UUID | — | PK |
| user_id | UUID UNIQUE FK | — | 1:1 con users |
| voice_speed | DECIMAL | 1.0 | Velocidad TTS |
| voice_volume | DECIMAL | 1.0 | Volumen TTS |
| voice_pitch | DECIMAL | 1.0 | Tono TTS |
| voice_name | VARCHAR | null | Nombre de voz del sistema |
| target_lang | VARCHAR | 'es' | Idioma destino |
| show_overlay | BOOLEAN | true | Mostrar overlay en pantalla |
| translator | VARCHAR | 'google' | Motor: google / deepl |

### usage_logs
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID FK | Referencia a users (nullable) |
| action | VARCHAR | translate / tts / export_srt |
| platform | VARCHAR | Plataforma de origen |
| meta | JSONB | Datos adicionales |
| created_at | TIMESTAMPTZ | Timestamp del evento |

### refresh_tokens
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID FK | Referencia a users |
| token | VARCHAR UNIQUE | JWT refresh token |
| expires_at | TIMESTAMPTZ | Expiración |

> **Nota:** Los refresh tokens también se gestionan en Redis para invalidación instantánea. PostgreSQL es el respaldo.

## Índices

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_history_user_id ON translation_history(user_id);
CREATE INDEX idx_history_created_at ON translation_history(created_at);
CREATE INDEX idx_usage_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_created_at ON usage_logs(created_at);
```

## Backups

Se recomienda configurar backups automáticos del volumen Docker de PostgreSQL:

```bash
# Backup manual
docker compose exec postgres pg_dump -U a3b_user a3b_db > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T postgres psql -U a3b_user a3b_db < backup_20250401.sql
```
