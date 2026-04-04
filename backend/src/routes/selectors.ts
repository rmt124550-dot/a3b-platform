import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { redis  } from '../utils/redis'
import { authenticate, requireAdmin } from '../middleware/authenticate'
import { logger } from '../utils/logger'

export const selectorsRouter = Router()

const CACHE_KEY = 'public:selectors'
const CACHE_TTL = 60 * 60 * 6  // 6 horas

// Selectores por defecto — fallback si la DB está vacía
const DEFAULT_SELECTORS = [
  {
    platform: 'coursera',
    displayName: 'Coursera',
    hostPattern: '*.coursera.org',
    enabled: true,
    priority: 100,
    selectors: [
      '.rc-SubtitleText',
      '[class*="SubtitleText"]',
      '[class*="subtitle-text"]',
      '[class*="subtitles-display"]',
      '.rc-VideoSubtitle',
      '[data-e2e="subtitle-text"]',
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      '.caption-text',
      '[class*="transcript-item-body"]',
      '.rc-TranscriptItem .rc-PhraseText',
    ],
  },
  {
    platform: 'youtube',
    displayName: 'YouTube',
    hostPattern: '*.youtube.com',
    enabled: true,
    priority: 90,
    selectors: [
      '.ytp-caption-segment',
      '.caption-window .caption-visual-line',
      '.ytp-subtitles-player-content span',
      '[class*="ytp-caption"]',
    ],
  },
  {
    platform: 'udemy',
    displayName: 'Udemy',
    hostPattern: '*.udemy.com',
    enabled: true,
    priority: 80,
    selectors: [
      '.captions-display--captions-container--DC8Hq span',
      '[class*="captions-display"] span',
      '[class*="caption-cue"] span',
      '.well--container--2BQKM',
      '[data-purpose="captions-cue-text"]',
    ],
  },
  {
    platform: 'edx',
    displayName: 'edX',
    hostPattern: '*.edx.org',
    enabled: true,
    priority: 70,
    selectors: [
      '.subtitles-menu li.current',
      '.video-subtitle span',
      '[class*="subtitle"] p',
      '.xblock-student_view .subtitles li.current',
    ],
  },
  {
    platform: 'linkedin',
    displayName: 'LinkedIn Learning',
    hostPattern: '*.linkedin.com',
    enabled: true,
    priority: 60,
    selectors: [
      '.captions__text',
      '[class*="captions__text"]',
      '.classroom-captions__text',
      '[data-control-name="captions"]',
    ],
  },
]

// ─── Seed automático si la tabla está vacía ─────────────────────────────────
async function seedIfEmpty() {
  try {
    const count = await prisma.platformSelector.count()
    if (count > 0) return

    logger.info({ event: 'SELECTORS_SEED', message: 'Seeding default platform selectors' })
    await Promise.all(
      DEFAULT_SELECTORS.map(s =>
        prisma.platformSelector.upsert({
          where:  { platform: s.platform },
          create: { ...s, selectors: JSON.stringify(s.selectors) },
          update: {},
        })
      )
    )
    logger.info({ event: 'SELECTORS_SEED_OK', count: DEFAULT_SELECTORS.length })
  } catch (err: any) {
    logger.warn({ event: 'SELECTORS_SEED_SKIP', error: err.message })
  }
}

// ─── GET /api/selectors ─────────────────────────────────────────────────────
// Público — sin auth. La extensión lo llama al iniciar.
// Respuesta cacheada en Redis 6h.
selectorsRouter.get('/', async (_req, res, next) => {
  try {
    // Intentar caché Redis
    try {
      const cached = await redis.get(CACHE_KEY)
      if (cached) {
        return res.json(JSON.parse(cached))
      }
    } catch {}

    // Seed si tabla vacía
    await seedIfEmpty()

    const rows = await prisma.platformSelector.findMany({
      where:   { enabled: true },
      orderBy: { priority: 'desc' },
    })

    const payload = {
      version:   Date.now(),
      updatedAt: new Date().toISOString(),
      platforms: rows.map(r => ({
        platform:    r.platform,
        displayName: r.displayName,
        hostPattern: r.hostPattern,
        selectors:   JSON.parse(r.selectors),
        priority:    r.priority,
      })),
    }

    // Guardar en Redis
    try { await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(payload)) } catch {}

    res.json(payload)
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/selectors/platform/:platform ──────────────────────────────────
// Selectores de una sola plataforma
selectorsRouter.get('/platform/:platform', async (req, res, next) => {
  try {
    const row = await prisma.platformSelector.findUnique({
      where: { platform: req.params.platform },
    })
    if (!row || !row.enabled) {
      return res.status(404).json({ error: 'Platform not found or disabled' })
    }
    res.json({
      platform:    row.platform,
      displayName: row.displayName,
      hostPattern: row.hostPattern,
      selectors:   JSON.parse(row.selectors),
      priority:    row.priority,
      updatedAt:   row.updatedAt,
    })
  } catch (err) {
    next(err)
  }
})

// ─── PUT /api/selectors/:platform ─── ADMIN ONLY ────────────────────────────
// Actualiza selectores de una plataforma e invalida caché
selectorsRouter.put('/:platform', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { platform } = req.params
    const { selectors, displayName, hostPattern, enabled, priority, notes } = req.body

    if (!selectors || !Array.isArray(selectors) || selectors.length === 0) {
      return res.status(400).json({ error: 'selectors debe ser un array no vacío de strings CSS' })
    }

    const data: any = { selectors: JSON.stringify(selectors) }
    if (displayName  !== undefined) data.displayName  = displayName
    if (hostPattern  !== undefined) data.hostPattern  = hostPattern
    if (enabled      !== undefined) data.enabled      = Boolean(enabled)
    if (priority     !== undefined) data.priority     = Number(priority)
    if (notes        !== undefined) data.notes        = notes

    const row = await prisma.platformSelector.upsert({
      where:  { platform },
      create: {
        platform,
        displayName:  displayName ?? platform,
        hostPattern:  hostPattern ?? `*.${platform}.com`,
        selectors:    JSON.stringify(selectors),
        enabled:      enabled ?? true,
        priority:     priority ?? 50,
        notes:        notes ?? null,
      },
      update: data,
    })

    // Invalidar caché Redis → la próxima petición sirve datos frescos
    try { await redis.del(CACHE_KEY) } catch {}

    logger.info({ event: 'SELECTORS_UPDATED', platform, count: selectors.length })
    res.json({
      ok:       true,
      platform: row.platform,
      count:    selectors.length,
      updatedAt: row.updatedAt,
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/selectors/invalidate-cache ─── ADMIN ONLY ────────────────────
selectorsRouter.post('/invalidate-cache', authenticate, requireAdmin, async (_req, res) => {
  try { await redis.del(CACHE_KEY) } catch {}
  res.json({ ok: true, message: 'Cache invalidated — next request will fetch fresh selectors' })
})
