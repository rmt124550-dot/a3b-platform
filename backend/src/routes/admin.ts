import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { authenticate, requireAdmin } from '../middleware/authenticate'

export const adminRouter = Router()

// ─── GET /api/admin/metrics ───────────────────────────────────────────────────
adminRouter.get('/metrics', requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now   = new Date()
    const month = new Date(now.getFullYear(), now.getMonth(), 1)

    const [total, byPlan, newMonth, revenue] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.groupBy({ by: ['plan'], where: { deletedAt: null }, _count: true }),
      prisma.user.count({ where: { deletedAt: null, createdAt: { gte: month } } }),
      prisma.usageLog.count({ where: { action: 'checkout_completed', createdAt: { gte: month } } }),
    ])

    const planCounts = Object.fromEntries(byPlan.map(p => [p.plan, p._count]))

    res.json({
      users: {
        total,
        free:  planCounts['free']  ?? 0,
        pro:   planCounts['pro']   ?? 0,
        team:  planCounts['team']  ?? 0,
        newThisMonth: newMonth,
      },
      revenue: {
        checkoutsThisMonth: revenue,
        mrr: ((planCounts['pro'] ?? 0) * 4.99 + (planCounts['team'] ?? 0) * 19.99).toFixed(2),
        arr: (((planCounts['pro'] ?? 0) * 4.99 + (planCounts['team'] ?? 0) * 19.99) * 12).toFixed(2),
      },
    })
  } catch (err) { next(err) }
})

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
adminRouter.get('/users', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '25', plan, search } = req.query
    const skip  = (parseInt(page as string) - 1) * parseInt(limit as string)
    const where: Record<string, unknown> = { deletedAt: null }
    if (plan)   where.plan = plan
    if (search) where.OR = [
      { email: { contains: search as string, mode: 'insensitive' } },
      { name:  { contains: search as string, mode: 'insensitive' } },
    ]

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, plan: true, role: true,
                  emailVerified: true, createdAt: true, lastLoginAt: true },
      }),
      prisma.user.count({ where }),
    ])

    res.json({ users, total, page: parseInt(page as string),
               pages: Math.ceil(total / parseInt(limit as string)) })
  } catch (err) { next(err) }
})

// ─── PATCH /api/admin/users/:id ───────────────────────────────────────────────
adminRouter.patch('/users/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plan, role } = req.body
    const user = await prisma.user.update({
      where:  { id: req.params.id },
      data:   { ...(plan && { plan }), ...(role && { role }) },
      select: { id: true, email: true, plan: true, role: true },
    })
    res.json({ user })
  } catch (err) { next(err) }
})

// ─── DELETE /api/admin/users/:id ──────────────────────────────────────────────
adminRouter.delete('/users/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data:  { deletedAt: new Date() },
    })
    res.json({ message: 'User suspended' })
  } catch (err) { next(err) }
})

// ─── GET /api/admin/ai-metrics ────────────────────────────────────────────────
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

    const monthTokens  = monthCount * 98
    const monthCostUsd = Math.round((monthTokens / 1_000_000) * 0.065 * 10000) / 10000

    res.json({ ai: {
      today: todayCount, week: weekCount, month: monthCount, total: totalCount,
      monthTokens, monthCostUsd, avgLatencyMs: 200,
    }})
  } catch (err) { next(err) }
})
