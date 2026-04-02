import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { authenticate, requirePlan } from '../middleware/authenticate'
import { validate } from '../middleware/validate'

export const historyRouter = Router()
historyRouter.use(authenticate)

const saveSchema = z.object({
  originalText: z.string().min(1).max(2000),
  translatedText: z.string().min(1).max(2000),
  sourceLang: z.string().default('en'),
  targetLang: z.string().default('es'),
  platform: z.enum(['coursera', 'youtube', 'udemy', 'edx', 'linkedin']).default('coursera'),
  courseUrl: z.string().url().optional(),
})

// ─── GET /api/history ─────────────────────
// Free: sin acceso | Pro: 30 días | Team: ilimitado
historyRouter.get('/', requirePlan(['pro', 'team']), async (req, res, next) => {
  try {
    const { page = '1', limit = '50', platform, q } = req.query
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

    // Pro: solo últimos 30 días
    const dateFilter = req.user!.plan === 'pro'
      ? { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      : undefined

    const where: any = {
      userId: req.user!.id,
      ...(dateFilter && { createdAt: dateFilter }),
      ...(platform && { platform }),
      ...(q && {
        OR: [
          { originalText: { contains: q as string, mode: 'insensitive' } },
          { translatedText: { contains: q as string, mode: 'insensitive' } },
        ],
      }),
    }

    const [items, total] = await Promise.all([
      prisma.translationHistory.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.translationHistory.count({ where }),
    ])

    res.json({
      items,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string)),
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/history ────────────────────
historyRouter.post('/', requirePlan(['pro', 'team']), validate(saveSchema), async (req, res, next) => {
  try {
    // Pro: límite de 30 días — limpieza automática de los más viejos
    if (req.user!.plan === 'pro') {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      await prisma.translationHistory.deleteMany({
        where: { userId: req.user!.id, createdAt: { lt: cutoff } },
      })
    }

    const item = await prisma.translationHistory.create({
      data: { userId: req.user!.id, ...req.body },
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/history/:id ──────────────
historyRouter.delete('/:id', requirePlan(['pro', 'team']), async (req, res, next) => {
  try {
    await prisma.translationHistory.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    })
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/history (all) ────────────
historyRouter.delete('/', requirePlan(['pro', 'team']), async (req, res, next) => {
  try {
    const { count } = await prisma.translationHistory.deleteMany({
      where: { userId: req.user!.id },
    })
    res.json({ message: `Deleted ${count} items` })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/history/export ──────────────
// Exportar como SRT (Team only)
historyRouter.get('/export/srt', requirePlan(['team']), async (req, res, next) => {
  try {
    const items = await prisma.translationHistory.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    })

    const srt = items.map((item, i) => {
      const start = formatSRTTime(i * 3000)
      const end = formatSRTTime((i + 1) * 3000)
      return `${i + 1}\n${start} --> ${end}\n${item.translatedText}\n`
    }).join('\n')

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="subtitles.srt"')
    res.send(srt)
  } catch (err) {
    next(err)
  }
})

function formatSRTTime(ms: number): string {
  const h = Math.floor(ms / 3600000).toString().padStart(2, '0')
  const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0')
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  const mss = (ms % 1000).toString().padStart(3, '0')
  return `${h}:${m}:${s},${mss}`
}
