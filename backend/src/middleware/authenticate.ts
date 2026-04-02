import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; plan: string; role: string }
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, plan: true, role: true, deletedAt: true },
    })

    if (!user || user.deletedAt) {
      return res.status(401).json({ error: 'User not found or suspended' })
    }

    req.user = { id: user.id, email: user.email, plan: user.plan, role: user.role }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export function requirePlan(plans: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!plans.includes(req.user?.plan ?? '')) {
      return res.status(403).json({
        error: `This feature requires ${plans.join(' or ')} plan`,
        upgrade: true,
      })
    }
    next()
  }
}
