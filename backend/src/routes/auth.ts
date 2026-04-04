import { Router }  from 'express'
import bcrypt      from 'bcryptjs'
import jwt         from 'jsonwebtoken'
import { z }       from 'zod'
import { prisma }  from '../utils/prisma'
import { redis }   from '../utils/redis'
import { logger, securityLog, auditLog } from '../utils/logger'
import { sendVerificationEmail, sendWelcomeEmail } from '../services/email'
import { validate }          from '../middleware/validate'
import { authenticate }      from '../middleware/authenticate'
import { authLimiter }       from '../middleware/security'

export const authRouter = Router()

// ─── Schemas robustos ──────────────────────────────────────────────────────
const registerSchema = z.object({
  name:          z.string().min(2).max(100).trim()
                 .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name contains invalid characters'),
  email:         z.string().email().max(254).toLowerCase().trim(),
  password:      z.string()
                 .min(8, 'Password must be at least 8 characters')
                 .max(128, 'Password too long')
                 .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
                 .regex(/[0-9]/, 'Must contain at least one number'),
  affiliateCode: z.string().max(32).optional(),  // código de afiliado referente
})

const loginSchema = z.object({
  email:    z.string().email().max(254).toLowerCase().trim(),
  password: z.string().min(1).max(128),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8).max(128)
                  .regex(/[A-Z]/, 'Must contain uppercase')
                  .regex(/[0-9]/, 'Must contain number'),
})

// ─── Helpers ──────────────────────────────────────────────────────────────
function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET!,
    { expiresIn: '15m', algorithm: 'HS256' }
  )
  const refreshToken = jwt.sign(
    { sub: userId, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d', algorithm: 'HS256' }
  )
  return { accessToken, refreshToken }
}

// Timing constante para prevenir timing attacks en login
async function constantTimeCompare(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    await bcrypt.compare(plain, '$2a$12$invalidhashfortimingprotection000000')
    return false
  }
}

// ─── POST /api/auth/register ──────────────────────────────────────────────
authRouter.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, affiliateCode } = req.body

    // Verificar email con bcrypt cost alto
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      // Mismo tiempo de respuesta que si no existiera (anti-enumeration)
      await bcrypt.hash(password, 12)
      return res.status(409).json({ error: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    // Generar token de verificación de email (hex aleatorio, expira en 24h)
    const crypto = await import('crypto')
    const verifyToken = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerifyToken: verifyToken,
        emailVerified:    false,
        affiliateCode:    affiliateCode ?? null,
        settings: { create: {} },
      },
      select: {
        id: true, email: true, name: true,
        plan: true, role: true, emailVerified: true,
      },
    })

    const { accessToken, refreshToken } = generateTokens(user.id)
    await redis.setex(`refresh:${user.id}:${refreshToken}`, 7 * 24 * 60 * 60, '1')

    auditLog('USER_REGISTERED', user.id, { email: user.email, ip: req.ip })

    // Enviar email de verificación (no welcome — el welcome se envía al verificar)
    sendVerificationEmail(user.email, user.name ?? 'there', verifyToken).catch(err =>
      logger.error({ event: 'VERIFY_EMAIL_FAILED', error: err.message })
    )

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
      emailVerified: false,
      message: 'Account created. Please check your email to verify your account.',
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/login ────────────────────────────────────────────────
authRouter.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const ip = req.ip ?? 'unknown'

    const user = await prisma.user.findUnique({
      where:  { email },
      select: {
        id: true, email: true, name: true, passwordHash: true,
        plan: true, role: true, emailVerified: true, deletedAt: true, lastLoginAt: true,
      }
    })

    // Siempre ejecutar bcrypt (timing attack prevention)
    const passwordToCheck = user?.passwordHash ?? '$2a$12$invalidhashfortimingprotect000000'
    const valid = await constantTimeCompare(password, passwordToCheck)

    if (!user || !valid) {
      securityLog('FAILED_LOGIN', { ip, email, ua: req.headers['user-agent']?.slice(0,80) })
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (user.deletedAt) {
      return res.status(403).json({ error: 'Account suspended. Contact support.' })
    }

    const { accessToken, refreshToken } = generateTokens(user.id)
    await redis.setex(`refresh:${user.id}:${refreshToken}`, 7 * 24 * 60 * 60, '1')

    await prisma.user.update({
      where: { id: user.id },
      data:  { lastLoginAt: new Date() },
    })

    auditLog('USER_LOGIN', user.id, { ip, email })

    res.json({
      user: {
        id: user.id, email: user.email,
        name: user.name, plan: user.plan, role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/refresh ──────────────────────────────────────────────
authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken || typeof refreshToken !== 'string') {
      return res.status(401).json({ error: 'No refresh token provided' })
    }

    let payload: { sub: string }
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, {
        algorithms: ['HS256'],
      }) as { sub: string }
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token' })
    }

    const exists = await redis.exists(`refresh:${payload.sub}:${refreshToken}`)
    if (!exists) {
      securityLog('REFRESH_TOKEN_REUSE', { userId: payload.sub, ip: req.ip })
      // Revocar TODOS los tokens del usuario (posible robo)
      const pattern = `refresh:${payload.sub}:*`
      const keys = await redis.keys(pattern)
      if (keys.length > 0) await redis.del(...keys)
      return res.status(401).json({ error: 'Token already used. Please login again.' })
    }

    // Rotation
    await redis.del(`refresh:${payload.sub}:${refreshToken}`)
    const tokens = generateTokens(payload.sub)
    await redis.setex(`refresh:${payload.sub}:${tokens.refreshToken}`, 7 * 24 * 60 * 60, '1')

    auditLog('TOKEN_REFRESHED', payload.sub, { ip: req.ip })
    res.json(tokens)
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/logout ───────────────────────────────────────────────
authRouter.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken, allDevices } = req.body
    const userId = req.user!.id

    if (allDevices) {
      // Cerrar TODAS las sesiones
      const keys = await redis.keys(`refresh:${userId}:*`)
      if (keys.length > 0) await redis.del(...keys)
      auditLog('LOGOUT_ALL_DEVICES', userId, { ip: req.ip })
    } else if (refreshToken) {
      await redis.del(`refresh:${userId}:${refreshToken}`)
      auditLog('LOGOUT', userId, { ip: req.ip })
    }

    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/auth/me ────────────────────────────────────────────────────
authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        plan: true, role: true, emailVerified: true,
        createdAt: true, lastLoginAt: true,
        settings: true,
      },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/auth/password ────────────────────────────────────────────
authRouter.patch('/password', authenticate, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user!.id

    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { passwordHash: true },
    })
    if (!user?.passwordHash) return res.status(404).json({ error: 'User not found' })

    const valid = await constantTimeCompare(currentPassword, user.passwordHash)
    if (!valid) {
      securityLog('WRONG_PASSWORD_CHANGE', { userId, ip: req.ip })
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } })

    // Revocar todas las sesiones activas (forzar re-login)
    const keys = await redis.keys(`refresh:${userId}:*`)
    if (keys.length > 0) await redis.del(...keys)

    auditLog('PASSWORD_CHANGED', userId, { ip: req.ip })
    res.json({ message: 'Password updated. Please login again with your new password.' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/auth/verify-email ───────────────────────────────────────────
// Verifica el email del usuario via token en URL
authRouter.get('/verify-email', async (req, res, next) => {
  try {
    const { token } = req.query
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token de verificación requerido.' })
    }

    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token, emailVerified: false },
    })

    if (!user) {
      return res.status(400).json({
        error: 'Token inválido o ya utilizado.',
        code:  'INVALID_TOKEN',
      })
    }

    // Marcar email como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified:    true,
        emailVerifyToken: null,
      },
    })

    // Invalidar caché del usuario
    await redis.del(`user_cache:${user.id}`)

    // Enviar email de bienvenida ahora que está verificado
    sendWelcomeEmail(user.email, user.name ?? 'there').catch(() => {})

    auditLog('EMAIL_VERIFIED', user.id, { email: user.email })
    res.json({
      ok: true,
      message: '¡Email verificado correctamente! Ya puedes usar todas las funciones.',
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/resend-verification ──────────────────────────────────
// Reenvía el email de verificación
authRouter.post('/resend-verification', authLimiter, authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { id: true, email: true, name: true, emailVerified: true },
    })

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' })
    if (user.emailVerified) {
      return res.status(400).json({ error: 'Tu email ya está verificado.', code: 'ALREADY_VERIFIED' })
    }

    // Generar nuevo token
    const crypto = await import('crypto')
    const newToken = crypto.randomBytes(32).toString('hex')

    await prisma.user.update({
      where: { id: user.id },
      data:  { emailVerifyToken: newToken },
    })

    sendVerificationEmail(user.email, user.name ?? 'there', newToken).catch(() => {})

    auditLog('VERIFICATION_RESENT', user.id, { ip: req.ip })
    res.json({ ok: true, message: 'Email de verificación reenviado. Revisa tu bandeja de entrada.' })
  } catch (err) {
    next(err)
  }
})
// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
authRouter.post('/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email requerido.' })
    }

    // Siempre responder 200 para no revelar si el email existe (anti-enumeration)
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    if (user && !user.deletedAt) {
      const crypto      = await import('crypto')
      const resetToken  = crypto.randomBytes(32).toString('hex')
      const expires     = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

      await prisma.user.update({
        where: { id: user.id },
        data:  { resetToken, resetTokenExpires: expires },
      })

      // Enviar email con el link de reset
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      const { sendEmail } = await import('../services/email')
      sendEmail({
        to:      user.email,
        subject: '🔐 Restablecer contraseña — A3B Narrator',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0a0a15;color:#e0e0e0;padding:32px;border-radius:12px;">
            <h2 style="color:#fff;margin:0 0 8px">Restablecer contraseña</h2>
            <p style="color:#888;margin:0 0 24px;font-size:14px">
              Recibimos una solicitud para restablecer la contraseña de <strong style="color:#e0e0e0">${user.email}</strong>.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
              Restablecer contraseña
            </a>
            <p style="color:#555;font-size:12px;margin:24px 0 0">
              Este link expira en <strong style="color:#888">1 hora</strong>. Si no solicitaste esto, ignora este email.
            </p>
            <p style="color:#555;font-size:11px;margin:8px 0 0">
              O copia este link: ${resetUrl}
            </p>
          </div>
        `,
      }).catch(() => {})

      securityLog('PASSWORD_RESET_REQUESTED', { userId: user.id, ip: req.ip })
    }

    res.json({ ok: true, message: 'Si ese email existe, recibirás instrucciones en breve.' })
  } catch (err) { next(err) }
})

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
authRouter.post('/reset-password', authLimiter, async (req, res, next) => {
  try {
    const { token, password } = req.body

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token requerido.' })
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'La contraseña debe contener al menos una mayúscula.' })
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'La contraseña debe contener al menos un número.' })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken:        token,
        resetTokenExpires: { gt: new Date() },
        deletedAt:         null,
      },
    })

    if (!user) {
      return res.status(400).json({
        error: 'Token inválido o expirado. Solicita un nuevo link.',
        code:  'INVALID_RESET_TOKEN',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken:        null,
        resetTokenExpires: null,
      },
    })

    // Revocar TODAS las sesiones activas por seguridad
    const keys = await redis.keys(`refresh:${user.id}:*`)
    if (keys.length > 0) await redis.del(...keys)

    auditLog('PASSWORD_RESET_COMPLETED', user.id, { ip: req.ip })
    res.json({ ok: true, message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' })
  } catch (err) { next(err) }
})

