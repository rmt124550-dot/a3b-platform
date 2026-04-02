import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { authenticate, requirePlan } from '../middleware/authenticate'
import { validate } from '../middleware/validate'

export const dictionaryRouter = Router()
dictionaryRouter.use(authenticate, requirePlan(['pro', 'team']))

const entrySchema = z.object({
  term: z.string().min(1).max(500),
  translation: z.string().min(1).max(500),
  notes: z.string().max(1000).optional(),
})

// ─── GET /api/dictionary ──────────────────
dictionaryRouter.get('/', async (req, res, next) => {
  try {
    const { q, page = '1', limit = '100' } = req.query
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

    const where: any = {
      userId: req.user!.id,
      ...(q && {
        OR: [
          { term: { contains: q as string, mode: 'insensitive' } },
          { translation: { contains: q as string, mode: 'insensitive' } },
        ],
      }),
    }

    const [items, total] = await Promise.all([
      prisma.userDictionary.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { term: 'asc' },
      }),
      prisma.userDictionary.count({ where }),
    ])

    res.json({ items, total })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/dictionary ─────────────────
dictionaryRouter.post('/', validate(entrySchema), async (req, res, next) => {
  try {
    const item = await prisma.userDictionary.create({
      data: { userId: req.user!.id, ...req.body },
    })
    res.status(201).json({ item })
  } catch (err) {
    if ((err as any).code === 'P2002') {
      // Unique constraint — actualizar en lugar de error
      const updated = await prisma.userDictionary.update({
        where: { userId_term: { userId: req.user!.id, term: req.body.term } },
        data: { translation: req.body.translation, notes: req.body.notes },
      })
      return res.json({ item: updated })
    }
    next(err)
  }
})

// ─── PATCH /api/dictionary/:id ────────────
dictionaryRouter.patch('/:id', validate(entrySchema.partial()), async (req, res, next) => {
  try {
    const item = await prisma.userDictionary.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: req.body,
    })
    if (item.count === 0) return res.status(404).json({ error: 'Entry not found' })
    res.json({ message: 'Updated' })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/dictionary/:id ───────────
dictionaryRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.userDictionary.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    })
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/dictionary/lookup?term= ─────
// La extensión consulta esto para aplicar traducciones personales
dictionaryRouter.get('/lookup', async (req, res, next) => {
  try {
    const { term } = req.query
    if (!term) return res.status(400).json({ error: 'term required' })

    const entry = await prisma.userDictionary.findFirst({
      where: {
        userId: req.user!.id,
        term: { equals: term as string, mode: 'insensitive' },
      },
    })

    res.json({ entry })
  } catch (err) {
    next(err)
  }
})
