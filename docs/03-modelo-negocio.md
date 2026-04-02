# 03 — Modelo de Negocio

## Planes

| | Free | Pro | Team |
|--|------|-----|------|
| **Precio** | $0 | $4.99/mes | $19.99/mes |
| **Motor de traducción** | Google Translate | DeepL (calidad superior) | DeepL |
| **Idioma destino** | Solo ES | 10 idiomas | 10 idiomas |
| **Plataformas** | Coursera | Coursera + YouTube + Udemy + edX + LinkedIn | Todas |
| **Historial** | ✗ | 30 días | Ilimitado |
| **Diccionario personal** | ✗ | ✓ | ✓ |
| **Exportar .SRT** | ✗ | ✗ | ✓ |
| **API access** | ✗ | ✗ | ✓ |
| **Admin dashboard** | ✗ | ✗ | ✓ |
| **Soporte** | Comunidad | Email | Prioritario |
| **Prueba gratis** | — | 7 días | 7 días |

## Flujo de conversión

```
Descarga extensión (Free)
        │
        │  Usa Google Translate → calidad básica
        │  Sin historial, solo EN→ES
        │
        ▼
Ve el botón "Actualizar a PRO" en el popup
        │
        ▼
Visita a3bhub.cloud/pricing
        │
        ▼
Clic en "Empezar prueba gratis"
        │
        ▼
Registro en a3bhub.cloud/register
        │
        ▼
Stripe Checkout (hosted, con tarjeta)
        │
        ├── trial_period_days: 7
        │   (no se cobra durante 7 días)
        │
        ▼
Webhook checkout.session.completed
        │
        ├── user.plan = 'pro'
        ├── Email de bienvenida PRO
        │
        ▼
Extensión desbloquea:
        ├── DeepL como motor
        ├── 10 idiomas destino
        ├── Historial automático
        └── Diccionario personal
```

## Gestión de suscripción (Stripe)

Los usuarios pueden gestionar su suscripción desde:
- `a3bhub.cloud/dashboard/billing` → botón "Gestionar suscripción"
- Popup de la extensión → tab "Cuenta"

Ambos abren el **Stripe Customer Portal** — una página hosteada por Stripe donde el usuario puede cambiar tarjeta, ver facturas, cancelar o cambiar de plan sin ningún desarrollo adicional.

## Webhooks Stripe

| Evento | Acción en el backend |
|--------|---------------------|
| `checkout.session.completed` | Activar plan, enviar email bienvenida |
| `invoice.payment_succeeded` | Guardar pago en tabla payments |
| `invoice.payment_failed` | subscription.status = past_due, email alerta |
| `customer.subscription.deleted` | user.plan = free, subscription canceled |

## Métricas de negocio (Admin)

El panel `/admin` muestra en tiempo real:

| Métrica | Cómo se calcula |
|---------|----------------|
| **MRR** | (usuarios PRO × $4.99) + (usuarios Team × $19.99) |
| **Ingresos totales** | SUM de payments.amount WHERE status = succeeded |
| **Usuarios** | COUNT por plan (free / pro / team) |
| **Traducciones hoy** | COUNT usage_logs WHERE action = translate AND date = today |

## Precios de terceros (costos)

| Servicio | Plan | Costo |
|---------|------|-------|
| Stripe | — | 2.9% + $0.30 por transacción exitosa |
| DeepL API Free | 500K chars/mes | $0 |
| DeepL API Pro | Pay-per-use | ~$25 por 1M caracteres |
| Resend | Free | 3,000 emails/mes gratis |
| VPS Dokploy | — | Costo fijo mensual del VPS |

## Margen estimado con 100 usuarios PRO

```
Ingresos:   100 × $4.99 = $499/mes
Stripe fee: 100 × ($0.30 + $4.99×2.9%) = ~$44.50
DeepL:      ~$10 (estimado 400K chars/mes)
Resend:     $0 (dentro del free tier)
Neto est:   ~$444/mes
```
