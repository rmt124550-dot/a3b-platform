import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { prisma } from './utils/prisma'
import { redis }  from './utils/redis'
import { authRouter }       from './routes/auth'
import { userRouter }       from './routes/user'
import { translateRouter }  from './routes/translate'
import { historyRouter }    from './routes/history'
import { dictionaryRouter } from './routes/dictionary'
import { billingRouter, webhookRouter } from './routes/billing'
import { adminRouter }      from './routes/admin'
import { errorHandler }     from './middleware/errorHandler'
import { notFound }         from './middleware/notFound'
import { logger }           from './utils/logger'
import {
  globalLimiter,
  blockSuspiciousIPs,
  trackFailedRequests,
  sanitizeInput,
  additionalSecurityHeaders,
  requireJsonContentType,
  blockMaliciousAgents,
} from './middleware/security'

const app  = express()
const PORT = process.env.PORT || 4000

// ─── Confiar en Traefik/Cloudflare proxy ───────────────────────────────────
app.set('trust proxy', 1)

// ─── Security headers (Helmet + custom) ───────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge:            31536000,
    includeSubDomains: true,
    preload:           true,
  },
  crossOriginEmbedderPolicy:  false,
  crossOriginResourcePolicy:  { policy: 'cross-origin' },
}))
app.use(additionalSecurityHeaders)

// ─── CORS ──────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'https://app.a3bhub.cloud',
  'https://a3bhub.cloud',
  'https://www.a3bhub.cloud',
  'chrome-extension://',          // extensión Chrome
].filter(Boolean) as string[]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)   // curl, Postman, extensión
    const ok = ALLOWED_ORIGINS.some(allowed =>
      origin === allowed || origin.startsWith('chrome-extension://')
    )
    if (ok) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods:     ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization','X-Request-ID'],
  exposedHeaders:['X-Request-ID','RateLimit-Limit','RateLimit-Remaining'],
  maxAge: 86400,
}))

// ─── Early threat detection ────────────────────────────────────────────────
app.use(blockMaliciousAgents)
app.use(blockSuspiciousIPs)

// ─── Stripe webhook ANTES del json parser ─────────────────────────────────
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }))

// ─── Body parsing + sanitización ──────────────────────────────────────────
app.use(compression())
app.use(express.json({ limit: '1mb' }))          // reducido de 10mb
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(requireJsonContentType)
app.use(sanitizeInput)
app.use(trackFailedRequests)

// ─── Request ID para trazabilidad ─────────────────────────────────────────
app.use((req, res, next) => {
  const id = req.headers['x-request-id'] as string || crypto.randomUUID()
  req.headers['x-request-id'] = id
  res.setHeader('X-Request-ID', id)
  next()
})

// ─── Logging HTTP ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info({
    method:    req.method,
    path:      req.path,
    ip:        req.ip,
    ua:        req.headers['user-agent']?.slice(0,80),
    requestId: req.headers['x-request-id'],
  })
  next()
})

// ─── Rate limiting global ──────────────────────────────────────────────────
app.use('/api/', globalLimiter)


// ─── Stats públicos (landing page) ────────────────────────────────────────
app.get('/stats', async (_req, res) => {
  try {
    const cached = await redis.get('public:stats')
    if (cached) return res.json(JSON.parse(cached))

    const [users, txCount] = await Promise.all([
      prisma.user.count(),
      prisma.translationHistory.count().catch(() => 0),
    ])

    const stats = {
      users,
      translations: txCount,
      platforms: 8,
      languages: 10,
      updatedAt: new Date().toISOString(),
    }

    await redis.setex('public:stats', 300, JSON.stringify(stats))
    res.json(stats)
  } catch {
    res.json({ users: 0, translations: 0, platforms: 8, languages: 10 })
  }
})

// ─── Health check (sin rate limit, sin auth) ──────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp:  new Date().toISOString(),
    version:   '1.1.0',
    uptime:    Math.floor(process.uptime()),
  })
})

// ─── Rutas ────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRouter)
app.use('/api/user',       userRouter)
app.use('/api/translate',  translateRouter)
app.use('/api/history',    historyRouter)
app.use('/api/dictionary', dictionaryRouter)
app.use('/api/billing/webhook', webhookRouter)
app.use('/api/billing',    billingRouter)
app.use('/api/admin',      adminRouter)

// ─── Error handlers ───────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`🚀 A3B API v1.1.0 running on port ${PORT}`)
  logger.info(`   CORS origins: ${ALLOWED_ORIGINS.join(', ')}`)
})

export default app

