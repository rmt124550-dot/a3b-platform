import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { authenticate } from '../middleware/authenticate'
import crypto from 'crypto'

export const referralsRouter = Router()

const REFERRAL_BONUS_DAYS = 7

// ─── GET /api/referrals/my-link ───────────────────────────────────────────────
referralsRouter.get('/my-link', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Usar raw query para evitar problemas de tipos Prisma sin migration
    const users = await prisma.$queryRaw<Array<{
      id: string; referralCode: string|null; trialEndsAt: Date|null
    }>>`
      SELECT id, "referralCode", "trialEndsAt"
      FROM "User" WHERE id = ${req.user!.id}
    `
    const user = users[0]
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    let code = user.referralCode
    if (!code) {
      code = crypto.randomBytes(4).toString('hex').toUpperCase()
      await prisma.$executeRaw`
        UPDATE "User" SET "referralCode" = ${code} WHERE id = ${req.user!.id}
      `
    }

    const referrals = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "User"
      WHERE "referredBy" = ${code} AND "emailVerified" = true
    `

    res.json({
      code,
      link:           \`https://app.a3bhub.cloud/register?ref=\${code}\`,
      bonusDays:      REFERRAL_BONUS_DAYS,
      referralsCount: referrals.length,
      daysEarned:     referrals.length * REFERRAL_BONUS_DAYS,
    })
  } catch (err) { next(err) }
})

// ─── POST /api/referrals/apply ────────────────────────────────────────────────
referralsRouter.post('/apply', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { referralCode } = req.body as { referralCode?: string }
    if (!referralCode) return res.status(400).json({ error: 'referralCode requerido' })

    const code = referralCode.toUpperCase()

    // Buscar referidor
    const referrers = await prisma.$queryRaw<Array<{
      id: string; trialEndsAt: Date|null
    }>>`SELECT id, "trialEndsAt" FROM "User" WHERE "referralCode" = ${code}`
    if (!referrers.length) return res.status(404).json({ error: 'Código inválido' })
    const referrer = referrers[0]
    if (referrer.id === req.user!.id) return res.status(400).json({ error: 'No puedes usar tu propio código' })

    // Verificar que el usuario no haya sido ya referido
    const me = await prisma.$queryRaw<Array<{
      referredBy: string|null; trialEndsAt: Date|null
    }>>`SELECT "referredBy", "trialEndsAt" FROM "User" WHERE id = ${req.user!.id}`
    if (me[0]?.referredBy) return res.status(400).json({ error: 'Ya tienes un código aplicado' })

    const now   = new Date()
    const BONUS = REFERRAL_BONUS_DAYS * 86_400_000
    const myEnd = new Date(Math.max(me[0]?.trialEndsAt?.getTime() ?? now.getTime(), now.getTime()) + BONUS)
    const refEnd= new Date(Math.max(referrer.trialEndsAt?.getTime() ?? now.getTime(), now.getTime()) + BONUS)

    await Promise.all([
      prisma.$executeRaw`
        UPDATE "User" SET "referredBy" = ${code}, "trialEndsAt" = ${myEnd}
        WHERE id = ${req.user!.id}
      `,
      prisma.$executeRaw`
        UPDATE "User" SET "trialEndsAt" = ${refEnd} WHERE id = ${referrer.id}
      `,
    ])

    res.json({
      success:     true,
      bonusDays:   REFERRAL_BONUS_DAYS,
      message:     \`¡+\${REFERRAL_BONUS_DAYS} días añadidos! El usuario que te invitó también recibió \${REFERRAL_BONUS_DAYS} días.\`,
      newTrialEnd: myEnd.toISOString(),
    })
  } catch (err) { next(err) }
})

// ─── GET /api/referrals/stats ─────────────────────────────────────────────────
referralsRouter.get('/stats', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const me = await prisma.$queryRaw<Array<{
      referralCode: string|null; trialEndsAt: Date|null
    }>>`SELECT "referralCode", "trialEndsAt" FROM "User" WHERE id = ${req.user!.id}`

    if (!me[0]?.referralCode) {
      return res.json({ referralsCount: 0, daysEarned: 0, bonusDays: REFERRAL_BONUS_DAYS })
    }

    const count = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "User"
      WHERE "referredBy" = ${me[0].referralCode} AND "emailVerified" = true
    `
    const n = Number(count[0]?.count ?? 0)

    res.json({
      referralsCount: n,
      daysEarned:     n * REFERRAL_BONUS_DAYS,
      bonusDays:      REFERRAL_BONUS_DAYS,
      trialEndsAt:    me[0].trialEndsAt,
    })
  } catch (err) { next(err) }
})
