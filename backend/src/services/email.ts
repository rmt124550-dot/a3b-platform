import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'noreply@a3bhub.cloud'
const BASE_URL = process.env.FRONTEND_URL ?? 'https://a3bhub.cloud'

// ─── Bienvenida ───────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: '🔊 Bienvenido a A3B Narrator',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: system-ui, sans-serif; background: #0a0a0f; color: #fff; padding: 40px 20px; margin: 0;">
        <div style="max-width: 520px; margin: 0 auto;">
          <div style="font-size: 32px; margin-bottom: 16px;">🔊</div>
          <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 8px;">
            Hola, ${name}!
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.6;">
            Tu cuenta en <strong style="color: #fff;">A3B Narrator</strong> está lista.
            Ya puedes instalar la extensión y empezar a estudiar Coursera en español.
          </p>

          <a href="${BASE_URL}/docs" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; margin: 24px 0;">
            Instalar extensión →
          </a>

          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 32px 0;" />

          <h2 style="font-size: 16px; font-weight: 700; margin: 0 0 12px;">Tu plan actual: Free</h2>
          <ul style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 2; padding-left: 20px; margin: 0 0 24px;">
            <li>Google Text-to-Speech</li>
            <li>Traducción EN → ES</li>
            <li>Compatible con Coursera</li>
          </ul>

          <a href="${BASE_URL}/pricing" style="color: #6366f1; font-size: 14px; text-decoration: none;">
            Actualizar a PRO por $4.99/mes →
          </a>

          <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin-top: 48px;">
            A3B Cloud · <a href="${BASE_URL}/privacy" style="color: rgba(255,255,255,0.3);">Privacidad</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

// ─── Upgrade a PRO ────────────────────────
export async function sendUpgradeEmail(to: string, name: string, plan: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `🚀 Plan ${plan.toUpperCase()} activado — A3B Narrator`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: system-ui, sans-serif; background: #0a0a0f; color: #fff; padding: 40px 20px; margin: 0;">
        <div style="max-width: 520px; margin: 0 auto;">
          <div style="font-size: 32px; margin-bottom: 16px;">🚀</div>
          <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 8px;">
            ${name}, ya eres ${plan.toUpperCase()}
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.6;">
            Tu suscripción está activa. Ahora tienes acceso a DeepL, 
            10 idiomas, historial y diccionario personal.
          </p>
          <a href="${BASE_URL}/dashboard" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; margin: 24px 0;">
            Ir al dashboard →
          </a>
          <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin-top: 48px;">
            A3B Cloud · <a href="${BASE_URL}/dashboard/billing" style="color: rgba(255,255,255,0.3);">Gestionar suscripción</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

// ─── Reset de contraseña ──────────────────
export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`
  return resend.emails.send({
    from: FROM,
    to,
    subject: '🔐 Restablecer contraseña — A3B Narrator',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: system-ui, sans-serif; background: #0a0a0f; color: #fff; padding: 40px 20px; margin: 0;">
        <div style="max-width: 520px; margin: 0 auto;">
          <div style="font-size: 32px; margin-bottom: 16px;">🔐</div>
          <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 8px;">Restablecer contraseña</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.6;">
            Recibimos una solicitud para restablecer tu contraseña.
            Este enlace expira en <strong style="color:#fff;">1 hora</strong>.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; margin: 24px 0;">
            Restablecer contraseña →
          </a>
          <p style="color: rgba(255,255,255,0.3); font-size: 13px;">
            Si no solicitaste esto, ignora este correo.
          </p>
          <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin-top: 48px;">A3B Cloud</p>
        </div>
      </body>
      </html>
    `,
  })
}

// ─── Pago fallido ─────────────────────────
export async function sendPaymentFailedEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: '⚠️ Problema con tu pago — A3B Narrator',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: system-ui, sans-serif; background: #0a0a0f; color: #fff; padding: 40px 20px; margin: 0;">
        <div style="max-width: 520px; margin: 0 auto;">
          <div style="font-size: 32px; margin-bottom: 16px;">⚠️</div>
          <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 8px;">
            Problema con tu pago, ${name}
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.6;">
            No pudimos procesar tu pago. Por favor actualiza tu método de pago
            para continuar disfrutando de las funciones PRO.
          </p>
          <a href="${BASE_URL}/dashboard/billing" style="display: inline-block; background: #ef4444; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; margin: 24px 0;">
            Actualizar método de pago →
          </a>
          <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin-top: 48px;">A3B Cloud</p>
        </div>
      </body>
      </html>
    `,
  })
}
