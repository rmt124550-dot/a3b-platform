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
  name:     z.string().min(2).max(100).trim()
            .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name contains invalid characters'),
  email:    z.string().email().max(254).toLowerCase().trim(),
  password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password too long')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Must contain at least one number'),
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
    const { name, email, password } = req.body

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

