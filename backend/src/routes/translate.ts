import { Router } from 'express'
import { z } from 'zod'
import { redis } from '../utils/redis'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { rateLimit } from 'express-rate-limit'

export const translateRouter = Router()

// ─── Rate limits por plan ─────────────────
const freeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?.id ?? req.ip,
  message: { error: 'Translation limit reached. Upgrade to PRO for unlimited translations.' },
})

const schema = z.object({
  text: z.string().min(1).max(2000),
  source: z.string().default('en'),
  target: z.string().default('es'),
})

// ─── POST /api/translate ──────────────────
translateRouter.post('/', authenticate, validate(schema), async (req, res, next) => {
  try {
    const { text, source, target } = req.body
    const user = req.user!

    // Cache key
    const cacheKey = `tr:${source}:${target}:${Buffer.from(text).toString('base64').slice(0, 64)}`
    const cached = await redis.get(cacheKey)
    if (cached) return res.json({ translated: cached, cached: true })

    let translated: string

    // PRO/TEAM users → DeepL (calidad superior)
    if ((user.plan === 'pro' || user.plan === 'team') && process.env.DEEPL_API_KEY) {
      translated = await translateDeepL(text, source, target)
    } else {
      // FREE → Google Translate público (límite por rate limiter)
      translated = await translateGoogle(text, source, target)
    }

    // Cache 1 hora
    await redis.setex(cacheKey, 3600, translated)

    // Log usage (async)
    logUsage(user.id, 'translate').catch(console.error)

    res.json({ translated, cached: false, engine: user.plan !== 'free' ? 'deepl' : 'google' })
  } catch (err) {
    next(err)
  }
})

// ─── Helpers ──────────────────────────────
async function translateGoogle(text: string, source: string, target: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Google Translate failed')
  const data = await res.json()
  return data[0].map((d: string[]) => d[0]).join('')
}

async function translateDeepL(text: string, source: string, target: string): Promise<string> {
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: source.toUpperCase(),
      target_lang: target.toUpperCase(),
    }),
  })
  if (!res.ok) throw new Error('DeepL failed')
  const data = await res.json()
  return data.translations[0].text
}

async function logUsage(userId: string, action: string) {
  const { prisma } = await import('../utils/prisma')
  await prisma.usageLog.create({ data: { userId, action } })
}
