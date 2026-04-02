import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { redis } from '../utils/redis'
import { sendWelcomeEmail } from '../services/email'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/authenticate'

export const authRouter = Router()

// ─── Schemas ──────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ─── Helpers ──────────────────────────────
function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

// ─── POST /api/auth/register ──────────────
authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        settings: { create: {} }, // defaults
      },
      select: { id: true, email: true, name: true, plan: true, role: true },
    })

    const { accessToken, refreshToken } = generateTokens(user.id)

    // Store refresh token
    await redis.setex(`refresh:${user.id}:${refreshToken}`, 7 * 24 * 60 * 60, '1')

    // Send welcome email async
    sendWelcomeEmail(user.email, user.name ?? 'there').catch(console.error)

    res.status(201).json({ user, accessToken, refreshToken })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/login ─────────────────
authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (user.deletedAt) {
      return res.status(403).json({ error: 'Account suspended' })
    }

    const { accessToken, refreshToken } = generateTokens(user.id)
    await redis.setex(`refresh:${user.id}:${refreshToken}`, 7 * 24 * 60 * 60, '1')

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    res.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/refresh ───────────────
authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { sub: string }
    const exists = await redis.exists(`refresh:${payload.sub}:${refreshToken}`)
    if (!exists) return res.status(401).json({ error: 'Invalid refresh token' })

    // Rotate tokens
    await redis.del(`refresh:${payload.sub}:${refreshToken}`)
    const tokens = generateTokens(payload.sub)
    await redis.setex(`refresh:${payload.sub}:${tokens.refreshToken}`, 7 * 24 * 60 * 60, '1')

    res.json(tokens)
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/logout ────────────────
authRouter.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await redis.del(`refresh:${req.user!.id}:${refreshToken}`)
    }
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/auth/me ─────────────────────
authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        plan: true, role: true, emailVerified: true,
        createdAt: true, lastLoginAt: true,
        settings: true,
      },
    })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})
