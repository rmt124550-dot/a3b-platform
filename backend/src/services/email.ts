import { Resend } from 'resend'
import { logger } from '../utils/logger'

const resend  = new Resend(process.env.RESEND_API_KEY)
const FROM    = 'A3B Narrator <noreply@a3bhub.cloud>'
const BASE    = process.env.FRONTEND_URL ?? 'https://app.a3bhub.cloud'

// ─── Layout base ──────────────────────────────────────────────────────────────
function base(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>A3B Narrator</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:-apple-system,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <!-- Logo -->
    <div style="margin-bottom:32px;">
      <span style="font-size:28px;">🔊</span>
      <span style="font-size:18px;font-weight:800;color:#fff;margin-left:8px;">A3B</span>
      <span style="font-size:18px;font-weight:800;color:#6366f1;">Narrator</span>
    </div>

    <!-- Contenido -->
    ${content}

    <!-- Footer -->
    <div style="border-top:1px solid rgba(255,255,255,0.07);margin-top:48px;padding-top:24px;">
      <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0 0 6px;">
        A3B Cloud — <a href="${BASE}/privacy" style="color:rgba(255,255,255,0.3);">Privacidad</a>
        · <a href="${BASE}/terms" style="color:rgba(255,255,255,0.3);">Términos</a>
      </p>
      <p style="color:rgba(255,255,255,0.15);font-size:11px;margin:0;">
        Coursera · edX · Udemy · Udacity · DataCamp · YouTube
      </p>
    </div>
  </div>
</body>
</html>`
}

// ─── Botón ────────────────────────────────────────────────────────────────────
function btn(href: string, label: string, color = '#6366f1') {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;margin:24px 0;">${label}</a>`
}

// ─── Card de feature ──────────────────────────────────────────────────────────
function features(items: string[]) {
  return `<ul style="color:rgba(255,255,255,0.5);font-size:14px;line-height:2;padding-left:20px;margin:0 0 24px;">
    ${items.map(i => `<li>${i}</li>`).join('')}
  </ul>`
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. BIENVENIDA
// ══════════════════════════════════════════════════════════════════════════════
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: '🔊 Bienvenido a A3B Narrator — tu estudio en tu idioma',
      html: base(`
        <h1 style="font-size:28px;font-weight:800;color:#fff;margin:0 0 8px;">
          ¡Hola, ${name}! 🎉
        </h1>
        <p style="color:rgba(255,255,255,0.55);font-size:16px;line-height:1.6;margin:0 0 24px;">
          Tu cuenta en <strong style="color:#fff;">A3B Narrator</strong> está lista.
          Instala la extensión y empieza a estudiar en tu idioma en cualquier plataforma.
        </p>

        ${btn(`${BASE}/docs`, 'Instalar extensión →')}

        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin:24px 0;">
          <p style="color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">Plataformas incluidas en tu plan Free</p>
          <div style="display:grid;gap:8px;">
            ${['📚 Coursera','🎓 edX / Open edX','🔥 Udemy','🚀 Udacity','📊 DataCamp'].map(p =>
              `<span style="color:rgba(255,255,255,0.6);font-size:14px;">✓ ${p}</span>`
            ).join('')}
          </div>
        </div>

        <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin:24px 0;">
          <p style="color:#a5b4fc;font-size:13px;font-weight:700;margin:0 0 8px;">Tu plan actual: <strong>Free</strong></p>
          ${features(['Google Translate · EN → 10 idiomas','Narración con Web Speech API','Todas las plataformas incluidas','Sin historial ni diccionario'])}
          <a href="${BASE}/pricing" style="color:#6366f1;font-size:14px;font-weight:600;text-decoration:none;">
            Actualizar a PRO por $4.99/mes →
          </a>
        </div>
      `),
    })
    logger.info({ event: 'EMAIL_SENT', type: 'welcome', to, id: result.data?.id })
    return result
  } catch (err: any) {
    logger.error({ event: 'EMAIL_FAILED', type: 'welcome', to, error: err.message })
    throw err
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. VERIFICACIÓN DE EMAIL
// ══════════════════════════════════════════════════════════════════════════════
export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${BASE}/verify-email?token=${token}`
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: '✉️ Verifica tu email — A3B Narrator',
      html: base(`
        <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 8px;">
          Verifica tu email
        </h1>
        <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.6;margin:0 0 24px;">
          Hola <strong style="color:#fff;">${name}</strong>, haz clic en el botón para confirmar
          tu dirección de correo. El enlace expira en <strong style="color:#fff;">24 horas</strong>.
        </p>
        ${btn(verifyUrl, 'Verificar email →')}
        <p style="color:rgba(255,255,255,0.3);font-size:13px;margin-top:16px;">
          O copia este enlace en tu navegador:<br>
          <span style="color:rgba(255,255,255,0.4);font-size:12px;word-break:break-all;">${verifyUrl}</span>
        </p>
        <p style="color:rgba(255,255,255,0.25);font-size:13px;">
          Si no creaste esta cuenta, ignora este correo.
        </p>
      `),
    })
    logger.info({ event: 'EMAIL_SENT', type: 'verify', to, id: result.data?.id })
    return result
  } catch (err: any) {
    logger.error({ event: 'EMAIL_FAILED', type: 'verify', to, error: err.message })
    throw err
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. RESET DE CONTRASEÑA
// ══════════════════════════════════════════════════════════════════════════════
export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${BASE}/reset-password?token=${token}`
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: '🔐 Restablecer contraseña — A3B Narrator',
      html: base(`
        <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 8px;">
          Restablecer contraseña
        </h1>
        <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.6;margin:0 0 8px;">
          Recibimos una solicitud para restablecer tu contraseña.
          Este enlace expira en <strong style="color:#fff;">1 hora</strong>.
        </p>
        ${btn(resetUrl, 'Restablecer contraseña →', '#6366f1')}
        <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:16px;margin-top:16px;">
          <p style="color:rgba(239,68,68,0.8);font-size:13px;margin:0;">
            🔒 Si no solicitaste esto, ignora este correo. Tu contraseña no cambiará.
          </p>
        </div>
      `),
    })
    logger.info({ event: 'EMAIL_SENT', type: 'reset', to, id: result.data?.id })
    return result
  } catch (err: any) {
    logger.error({ event: 'EMAIL_FAILED', type: 'reset', to, error: err.message })
    throw err
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. UPGRADE A PRO/TEAM
// ══════════════════════════════════════════════════════════════════════════════
export async function sendUpgradeEmail(to: string, name: string, plan: string) {
  const isPro = plan.toLowerCase() === 'pro'
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: `🚀 Plan ${plan.toUpperCase()} activado — A3B Narrator`,
      html: base(`
        <div style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1));border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:28px;margin-bottom:28px;text-align:center;">
          <div style="font-size:40px;margin-bottom:12px;">🚀</div>
          <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 8px;">
            ¡${name}, ya eres ${plan.toUpperCase()}!
          </h1>
          <p style="color:rgba(255,255,255,0.55);font-size:15px;margin:0;">
            Tu suscripción está activa. Disfruta de todas las funciones.
          </p>
        </div>

        <p style="color:rgba(255,255,255,0.4);font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">
          Lo que tienes ahora
        </p>
        ${features(isPro ? [
          'DeepL — traducción de mayor calidad',
          '10 idiomas de destino',
          'Historial de frases 30 días',
          'Diccionario personal',
          'Sin límites de traducción',
          'Todas las plataformas incluidas',
        ] : [
          'Todo lo de Pro',
          'Usuarios ilimitados',
          'Dashboard de administración',
          'API access',
          'Soporte prioritario',
        ])}

        ${btn(`${BASE}/dashboard`, 'Ir al dashboard →')}
        <p style="margin-top:12px;">
          <a href="${BASE}/dashboard/billing" style="color:rgba(255,255,255,0.35);font-size:13px;text-decoration:none;">
            Gestionar suscripción →
          </a>
        </p>
      `),
    })
    logger.info({ event: 'EMAIL_SENT', type: 'upgrade', to, plan, id: result.data?.id })
    return result
  } catch (err: any) {
    logger.error({ event: 'EMAIL_FAILED', type: 'upgrade', to, error: err.message })
    throw err
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. PAGO FALLIDO
// ══════════════════════════════════════════════════════════════════════════════
export async function sendPaymentFailedEmail(to: string, name: string) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: '⚠️ Problema con tu pago — A3B Narrator',
      html: base(`
        <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 8px;">
          Problema con tu pago, ${name}
        </h1>
        <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.6;margin:0 0 24px;">
          No pudimos procesar tu pago para el plan PRO. Por favor actualiza tu
          método de pago para continuar disfrutando de las funciones premium.
        </p>
        ${btn(`${BASE}/dashboard/billing`, 'Actualizar método de pago →', '#ef4444')}
        <div style="background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.15);border-radius:10px;padding:16px;margin-top:16px;">
          <p style="color:rgba(239,68,68,0.7);font-size:13px;margin:0;">
            ⚠️ Si no actualizas en 3 días, tu cuenta pasará al plan Free automáticamente.
          </p>
        </div>
      `),
    })
    logger.info({ event: 'EMAIL_SENT', type: 'payment_failed', to, id: result.data?.id })
    return result
  } catch (err: any) {
    logger.error({ event: 'EMAIL_FAILED', type: 'payment_failed', to, error: err.message })
    throw err
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. CANCELACIÓN DE SUSCRIPCIÓN
// ══════════════════════════════════════════════════════════════════════════════
export async function sendCancellationEmail(to: string, name: string, endDate: string) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: '😔 Suscripción cancelada — A3B Narrator',
      html: base(`
        <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 8px;">
          Hasta pronto, ${name}
        </h1>
        <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.6;margin:0 0 24px;">
          Tu suscripción PRO ha sido cancelada. Seguirás teniendo acceso a las funciones
          PRO hasta el <strong style="color:#fff;">${endDate}</strong>.
        </p>
        <p style="color:rgba(255,255,255,0.4);font-size:14px;line-height:1.6;margin:0 0 24px;">
          Después de esa fecha, tu cuenta pasará automáticamente al plan Free
          (que incluye todas las plataformas y Google Translate).
        </p>
        ${btn(`${BASE}/pricing`, 'Reactivar suscripción →')}
        <p style="color:rgba(255,255,255,0.25);font-size:13px;margin-top:16px;">
          ¿Cancelaste por error? Puedes reactivar en cualquier momento.
        </p>
      `),
    })
    logger.info({ event: 'EMAIL_SENT', type: 'cancellation', to, id: result.data?.id })
    return result
  } catch (err: any) {
    logger.error({ event: 'EMAIL_FAILED', type: 'cancellation', to, error: err.message })
    throw err
  }
}
// ─── Función genérica ────────────────────────────────────────────────────────
export async function sendEmail({ to, subject, html }: {
  to: string; subject: string; html: string
}) {
  return resend.emails.send({
    from:    FROM,
    to:      [to],
    subject,
    html,
  })
}
// ─── Email: trial expira en 6 días ───────────────────────────────────────────
export async function sendTrialExpiringEmail(to: string, name: string, daysLeft: number) {
  const BASE = process.env.FRONTEND_URL ?? 'https://app.a3bhub.cloud'
  return resend.emails.send({
    from:    FROM,
    to:      [to],
    subject: `⏰ Tu prueba de A3B Narrator termina en ${daysLeft} día${daysLeft===1?'':'s'}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a15;color:#e0e0e0;padding:32px;border-radius:12px;">
        <h2 style="color:#fff;margin:0 0 6px">Hola${name ? `, ${name}` : ''}! ⏰</h2>
        <p style="color:#888;font-size:14px;margin:0 0 20px">
          Tu período de prueba gratuita de A3B Narrator termina en <strong style="color:#fbbf24">${daysLeft} día${daysLeft===1?'':'s'}</strong>.
        </p>
        <div style="background:#1a1a2e;border:1px solid #2a2a4e;border-radius:8px;padding:20px;margin:0 0 20px">
          <p style="margin:0 0 12px;font-size:14px;color:#e0e0e0;">Lo que perderías sin PRO:</p>
          <ul style="margin:0;padding-left:20px;color:#888;font-size:13px;line-height:1.8">
            <li>YouTube, Udemy, edX, LinkedIn Learning</li>
            <li>Khan Academy y DataCamp</li>
            <li>DeepL — traducción de mayor calidad</li>
            <li>Historial y diccionario personal</li>
          </ul>
        </div>
        <a href="${BASE}/dashboard/billing" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;">
          Mantener acceso — $4.99/mes →
        </a>
        <p style="color:#555;font-size:12px;margin:20px 0 0">
          Sin tarjeta durante el trial. Solo pagas si decides continuar.
        </p>
      </div>
    `,
  })
}

// ─── Email: trial expirado ────────────────────────────────────────────────────
export async function sendTrialExpiredEmail(to: string, name: string) {
  const BASE = process.env.FRONTEND_URL ?? 'https://app.a3bhub.cloud'
  return resend.emails.send({
    from:    FROM,
    to:      [to],
    subject: '🔒 Tu prueba de A3B Narrator ha terminado',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a15;color:#e0e0e0;padding:32px;border-radius:12px;">
        <h2 style="color:#fff;margin:0 0 6px">Tu prueba ha terminado 😔</h2>
        <p style="color:#888;font-size:14px;margin:0 0 20px">
          Hola${name ? `, ${name}` : ''}. Tu período de 36 días gratuitos de A3B Narrator ha concluido.
        </p>
        <p style="color:#888;font-size:14px;margin:0 0 20px">
          Activa PRO por <strong style="color:#a5b4fc">$4.99/mes</strong> para recuperar el acceso completo a todas las plataformas.
        </p>
        <a href="${BASE}/dashboard/billing" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;margin-bottom:16px;">
          Activar PRO ahora →
        </a>
        <br>
        <a href="${BASE}/pricing" style="display:inline-block;color:#6366f1;text-decoration:underline;font-size:13px;">
          Ver todos los planes
        </a>
        <p style="color:#555;font-size:12px;margin:20px 0 0">
          ¿Preguntas? Responde a este email o escríbenos a hello@a3bhub.cloud
        </p>
      </div>
    `,
  })
}

