import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { redis } from '../utils/redis'
import { prisma } from '../utils/prisma'
import { securityLog } from '../utils/logger'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; plan: string; role: string }
    }
  }
}

// Cache de usuario para no ir a DB en cada request (TTL 60s)
async function getCachedUser(userId: string) {
  const key = `user_cache:${userId}`
  try {
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)
  } catch {}

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, email: true, plan: true, role: true, deletedAt: true },
  })

  if (user && !user.deletedAt) {
    try {
      await redis.setex(key, 60, JSON.stringify(user))
    } catch {}
  }
  return user
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.slice(7)

  // Verificar si el token está en blacklist (logout)
  try {
    const blacklisted = await redis.exists(`blacklist:${token}`)
    if (blacklisted) {
      return res.status(401).json({ error: 'Token has been revoked' })
    }
  } catch {}

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as { sub: string }

    const user = await getCachedUser(payload.sub)

    if (!user || user.deletedAt) {
      securityLog('AUTH_DELETED_USER', { userId: payload.sub, ip: req.ip })
      return res.status(401).json({ error: 'User not found or suspended' })
    }

    req.user = { id: user.id, email: user.email, plan: user.plan, role: user.role }
    next()
  } catch (err: unknown) {
    const errName = err instanceof Error ? err.name : 'UnknownError'
    if (errName === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' })
    }
    securityLog('INVALID_TOKEN', { ip: req.ip, path: req.path })
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    securityLog('UNAUTHORIZED_ADMIN_ACCESS', { userId: req.user?.id, ip: req.ip, path: req.path })
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export function requirePlan(...plans: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!plans.includes(req.user?.plan ?? '')) {
      return res.status(403).json({
        error:   `This feature requires ${plans.join(' or ')} plan`,
        upgrade: true,
        current: req.user?.plan,
        required: plans,
      })
    }
    next()
  }
}
