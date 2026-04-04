import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { redis  } from '../utils/redis'
import { authenticate, requireAdmin } from '../middleware/authenticate'
import { logger } from '../utils/logger'

export const selectorsRouter = Router()

const CACHE_KEY = 'public:selectors'
const CACHE_TTL = 60 * 60 * 6  // 6 horas

// ─── Seed por defecto ────────────────────────────────────────────────────────
const DEFAULT_SELECTORS = [
  {
    platform: 'coursera', displayName: 'Coursera',
    hostPattern: '*.coursera.org', requiredPlan: 'free', priority: 100,
    selectors: [
      '.rc-SubtitleText', '[class*="SubtitleText"]', '[class*="subtitle-text"]',
      '[class*="subtitles-display"]', '.rc-VideoSubtitle', '[data-e2e="subtitle-text"]',
      '.vjs-text-track-cue', '.vjs-text-track-cue span', '.caption-text',
      '[class*="transcript-item-body"]', '.rc-TranscriptItem .rc-PhraseText',
    ],
  },
  {
    platform: 'youtube', displayName: 'YouTube',
    hostPattern: '*.youtube.com', requiredPlan: 'pro', priority: 90,
    selectors: [
      '.ytp-caption-segment', '.caption-window .caption-visual-line',
      '.ytp-subtitles-player-content span', '[class*="ytp-caption"]',
    ],
  },
  {
    platform: 'udemy', displayName: 'Udemy',
    hostPattern: '*.udemy.com', requiredPlan: 'pro', priority: 80,
    selectors: [
      '.captions-display--captions-container--DC8Hq span',
      '[class*="captions-display"] span', '[class*="caption-cue"] span',
      '.well--container--2BQKM', '[data-purpose="captions-cue-text"]',
    ],
  },
  {
    platform: 'edx', displayName: 'edX',
    hostPattern: '*.edx.org', requiredPlan: 'pro', priority: 70,
    selectors: [
      '.subtitles-menu li.current', '.video-subtitle span',
      '[class*="subtitle"] p', '.xblock-student_view .subtitles li.current',
    ],
  },
  {
    platform: 'linkedin', displayName: 'LinkedIn Learning',
    hostPattern: '*.linkedin.com', requiredPlan: 'pro', priority: 60,
    selectors: [
      '.captions__text', '[class*="captions__text"]',
      '.classroom-captions__text', '[data-control-name="captions"]',
    ],
  },
]

async function seedIfEmpty() {
  // Siempre upsert para garantizar requiredPlan correcto tras migraciones
  await Promise.all(DEFAULT_SELECTORS.map(s =>
    prisma.platformSelector.upsert({
      where:  { platform: s.platform },
      create: { ...s, selectors: JSON.stringify(s.selectors) },
      update: {
        requiredPlan: s.requiredPlan,
        displayName:  s.displayName,
        hostPattern:  s.hostPattern,
        selectors:    JSON.stringify(s.selectors),
        priority:     s.priority,
      },
    })
  ))
  logger.info({ event: 'SELECTORS_SEED_OK', count: DEFAULT_SELECTORS.length })
}

/** Llamado desde server.ts en startup — actualiza DB e invalida caché */
export async function seedSelectorsOnStartup() {
  try {
    await seedIfEmpty()
    // Invalidar caché Redis para que el próximo GET sirva datos frescos
    try { await redis.del(CACHE_KEY) } catch {}
    logger.info({ event: 'SELECTORS_STARTUP_SEED_DONE' })
  } catch (err: any) {
    logger.warn({ event: 'SELECTORS_STARTUP_SEED_FAILED', error: err.message })
  }
}

// ─── GET /api/selectors ──────────────────────────────────────────────────────
// Público — sin auth. Incluye requiredPlan para que la extensión decida.
selectorsRouter.get('/', async (_req, res, next) => {
  try {
    try {
      const cached = await redis.get(CACHE_KEY)
      if (cached) return res.json(JSON.parse(cached))
    } catch {}

    await seedIfEmpty()

    const rows = await prisma.platformSelector.findMany({
      where:   { enabled: true },
      orderBy: { priority: 'desc' },
    })

    const payload = {
      version:   Date.now(),
      updatedAt: new Date().toISOString(),
      platforms: rows.map(r => ({
        platform:     r.platform,
        displayName:  r.displayName,
        hostPattern:  r.hostPattern,
        requiredPlan: r.requiredPlan,   // "free" | "pro" | "team"
        selectors:    JSON.parse(r.selectors),
        priority:     r.priority,
      })),
    }

    try { await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(payload)) } catch {}
    res.json(payload)
  } catch (err) { next(err) }
})

// ─── GET /api/selectors/platform/:platform ───────────────────────────────────
selectorsRouter.get('/platform/:platform', async (req, res, next) => {
  try {
    const row = await prisma.platformSelector.findUnique({
      where: { platform: req.params.platform },
    })
    if (!row || !row.enabled) {
      return res.status(404).json({ error: 'Platform not found or disabled' })
    }
    res.json({
      platform:     row.platform,
      displayName:  row.displayName,
      hostPattern:  row.hostPattern,
      requiredPlan: row.requiredPlan,
      selectors:    JSON.parse(row.selectors),
      priority:     row.priority,
      updatedAt:    row.updatedAt,
    })
  } catch (err) { next(err) }
})

// ─── PUT /api/selectors/:platform ─── ADMIN ONLY ────────────────────────────
selectorsRouter.put('/:platform', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { platform } = req.params
    const { selectors, displayName, hostPattern, requiredPlan, enabled, priority, notes } = req.body

    if (!selectors || !Array.isArray(selectors) || selectors.length === 0) {
      return res.status(400).json({ error: 'selectors debe ser un array no vacío' })
    }
    if (requiredPlan && !['free','pro','team'].includes(requiredPlan)) {
      return res.status(400).json({ error: 'requiredPlan debe ser: free | pro | team' })
    }

    const data: any = { selectors: JSON.stringify(selectors) }
    if (displayName  !== undefined) data.displayName  = displayName
    if (hostPattern  !== undefined) data.hostPattern  = hostPattern
    if (requiredPlan !== undefined) data.requiredPlan = requiredPlan
    if (enabled      !== undefined) data.enabled      = Boolean(enabled)
    if (priority     !== undefined) data.priority     = Number(priority)
    if (notes        !== undefined) data.notes        = notes

    const row = await prisma.platformSelector.upsert({
      where:  { platform },
      create: {
        platform,
        displayName:  displayName ?? platform,
        hostPattern:  hostPattern ?? `*.${platform}.com`,
        requiredPlan: requiredPlan ?? 'free',
        selectors:    JSON.stringify(selectors),
        enabled:      enabled ?? true,
        priority:     priority ?? 50,
        notes:        notes ?? null,
      },
      update: data,
    })

    try { await redis.del(CACHE_KEY) } catch {}

    logger.info({ event: 'SELECTORS_UPDATED', platform, requiredPlan: row.requiredPlan, count: selectors.length })
    res.json({ ok: true, platform: row.platform, requiredPlan: row.requiredPlan, count: selectors.length })
  } catch (err) { next(err) }
})

// ─── POST /api/selectors/invalidate-cache ─── ADMIN ONLY ────────────────────
selectorsRouter.post('/invalidate-cache', authenticate, requireAdmin, async (_req, res) => {
  try { await redis.del(CACHE_KEY) } catch {}
  res.json({ ok: true, message: 'Cache invalidated' })
})

// ─── POST /api/selectors/run-migration ──────────────────────────────────────
// Endpoint de migración one-shot protegido con token secreto.
// Actualiza requiredPlan en filas existentes e invalida caché.
// Llama UNA VEZ después del deploy, luego ignora peticiones repetidas.
const MIGRATION_TOKEN = process.env.MIGRATION_SECRET ?? 'a3b-migration-2026'
let migrationDone = false

selectorsRouter.post('/run-migration', async (req, res) => {
  const token = req.headers['x-migration-token'] ?? req.body?.token
  if (token !== MIGRATION_TOKEN) {
    return res.status(403).json({ error: 'Invalid migration token' })
  }
  if (migrationDone) {
    return res.json({ ok: true, message: 'Migration already ran this session', skipped: true })
  }

  try {
    // Definir requiredPlan para cada plataforma
    const planMap: Record<string, string> = {
      coursera:  'free',
      youtube:   'pro',
      udemy:     'pro',
      edx:       'pro',
      linkedin:  'pro',
    }

    const results: string[] = []
    for (const [platform, plan] of Object.entries(planMap)) {
      const updated = await prisma.platformSelector.updateMany({
        where: { platform },
        data:  { requiredPlan: plan },
      })
      results.push(`${platform}=${plan} (${updated.count} rows)`)
    }

    // Invalidar caché Redis
    try { await redis.del(CACHE_KEY) } catch {}

    migrationDone = true
    logger.info({ event: 'SELECTORS_MIGRATION_OK', results })
    res.json({ ok: true, results, message: 'requiredPlan updated + Redis cache cleared' })
  } catch (err: any) {
    logger.error({ event: 'SELECTORS_MIGRATION_FAILED', error: err.message })
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/selectors/promote-admin ──────────────────────────────────────
// ONE-SHOT: promueve un userId a role=admin. Protegido con MIGRATION_TOKEN.
// Eliminar este endpoint después de usarlo.
selectorsRouter.post('/promote-admin', async (req, res) => {
  const token  = req.headers['x-migration-token'] ?? req.body?.token
  const userId = req.body?.userId
  if (token !== MIGRATION_TOKEN) {
    return res.status(403).json({ error: 'Invalid token' })
  }
  if (!userId) return res.status(400).json({ error: 'userId required' })
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data:  { role: 'admin' },
      select:{ id: true, email: true, role: true },
    })
    logger.info({ event: 'USER_PROMOTED_ADMIN', userId: user.id, email: user.email })
    res.json({ ok: true, user })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})
