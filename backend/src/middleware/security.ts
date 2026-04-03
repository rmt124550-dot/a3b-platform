import { Request, Response, NextFunction } from 'express'
import { rateLimit } from 'express-rate-limit'
import { redis } from '../utils/redis'
import { securityLog } from '../utils/logger'

// ─── Rate limiters especializados ────────────────────────────────────────────

// Auth: muy estricto — 10 intentos por 15 min por IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,        // solo cuenta los fallidos
  keyGenerator: (req) => req.ip ?? 'unknown',
  handler: (req, res) => {
    securityLog('RATE_LIMIT_AUTH', {
      ip: req.ip,
      path: req.path,
      userAgent: req.headers['user-agent'],
    })
    res.status(429).json({
      error: 'Too many authentication attempts. Try again in 15 minutes.',
      retryAfter: 15 * 60,
    })
  },
})

// Translate: 60 por hora para plan free
export const translateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? req.ip ?? 'unknown',
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Translation limit reached. Upgrade to PRO for unlimited translations.',
      upgrade: true,
      retryAfter: 3600,
    })
  },
})

// Global API: 200 por 15 min
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

// ─── Detectar y bloquear IPs maliciosas (Redis-based) ──────────────────────

const BLOCK_THRESHOLD = 50   // req fallidos antes de bloquear
const BLOCK_DURATION  = 3600 // segundos (1 hora)

export async function blockSuspiciousIPs(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? 'unknown'
  const key = `blocked:${ip}`

  try {
    const blocked = await redis.get(key)
    if (blocked) {
      securityLog('BLOCKED_IP_REQUEST', { ip, path: req.path })
      return res.status(403).json({ error: 'Access denied' })
    }
    next()
  } catch {
    next() // Si Redis falla, no bloquear
  }
}

export async function trackFailedRequests(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res)
  res.json = function (data) {
    if (res.statusCode === 401 || res.statusCode === 403) {
      const ip = req.ip ?? 'unknown'
      const key = `fail:${ip}`
      redis.incr(key).then(count => {
        redis.expire(key, 3600)
        if (count >= BLOCK_THRESHOLD) {
          redis.setex(`blocked:${ip}`, BLOCK_DURATION, '1')
          securityLog('IP_AUTO_BLOCKED', { ip, failCount: count })
        }
      }).catch(() => {})
    }
    return originalJson(data)
  }
  next()
}

// ─── Sanitizar inputs (prevenir NoSQL injection / XSS en campos) ────────────

export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  // Eliminar $ y . en keys del body (MongoDB injection)
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body)
  }
  next()
}

function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Limitar longitud máxima
    return obj.slice(0, 10000)
  }
  if (Array.isArray(obj)) {
    return obj.slice(0, 100).map(sanitizeObject)
  }
  if (obj && typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(obj)) {
      if (!key.startsWith('$') && !key.includes('.')) {
        cleaned[key] = sanitizeObject(val)
      }
    }
    return cleaned
  }
  return obj
}

// ─── Security headers adicionales ────────────────────────────────────────────

export function additionalSecurityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('X-Powered-By-Override', 'A3B Platform')
  res.removeHeader('X-Powered-By')
  next()
}

// ─── Validar Content-Type en POST/PUT/PATCH ───────────────────────────────

export function requireJsonContentType(req: Request, res: Response, next: NextFunction) {
  if (['POST','PUT','PATCH'].includes(req.method)) {
    const ct = req.headers['content-type'] ?? ''
    if (!ct.includes('application/json') && !ct.includes('multipart/form-data')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' })
    }
  }
  next()
}

// ─── Detectar User-Agents sospechosos ────────────────────────────────────────

const BLOCKED_UAS = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab']

export function blockMaliciousAgents(req: Request, res: Response, next: NextFunction) {
  const ua = (req.headers['user-agent'] ?? '').toLowerCase()
  if (BLOCKED_UAS.some(bad => ua.includes(bad))) {
    securityLog('MALICIOUS_UA_BLOCKED', { ua, ip: req.ip, path: req.path })
    return res.status(403).json({ error: 'Access denied' })
  }
  next()
}
