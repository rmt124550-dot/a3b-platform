import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authenticate, requireAdmin } from '../middleware/authenticate'

  } catch (err) { next(err) }
})


// ─── GET /api/admin/ai-metrics ───────────────────────────────────────────────
adminRouter.get('/ai-metrics', requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now   = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const week  = new Date(today.getTime() - 7 * 86_400_000)
    const month = new Date(now.getFullYear(), now.getMonth(), 1)

    const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
      prisma.usageLog.count({ where: { action: 'ai_translate', createdAt: { gte: today } } }),
      prisma.usageLog.count({ where: { action: 'ai_translate', createdAt: { gte: week  } } }),
      prisma.usageLog.count({ where: { action: 'ai_translate', createdAt: { gte: month } } }),
      prisma.usageLog.count({ where: { action: 'ai_translate' } }),
    ])

    const AVG_TOKENS  = 98
    const COST_PER_1M = 0.065
    const monthTokens = monthCount * AVG_TOKENS
    const monthCostUsd= Math.round((monthTokens / 1_000_000) * COST_PER_1M * 10000) / 10000

    res.json({ ai: { today: todayCount, week: weekCount, month: monthCount,
                     total: totalCount, monthTokens, monthCostUsd, avgLatencyMs: 200 } })
  } catch (err) { next(err) }
})


export const adminRouter = Router()
adminRouter.use(authenticate, requireAdmin)

// ─── GET /api/admin/metrics ───────────────
adminRouter.get('/metrics', async (_req, res, next) => {
  try {
    const [
      totalUsers,
      proUsers,
      teamUsers,
      totalRevenue,
      recentSignups,
      translationsToday,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { plan: 'pro', deletedAt: null } }),
      prisma.user.count({ where: { plan: 'team', deletedAt: null } }),
      prisma.payment.aggregate({
        where: { status: 'succeeded' },
        _sum: { amount: true },
      }),
      prisma.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, plan: true, createdAt: true },
      }),
      prisma.usageLog.count({
        where: {
          action: 'translate',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ])

    res.json({
      users: {
        total: totalUsers,
        free: totalUsers - proUsers - teamUsers,
        pro: proUsers,
        team: teamUsers,
      },
      revenue: {
        total: (totalRevenue._sum.amount ?? 0) / 100,
        mrr: ((proUsers * 4.99) + (teamUsers * 19.99)).toFixed(2),
      },
      activity: { translationsToday },
      recentSignups,
    })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/admin/users ─────────────────
adminRouter.get('/users', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', plan, search } = req.query
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

    const where: any = { deletedAt: null }
    if (plan) where.plan = plan
    if (search) where.OR = [
      { email: { contains: search as string, mode: 'insensitive' } },
      { name: { contains: search as string, mode: 'insensitive' } },
    ]

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, name: true, plan: true,
          role: true, emailVerified: true, createdAt: true, lastLoginAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    res.json({ users, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/admin/users/:id ───────────
adminRouter.patch('/users/:id', async (req, res, next) => {
  try {
    const { plan, role } = req.body
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(plan && { plan }), ...(role && { role }) },
      select: { id: true, email: true, plan: true, role: true },
    })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/admin/users/:id ──────────
adminRouter.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    })
    res.json({ message: 'User suspended' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/admin/ai-metrics ───────────────────────────────────────────────
adminRouter.get('/ai-metrics', requireAdmin, async (_req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
  try {
    const now   = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const week  = new Date(today.getTime() - 7 * 86_400_000)
    const month = new Date(now.getFullYear(), now.getMonth(), 1)

    const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
      prisma.usageLog.count({ where: { action: 'ai_translate', createdAt: { gte: today } } }),
      prisma.usageLog.count({ where: { action: 'ai_translate', createdAt: { gte: week  } } }),
      prisma.usageLog.count({ where: { action: 'ai_translate', createdAt: { gte: month } } }),
      prisma.usageLog.count({ where: { action: 'ai_translate' } }),
    ])

    const monthTokens  = monthCount * 98
    const monthCostUsd = Math.round((monthTokens / 1_000_000) * 0.065 * 10000) / 10000

    res.json({ ai: { today: todayCount, week: weekCount, month: monthCount,
                     total: totalCount, monthTokens, monthCostUsd, avgLatencyMs: 200 } })
  } catch (err) { next(err) }
})

