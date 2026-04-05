import { Router, Request, Response, NextFunction } from 'express'
import { authenticate } from '../middleware/authenticate'
import { prisma } from '../utils/prisma'

export const aiRouter = Router()

// ─────────────────────────────────────────────────────────────────────────────
// Groq API — Llama 3.1 8B / 3.2 1B (tier gratuito disponible)
// Documentación: https://console.groq.com/docs/openai
// La variable GROQ_API_KEY debe estar en el entorno del servidor.
// ─────────────────────────────────────────────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Modelos disponibles en Groq (de más rápido a más preciso)
const GROQ_MODELS = {
  fast:    'llama-3.2-1b-preview',   // ~50-150ms — real-time subtítulos
  quality: 'llama-3.1-8b-instant',   // ~200-400ms — mayor precisión
  best:    'llama-3.3-70b-versatile', // ~500-800ms — máxima calidad (Team)
}

interface TranslateBody {
  text:       string       // subtítulo actual a traducir
  context?:   string[]     // últimas 3-5 frases (ventana de contexto)
  targetLang?: string      // idioma destino (default: es)
  glossary?:  Record<string,string>  // términos técnicos del curso
  mode?:      'fast' | 'quality' | 'best'
}

// ─── POST /api/ai/translate ───────────────────────────────────────────────────
// Requiere autenticación. Solo usuarios PRO/Team.
aiRouter.post('/translate', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { plan: true, trialEndsAt: true },
    })

    // Solo PRO y Team (trial también puede acceder con modo 'fast')
    const isPro      = user?.plan === 'pro' || user?.plan === 'team'
    const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null
    const trialActive = trialEndsAt ? trialEndsAt > new Date() : false
    const isTrial    = !isPro && trialActive

    if (!isPro && !isTrial) {
      return res.status(403).json({ error: 'Se requiere plan PRO para usar traducción con IA' })
    }

    const {
      text,
      context   = [],
      targetLang = 'es',
      glossary   = {},
      mode       = isPro ? 'quality' : 'fast',
    } = req.body as TranslateBody

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'text requerido' })
    }
    if (text.length > 1000) {
      return res.status(400).json({ error: 'text demasiado largo (máx 1000 chars)' })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      // Fallback: responder que no hay clave configurada (no romper el flujo)
      return res.status(503).json({
        error:    'AI translation not configured',
        fallback: true,
      })
    }

    // ── Construir el prompt ─────────────────────────────────────────────────
    const langNames: Record<string,string> = {
      es:'español', pt:'portugués', fr:'francés', de:'alemán',
      it:'italiano', ja:'japonés', ko:'coreano', zh:'chino',
      ar:'árabe', ru:'ruso',
    }
    const langName = langNames[targetLang] ?? 'español'

    // Contexto de las últimas frases (ventana deslizante)
    const contextBlock = context.length > 0
      ? `\nContexto previo (últimas frases del video):\n${context.map((c,i) => `  ${i+1}. "${c}"`).join('\n')}`
      : ''

    // Glosario técnico de la sesión
    const glossaryBlock = Object.keys(glossary).length > 0
      ? `\nGlosario técnico acordado (úsalo consistentemente):\n${
          Object.entries(glossary).map(([en,es]) => `  "${en}" → "${es}"`).join('\n')
        }`
      : ''

    const systemPrompt = `Eres un traductor especializado en educación técnica online.
Tu tarea es traducir subtítulos de video al ${langName} de forma precisa y natural.

REGLAS CRÍTICAS:
1. Traduce SOLO el texto entre comillas, sin añadir explicaciones
2. Mantén los términos técnicos en inglés cuando sea estándar de la industria
   (ej: "machine learning", "API", "framework", "backend", "dataset")
3. Adapta el nivel de formalidad al contexto educativo (tutear al estudiante)
4. Si el texto es muy corto (1-3 palabras), tradúcelo literalmente
5. NO traduzcas nombres propios, siglas, o código de programación
6. Responde SOLO con la traducción, sin comillas, sin explicaciones${contextBlock}${glossaryBlock}

Idioma destino: ${langName}`

    const userPrompt = `Traduce este subtítulo:\n"${text.trim()}"`

    // ── Seleccionar modelo según plan ───────────────────────────────────────
    let modelId = GROQ_MODELS.fast
    if (user?.plan === 'team') modelId = GROQ_MODELS.best
    else if (user?.plan === 'pro')  modelId = GROQ_MODELS.quality

    // ── Llamada a Groq API ──────────────────────────────────────────────────
    const groqRes = await fetch(GROQ_API_URL, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       modelId,
        messages:    [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        max_tokens:   200,
        temperature:  0.2,  // bajo para consistencia en traducción
        stream:       false,
      }),
      signal: AbortSignal.timeout(3000), // 3s timeout máximo
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('[AI translate] Groq error:', groqRes.status, errText.slice(0,200))
      return res.status(503).json({ error: 'AI service error', fallback: true })
    }

    const groqData = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>
      usage?:  { total_tokens: number }
    }

    const translated = groqData.choices?.[0]?.message?.content?.trim() ?? text
    const tokens     = groqData.usage?.total_tokens ?? 0

    // ── Log de uso para analytics (sin bloquear respuesta) ─────────────────
    prisma.usageLog.create({
      data: {
        userId:     req.user!.id,
        action:     'ai_translate',
        platform:   'api',
        details:    { model: modelId, tokens, lang: targetLang },
        tokensUsed: tokens,
      }
    }).catch(() => {}) // silencioso

    res.json({
      original:   text,
      translated,
      model:      modelId,
      lang:       targetLang,
      tokens,
    })

  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'AI timeout', fallback: true })
    }
    next(err)
  }
})

// ─── POST /api/ai/glossary — Extraer glosario técnico de un transcript ────────
// Analiza las primeras frases de un video y devuelve términos técnicos a conservar
aiRouter.post('/glossary', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { plan: true },
    })

    if (user?.plan !== 'pro' && user?.plan !== 'team') {
      return res.status(403).json({ error: 'Se requiere plan PRO' })
    }

    const { transcript, targetLang = 'es' } = req.body
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'transcript requerido' })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return res.json({ glossary: {} })

    const groqRes = await fetch(GROQ_API_URL, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_MODELS.quality,
        messages: [{
          role: 'user',
          content: `Analiza este fragmento de transcript educativo en inglés y extrae los términos técnicos del dominio que deben mantenerse en inglés o traducirse de forma consistente al ${targetLang}.

Transcript:
"${transcript.slice(0, 2000)}"

Responde SOLO con un JSON válido con el formato:
{"termino_en_ingles": "cómo_traducirlo_o_mantener", ...}

Ejemplos:
{"backpropagation": "backpropagation", "learning rate": "tasa de aprendizaje", "epoch": "época", "API": "API"}

JSON:`
        }],
        max_tokens:  300,
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(5000),
    })

    const data = await groqRes.json() as { choices: Array<{ message: { content: string } }> }
    const content = data.choices?.[0]?.message?.content?.trim() ?? '{}'

    // Parsear el JSON de forma segura
    let glossary: Record<string,string> = {}
    try {
      const jsonMatch = content.match(/\{[\s\S]+\}/)
      if (jsonMatch) glossary = JSON.parse(jsonMatch[0])
    } catch {}

    res.json({ glossary })

  } catch (err) { next(err) }
})
