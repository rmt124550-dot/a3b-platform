import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger'

interface AppError extends Error {
  status?:  number
  code?:    string
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      error:   'Validation failed',
      details: err.errors.map(e => ({
        field:   e.path.join('.'),
        message: e.message,
        code:    e.code,
      })),
    })
  }

  // Prisma unique constraint
  if ((err as any).code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' })
  }

  // Prisma not found
  if ((err as any).code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  // CORS
  if (err.message?.includes('CORS')) {
    return res.status(403).json({ error: 'CORS: Origin not allowed' })
  }

  // Log unexpected errors
  const statusCode = err.status ?? 500
  logger.error({
    event:     'UNHANDLED_ERROR',
    message:   err.message,
    stack:     err.stack,
    path:      req.path,
    method:    req.method,
    ip:        req.ip,
    requestId: req.headers['x-request-id'],
    userId:    req.user?.id,
  })

  const isProd = process.env.NODE_ENV === 'production'
  res.status(statusCode).json({
    error:     statusCode >= 500 ? 'Internal server error' : err.message,
    requestId: req.headers['x-request-id'],
    ...(isProd ? {} : { stack: err.stack }),
  })
}
