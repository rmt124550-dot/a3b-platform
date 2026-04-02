import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { sendPasswordResetEmail } from '../services/email'

export const userRouter = Router()

// ─── Schemas ──────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

const settingsSchema = z.object({
  voiceSpeed: z.number().min(0.5).max(2).optional(),
  voiceVolume: z.number().min(0).max(1).optional(),
  voicePitch: z.number().min(0.5).max(2).optional(),
  voiceName: z.string().optional(),
  targetLang: z.string().length(2).optional(),
  showOverlay: z.boolean().optional(),
  translator: z.enum(['google', 'deepl']).optional(),
})

const forgotSchema = z.object({ email: z.string().email() })
const resetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

// ─── GET /api/user/profile ────────────────
userRouter.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        plan: true, role: true, emailVerified: true,
        createdAt: true, lastLoginAt: true,
        settings: true,
        _count: {
          select: {
            history: true,
            dictionary: true,
          },
        },
      },
    })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/user/profile ──────────────
userRouter.patch('/profile', authenticate, validate(profileSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
      select: { id: true, email: true, name: true, avatarUrl: true, plan: true },
    })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/user/password ─────────────
userRouter.patch('/password', authenticate, validate(passwordSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user?.passwordHash) return res.status(400).json({ error: 'No password set' })

    const valid = await bcrypt.compare(req.body.currentPassword, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' })

    const passwordHash = await bcrypt.hash(req.body.newPassword, 12)
    await prisma.user.update({ where: { id: req.user!.id }, data: { passwordHash } })

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/user/settings ───────────────
userRouter.get('/settings', authenticate, async (req, res, next) => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      create: { userId: req.user!.id },
      update: {},
    })
    res.json({ settings })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/user/settings ─────────────
userRouter.patch('/settings', authenticate, validate(settingsSchema), async (req, res, next) => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      create: { userId: req.user!.id, ...req.body },
      update: req.body,
    })
    res.json({ settings })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/user/account ─────────────
userRouter.delete('/account', authenticate, async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { deletedAt: new Date() },
    })
    res.json({ message: 'Account scheduled for deletion' })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/user/forgot-password ───────
userRouter.post('/forgot-password', validate(forgotSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } })

    // Siempre responder OK (no revelar si el email existe)
    if (!user) return res.json({ message: 'If the email exists, a reset link was sent' })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpires: expires },
    })

    await sendPasswordResetEmail(user.email, token)

    res.json({ message: 'If the email exists, a reset link was sent' })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/user/reset-password ────────
userRouter.post('/reset-password', validate(resetSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: req.body.token,
        resetTokenExpires: { gt: new Date() },
        deletedAt: null,
      },
    })

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' })

    const passwordHash = await bcrypt.hash(req.body.newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpires: null },
    })

    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    next(err)
  }
})
