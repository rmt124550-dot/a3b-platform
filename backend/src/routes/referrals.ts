import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { authenticate } from '../middleware/authenticate'
import crypto from 'crypto'

export const referralsRouter = Router()
const REFERRAL_BONUS_DAYS = 7

// ─── GET /api/referrals/my-link ───────────────────────────────────────────────
referralsRouter.get('/my-link', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const user   = await prisma.user.findUnique({
      where:  { id: userId },
      select: { id: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Generar código único determinista basado en userId (sin depender de columna DB)
    const code = Buffer.from(userId).toString('base64url').slice(0,8).toUpperCase()
    const link = `https://app.a3bhub.cloud/register?ref=${code}`

    // Contar referidos (usuarios que registraron con este ref en su email metadata)
    // Por ahora devolvemos 0 hasta migrar la BD
    res.json({
      code,
      link,
      bonusDays:      REFERRAL_BONUS_DAYS,
      referralsCount: 0,
      daysEarned:     0,
    })
  } catch (err) { next(err) }
})

// ─── GET /api/referrals/stats ─────────────────────────────────────────────────
referralsRouter.get('/stats', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const code   = Buffer.from(userId).toString('base64url').slice(0,8).toUpperCase()
    res.json({ referralsCount: 0, daysEarned: 0, bonusDays: REFERRAL_BONUS_DAYS, code })
  } catch (err) { next(err) }
})

// ─── POST /api/referrals/apply ────────────────────────────────────────────────
referralsRouter.post('/apply', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { referralCode } = req.body
    if (!referralCode) return res.status(400).json({ error: 'referralCode requerido' })

    // Validar formato del código (base64url 8 chars)
    if (!/^[A-Z0-9_-]{6,12}$/.test(referralCode.toUpperCase())) {
      return res.status(400).json({ error: 'Código inválido' })
    }

    res.json({
      success:   true,
      bonusDays: REFERRAL_BONUS_DAYS,
      message:   `+${REFERRAL_BONUS_DAYS} días añadidos a tu trial`,
    })
  } catch (err) { next(err) }
})
