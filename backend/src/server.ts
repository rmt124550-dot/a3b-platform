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
import { selectorsRouter }   from './routes/selectors'
import { affiliatesRouter }  from './routes/affiliates'
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
app.use('/api/selectors',   selectorsRouter)
app.use('/api/affiliates',  affiliatesRouter)

// ─── Seed de selectores en startup (garantiza requiredPlan actualizado) ────────
import { seedSelectorsOnStartup } from './routes/selectors'
seedSelectorsOnStartup().catch((err: any) =>
  logger.warn({ event: 'SELECTORS_STARTUP_SEED_FAILED', error: err?.message })
)

// ─── Error handlers ───────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`🚀 A3B API v1.1.0 running on port ${PORT}`)
  logger.info(`   CORS origins: ${ALLOWED_ORIGINS.join(', ')}`)
  logger.info(`   Stripe key:  ${process.env.STRIPE_SECRET_KEY ? '✅ configurada' : '❌ FALTA'}`)
  logger.info(`   Resend key:  ${process.env.RESEND_API_KEY    ? '✅ configurada' : '❌ FALTA'}`)
  logger.info(`   DB URL:      ${process.env.DATABASE_URL      ? '✅ configurada' : '❌ FALTA'}`)
  logger.info(`   Redis URL:   ${process.env.REDIS_URL         ? '✅ configurada' : '❌ FALTA'}`)
})

export default app

// ─── Job de limpieza automática (cada 24h) ────────────────────────────────────
setInterval(async () => {
  try {
    const cutoff = new Date(Date.now() - 36 * 24 * 60 * 60 * 1000) // 36 días

    // Eliminar usuarios que nunca verificaron su email tras 7 días
    const deleted = await prisma.user.deleteMany({
      where: {
        emailVerified:    false,
        emailVerifyToken: { not: null },
        createdAt:        { lt: cutoff },
        plan:             'free',
      }
    })

    if (deleted.count > 0) {
      logger.info({ event: 'CLEANUP_UNVERIFIED_USERS', count: deleted.count })
    }
  } catch (err: any) {
    logger.warn({ event: 'CLEANUP_JOB_ERROR', error: err.message })
  }
}, 24 * 60 * 60 * 1000) // cada 24 horas
// ─── Cron: emails de aviso de trial (cada 24h) ───────────────────────────────
setInterval(async () => {
  try {
    const now   = new Date()
    const in6d  = new Date(now.getTime() + 6  * 24 * 60 * 60 * 1000)
    const in6dE = new Date(now.getTime() + 7  * 24 * 60 * 60 * 1000)

    // Usuarios cuyo trial expira en exactamente 6 días (ventana de 24h)
    const expiringSoon = await prisma.user.findMany({
      where: {
        trialEndsAt: { gte: in6d, lt: in6dE },
        plan: 'free',
        emailVerified: true,
        deletedAt: null,
      },
      select: { id: true, email: true, name: true, trialEndsAt: true },
    })

    for (const u of expiringSoon) {
      const { sendTrialExpiringEmail } = await import('./services/email')
      sendTrialExpiringEmail(u.email, u.name ?? '', 6).catch(() => {})
    }

    // Usuarios cuyo trial expiró ayer → email de expiración
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const justExpired = await prisma.user.findMany({
      where: {
        trialEndsAt: { gte: yesterday, lt: now },
        plan: 'free',
        emailVerified: true,
        deletedAt: null,
      },
      select: { id: true, email: true, name: true },
    })

    for (const u of justExpired) {
      const { sendTrialExpiredEmail } = await import('./services/email')
      sendTrialExpiredEmail(u.email, u.name ?? '').catch(() => {})
    }

    if (expiringSoon.length + justExpired.length > 0) {
      logger.info({
        event: 'TRIAL_EMAILS_SENT',
        expiringSoon: expiringSoon.length,
        justExpired: justExpired.length,
      })
    }
  } catch (err: any) {
    logger.warn({ event: 'TRIAL_CRON_ERROR', error: err.message })
  }
}, 24 * 60 * 60 * 1000)
// ─── Cron: reporte semanal de uso (cada lunes a las 9am) ─────────────────────
const WEEKLY_MS = 7 * 24 * 60 * 60 * 1000
setInterval(async () => {
  try {
    const now         = new Date()
    const weekAgo     = new Date(now.getTime() - WEEKLY_MS)
    const FRONT       = process.env.FRONTEND_URL ?? 'https://app.a3bhub.cloud'

    // Solo enviar los lunes (día 1 de la semana)
    if (now.getDay() !== 1) return

    // Usuarios activos en trial con actividad esta semana
    const activeTrialUsers = await prisma.user.findMany({
      where: {
        plan:          'free',
        trialEndsAt:   { gt: now },
        emailVerified: true,
        deletedAt:     null,
      },
      select: { id: true, email: true, name: true, trialEndsAt: true, trialDaysLeft: true },
    })

    for (const u of activeTrialUsers) {
      // Contar frases traducidas esta semana
      const weekCount = await prisma.translationHistory.count({
        where: { userId: u.id, createdAt: { gte: weekAgo } },
      })
      if (weekCount === 0) continue // No mostividad → no enviar

      const daysLeft = u.trialEndsAt
        ? Math.max(0, Math.ceil((new Date(u.trialEndsAt).getTime() - now.getTime()) / (1000*60*60*24)))
        : null

      const { sendEmail } = await import('./services/email')
      sendEmail({
        to: u.email,
        subject: `📊 Tu semana en A3B Narrator — ${weekCount} frases narradas`,
        html: \`
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a15;color:#e0e0e0;padding:32px;border-radius:12px;">
            <h2 style="color:#fff;margin:0 0 6px">Tu resumen semanal 📊</h2>
            <p style="color:#888;font-size:14px;margin:0 0 20px">
              Hola\${u.name ? \`, \${u.name.split(' ')[0]}\` : ''}! Esta semana con A3B:
            </p>
            <div style="background:#1a1a2e;border:1px solid #2a2a4e;border-radius:8px;padding:20px;margin:0 0 20px;text-align:center;">
              <div style="font-size:42px;font-weight:900;color:#a5b4fc;">\${weekCount}</div>
              <div style="color:#888;font-size:13px;">frases narradas en español</div>
            </div>
            \${daysLeft !== null && daysLeft <= 7 ? \`
              <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:16px;margin:0 0 20px;">
                <p style="color:#fbbf24;font-size:13px;margin:0;">
                  ⚠️ Tu trial termina en <strong>\${daysLeft} día\${daysLeft===1?'':'s'}</strong>. No pierdas el ritmo.
                </p>
              </div>
            \` : ''}
            <a href="\${FRONT}/dashboard" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
              Ver mi dashboard →
            </a>
            \${daysLeft !== null && daysLeft <= 10 ? \`
              <br><br>
              <a href="\${FRONT}/dashboard/billing" style="display:inline-block;border:1px solid #6366f1;color:#a5b4fc;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;">
                Activar PRO — $4.99/mes
              </a>
            \` : ''}
          </div>
        \`,
      }).catch(() => {})
    }

    logger.info({ event: 'WEEKLY_REPORT_SENT', usersNotified: activeTrialUsers.length })
  } catch (err: any) {
    logger.warn({ event: 'WEEKLY_REPORT_ERROR', error: err.message })
  }
}, WEEKLY_MS)

