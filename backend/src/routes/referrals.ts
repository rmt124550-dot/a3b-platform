import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { authenticate } from '../middleware/authenticate'
import crypto from 'crypto'

export const referralsRouter = Router()

const REFERRAL_BONUS_DAYS = 7  // días extra para ambos al convertir

// ─── GET /api/referrals/my-link ───────────────────────────────────────────────
// Devuelve el link de referido del usuario actual
referralsRouter.get('/my-link', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { referralCode: true, name: true, email: true },
    })

    // Generar código si no tiene
    if (!user?.referralCode) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase()
      await prisma.user.update({
        where: { id: req.user!.id },
        data:  { referralCode: code },
      })
      return res.json({
        code,
        link: `https://app.a3bhub.cloud/register?ref=${code}`,
        bonusDays: REFERRAL_BONUS_DAYS,
        referralsCount: 0,
        daysEarned: 0,
      })
    }

    // Contar referidos convertidos
    const referrals = await prisma.user.findMany({
      where:  { referredBy: user.referralCode },
      select: { id: true, emailVerified: true, createdAt: true },
    })
    const converted = referrals.filter(r => r.emailVerified)

    res.json({
      code:           user.referralCode,
      link:           `https://app.a3bhub.cloud/register?ref=${user.referralCode}`,
      bonusDays:      REFERRAL_BONUS_DAYS,
      referralsCount: converted.length,
      daysEarned:     converted.length * REFERRAL_BONUS_DAYS,
    })
  } catch (err) { next(err) }
})

// ─── POST /api/referrals/apply ────────────────────────────────────────────────
// Llamado en el registro cuando el usuario usa un ref=CODE
// Activa el bonus para ambos (referidor y nuevo usuario)
referralsRouter.post('/apply', authenticate, async (req, res, next) => {
  try {
    const { referralCode } = req.body
    if (!referralCode || typeof referralCode !== 'string') {
      return res.status(400).json({ error: 'referralCode requerido' })
    }

    // Buscar al referidor
    const referrer = await prisma.user.findFirst({
      where:  { referralCode: referralCode.toUpperCase() },
      select: { id: true, trialEndsAt: true, email: true, name: true },
    })

    if (!referrer) {
      return res.status(404).json({ error: 'Código de referido inválido' })
    }
    if (referrer.id === req.user!.id) {
      return res.status(400).json({ error: 'No puedes usar tu propio código' })
    }

    // Verificar que el nuevo usuario no haya sido ya referido
    const newUser = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { referredBy: true, trialEndsAt: true },
    })
    if (newUser?.referredBy) {
      return res.status(400).json({ error: 'Ya tienes un código aplicado' })
    }

    const now = new Date()
    const MS_PER_DAY = 86_400_000

    // Extender trial del nuevo usuario +7 días
    const newUserTrialEnd = new Date(
      Math.max(newUser?.trialEndsAt?.getTime() ?? now.getTime(), now.getTime()) +
      REFERRAL_BONUS_DAYS * MS_PER_DAY
    )

    // Extender trial del referidor +7 días
    const referrerTrialEnd = new Date(
      Math.max(referrer.trialEndsAt?.getTime() ?? now.getTime(), now.getTime()) +
      REFERRAL_BONUS_DAYS * MS_PER_DAY
    )

    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user!.id },
        data:  { referredBy: referralCode.toUpperCase(), trialEndsAt: newUserTrialEnd },
      }),
      prisma.user.update({
        where: { id: referrer.id },
        data:  { trialEndsAt: referrerTrialEnd },
      }),
    ])

    res.json({
      success:     true,
      bonusDays:   REFERRAL_BONUS_DAYS,
      message:     `¡+${REFERRAL_BONUS_DAYS} días añadidos a tu trial! El usuario que te invitó también recibió ${REFERRAL_BONUS_DAYS} días.`,
      newTrialEnd: newUserTrialEnd.toISOString(),
    })
  } catch (err) { next(err) }
})

// ─── GET /api/referrals/stats ─────────────────────────────────────────────────
referralsRouter.get('/stats', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { referralCode: true, trialEndsAt: true },
    })

    if (!user?.referralCode) {
      return res.json({ referralsCount: 0, daysEarned: 0, bonusDays: REFERRAL_BONUS_DAYS })
    }

    const count = await prisma.user.count({
      where: { referredBy: user.referralCode, emailVerified: true },
    })

    res.json({
      referralsCount: count,
      daysEarned:     count * REFERRAL_BONUS_DAYS,
      bonusDays:      REFERRAL_BONUS_DAYS,
      trialEndsAt:    user.trialEndsAt,
    })
  } catch (err) { next(err) }
})
