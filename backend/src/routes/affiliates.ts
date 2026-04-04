import { Router } from 'express'
import { z }       from 'zod'
import { prisma }  from '../utils/prisma'
import { authenticate }  from '../middleware/authenticate'
import { requireAdmin }  from '../middleware/requireAdmin'
import { validate }      from '../middleware/validate'
import { logger }        from '../utils/logger'

export const affiliatesRouter = Router()

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateCode(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}${suffix}`
}

// ─── POST /api/affiliates/join ─────────────────────────────────────────────────
// El usuario solicita unirse al programa
affiliatesRouter.post('/join', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id

    const existing = await prisma.affiliate.findUnique({ where: { userId } })
    if (existing) {
      return res.status(409).json({
        error: 'Ya eres parte del programa de afiliados.',
        code:  'ALREADY_AFFILIATE',
        affiliate: existing,
      })
    }

    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { name: true, email: true },
    })

    const code = generateCode(user?.name ?? user?.email ?? userId)

    const affiliate = await prisma.affiliate.create({
      data: { userId, code, status: 'active' },
    })

    logger.info({ event: 'AFFILIATE_JOINED', userId, code })
    res.status(201).json({ ok: true, affiliate })
  } catch (err) { next(err) }
})

// ─── GET /api/affiliates/me ────────────────────────────────────────────────────
// Dashboard del afiliado: stats + referidos + payouts
affiliatesRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where:  { userId: req.user!.id },
      include: {
        referrals: {
          include: { referredUser: { select: { email: true, plan: true, createdAt: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        payouts: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    })

    if (!affiliate) {
      return res.status(404).json({ error: 'No estás en el programa de afiliados.', code: 'NOT_AFFILIATE' })
    }

    // Link de referido
    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${affiliate.code}`

    res.json({
      affiliate: {
        ...affiliate,
        referralLink,
        referralCount:  affiliate.referrals.length,
        activeCount:    affiliate.referrals.filter(r => r.status === 'active').length,
        pendingPayout:  affiliate.pendingAmount,
      },
    })
  } catch (err) { next(err) }
})

// ─── PATCH /api/affiliates/me ──────────────────────────────────────────────────
// Actualizar PayPal email
affiliatesRouter.patch('/me',
  authenticate,
  validate(z.object({ paypalEmail: z.string().email() })),
  async (req, res, next) => {
    try {
      const { paypalEmail } = req.body
      const aff = await prisma.affiliate.update({
        where: { userId: req.user!.id },
        data:  { paypalEmail },
      })
      res.json({ ok: true, paypalEmail: aff.paypalEmail })
    } catch (err) { next(err) }
  }
)

// ─── GET /api/affiliates/link/:code ───────────────────────────────────────────
// Valida un código de referido (llamado cuando alguien visita /register?ref=xxx)
affiliatesRouter.get('/link/:code', async (req, res, next) => {
  try {
    const { code } = req.params
    const aff = await prisma.affiliate.findUnique({
      where:  { code },
      select: { id: true, code: true, status: true, userId: true },
    })
    if (!aff || aff.status !== 'active') {
      return res.status(404).json({ error: 'Código de afiliado inválido.' })
    }
    res.json({ ok: true, code: aff.code })
  } catch (err) { next(err) }
})

// ─── ADMIN: GET /api/affiliates ────────────────────────────────────────────────
affiliatesRouter.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const affiliates = await prisma.affiliate.findMany({
      include: {
        user:     { select: { email: true, name: true } },
        referrals: { select: { status: true, commissionTotal: true } },
        payouts:   { select: { amount: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const enriched = affiliates.map(a => ({
      ...a,
      referralCount: a.referrals.length,
      activeCount:   a.referrals.filter(r => r.status === 'active').length,
      totalCommission: a.referrals.reduce((s, r) => s + r.commissionTotal, 0),
    }))

    res.json({ affiliates: enriched, total: affiliates.length })
  } catch (err) { next(err) }
})

// ─── ADMIN: POST /api/affiliates/:id/payout ────────────────────────────────────
// Marcar pago realizado a un afiliado
affiliatesRouter.post('/:id/payout',
  authenticate,
  requireAdmin,
  validate(z.object({
    amount:    z.number().positive(),
    method:    z.enum(['paypal','transfer']).default('paypal'),
    reference: z.string().optional(),
  })),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { amount, method, reference } = req.body

      const [payout, aff] = await prisma.$transaction([
        prisma.affiliatePayout.create({
          data: {
            affiliateId: id, amount, method, status: 'paid',
            reference, paidAt: new Date(),
          },
        }),
        prisma.affiliate.update({
          where: { id },
          data: {
            totalPaid:     { increment: amount },
            pendingAmount: { decrement: amount },
          },
        }),
      ])

      logger.info({ event: 'AFFILIATE_PAYOUT', affiliateId: id, amount, method })
      res.json({ ok: true, payout })
    } catch (err) { next(err) }
  }
)
