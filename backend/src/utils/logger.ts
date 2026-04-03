import winston from 'winston'

const { combine, timestamp, errors, json, colorize, simple } = winston.format

const isProd = process.env.NODE_ENV === 'production'

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'a3b-api', version: '1.0.0' },
  transports: [
    new winston.transports.Console({
      format: isProd ? json() : combine(colorize(), simple()),
    }),
  ],
})

// Helpers de seguridad
export const securityLog = (event: string, data: Record<string, unknown>) =>
  logger.warn({ type: 'SECURITY', event, ...data })

export const auditLog = (action: string, userId: string, data: Record<string, unknown> = {}) =>
  logger.info({ type: 'AUDIT', action, userId, ...data })
