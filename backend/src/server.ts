import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'

import { authRouter } from './routes/auth'
import { userRouter } from './routes/user'
import { translateRouter } from './routes/translate'
import { historyRouter } from './routes/history'
import { dictionaryRouter } from './routes/dictionary'
import { billingRouter } from './routes/billing'
import { adminRouter } from './routes/admin'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

const app = express()
const PORT = process.env.PORT || 4000

// ─── Security ─────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))

// ─── Stripe webhook (raw body ANTES de json) ─

// ─── Middleware ────────────────────────────
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('combined'))

// ─── Rate limiting global ─────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// ─── Health check ─────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// ─── Rutas ────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/translate', translateRouter)
app.use('/api/history', historyRouter)
app.use('/api/dictionary', dictionaryRouter)
app.use('/api/billing', billingRouter)
app.use('/api/admin', adminRouter)

// ─── Error handlers ───────────────────────
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 A3B API running on port ${PORT}`)
})

export default app
