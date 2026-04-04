import { Router }     from 'express'
import Stripe         from 'stripe'
import { prisma }     from '../utils/prisma'
import { redis }      from '../utils/redis'
import { authenticate } from '../middleware/authenticate'
import { logger, auditLog } from '../utils/logger'
import {
  sendUpgradeEmail,
  sendPaymentFailedEmail,
  sendCancellationEmail,
} from '../services/email'

export const billingRouter  = Router()
export const webhookRouter  = Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16' as any,
})

const PLANS: Record<string, { priceId: string; interval: string; amount: number }> = {
  pro:         { priceId: process.env.STRIPE_PRICE_PRO         ?? 'price_1TIEIsFX0egoW0Gac5GHffeH', interval: 'month', amount: 499   },
  team:        { priceId: process.env.STRIPE_PRICE_TEAM        ?? 'price_1TIEItFX0egoW0Ga4kYmzffC', interval: 'month', amount: 1999  },
  pro_annual:  { priceId: process.env.STRIPE_PRICE_PRO_ANNUAL  ?? 'price_1TIZCxFX0egoW0Ga9tYg629o', interval: 'year',  amount: 3999  },
  team_annual: { priceId: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? 'price_1TIZCxFX0egoW0GaYrB7tFZX', interval: 'year',  amount: 19999 },
}

// Mapeo inverso: priceId → plan name
const PRICE_TO_PLAN: Record<string, 'pro' | 'team'> = {}
// Se rellena en runtime para evitar problemas si env vars llegan tarde
function getPlanByPriceId(priceId: string): 'pro' | 'team' | null {
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY)  return 'pro'
  if (priceId === process.env.STRIPE_PRICE_TEAM_MONTHLY) return 'team'
  return null
}

// ─── Helper: activar plan de un usuario ───────────────────────────────────────

// ─── Crear referral de afiliado cuando un usuario activa PRO ─────────────────
async function trackAffiliateReferral(userId: string, plan: string, stripeSubId: string) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { affiliateCode: true },
    })
    if (!user?.affiliateCode) return

    const affiliate = await prisma.affiliate.findUnique({
      where: { code: user.affiliateCode },
    })
    if (!affiliate || affiliate.status !== 'active') return

    // Verificar que no existe ya un referral para este usuario
    const existing = await prisma.affiliateReferral.findFirst({
      where: { referredUserId: userId },
    })
    if (existing) return

    const commissionRate  = affiliate.commissionRate ?? 0.30
    const planAmount      = plan.includes('annual')
      ? (plan.includes('team') ? 199.99 : 39.99)
      : (plan.includes('team') ? 19.99  : 4.99)
    const commissionTotal = parseFloat((planAmount * commissionRate).toFixed(2))
    const expiresAt       = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 12 meses

    await prisma.affiliateReferral.create({
      data: {
        affiliateId:    affiliate.id,
        referredUserId: userId,
        status:         'active',
        plan,
        commissionTotal,
        stripeSubId,
        activatedAt:    new Date(),
        expiresAt,
      },
    })

    // Actualizar pendingAmount del afiliado
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data:  {
        totalEarned:   { increment: commissionTotal },
        pendingAmount: { increment: commissionTotal },
      },
    })

    logger.info({
      event:          'AFFILIATE_REFERRAL_CREATED',
      affiliateId:    affiliate.id,
      referredUserId: userId,
      plan,
      commission:     commissionTotal,
    })
  } catch (err: any) {
    logger.warn({ event: 'AFFILIATE_TRACK_ERROR', error: err.message })
  }
}

async function activatePlan(
  userId: string,
  plan: 'pro' | 'team',
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  status: 'active' | 'trialing' = 'active'
) {
  const existingSub = await prisma.subscription.findFirst({ where: { userId } })
  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: { stripeCustomerId, stripeSubscriptionId, plan: plan as any, status },
    })
  } else {
    await prisma.subscription.create({
      data: { userId, stripeCustomerId, stripeSubscriptionId, plan: plan as any, status },
    })
  }
  await prisma.user.update({ where: { id: userId }, data: { plan: plan as any } })
  await redis.del(`user_cache:${userId}`)
}

// ─── GET /api/billing/plans ───────────────────────────────────────────────────
billingRouter.get('/plans', (_req, res) => {
  res.json({
    plans: [
      {
        id: 'trial', name: '🎁 Prueba 36 días', price: 0, currency: 'usd',
        interval: '36 días', priceId: null,
        trial_days: 36, trial_no_card: true,
        features: [
          'Coursera — narración completa',
          'YouTube · Udemy · edX · LinkedIn Learning',
          'Khan Academy · DataCamp',
          'Google Translate EN → ES',
          'Web Speech API nativa del navegador',
          'Overlay de subtítulos en pantalla',
        ],
        note: 'Sin tarjeta. Al día 37 debes activar PRO para continuar.',
      },
      {
        id: 'pro', name: 'Pro', price: 4.99, currency: 'usd', interval: 'month',
        priceId: PLANS.pro.priceId,
        annualPrice: 39.99, annualPriceId: PLANS.pro_annual.priceId,
        annualMonthly: 3.33, savings: '33%', annualBadge: '🔥 2 meses gratis',
        trial_days: 36, trial_no_card: true,
        features: [
          '36 días gratis incluidos — sin tarjeta',
          'Todas las plataformas ilimitadas',
          'DeepL — traducción de mayor calidad',
          '10 idiomas de destino',
          'Historial de frases (30 días)',
          'Diccionario personal técnico',
        ],
      },
      {
        id: 'team', name: 'Team', price: 19.99, currency: 'usd', interval: 'month',
        priceId: PLANS.team.priceId,
        annualPrice: 199.99, annualPriceId: PLANS.team_annual.priceId,
        annualMonthly: 16.67, savings: '17%', annualBadge: '💎 2 meses gratis',
        trial_days: 36, trial_no_card: true,
        features: [
          '36 días gratis incluidos — sin tarjeta',
          'Todo lo de Pro',
          'Usuarios ilimitados',
          'Dashboard de administración',
          'API access completo',
          'Soporte prioritario',
        ],
      },
    ],
  })
})

// ─── POST /api/billing/checkout ───────────────────────────────────────────────
billingRouter.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { plan } = req.body
    const planConfig = PLANS[plan]
    if (!planConfig) return res.status(400).json({ error: 'Plan inválido. Usa: pro | team' })

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    if (user.plan === plan) {
      return res.status(400).json({ error: `Ya estás en el plan ${plan}` })
    }

    let sub = await prisma.subscription.findFirst({ where: { userId: user.id } })
    let customerId = sub?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.name ?? undefined,
        metadata: { userId: user.id, app: 'a3b-narrator' },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer:             customerId,
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items:           [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=1&plan=${plan}`,
      cancel_url:  `${process.env.FRONTEND_URL}/pricing?canceled=1`,
      metadata:    { userId: user.id, plan },
      subscription_data: {
        trial_period_days: 36,
        metadata: { userId: user.id, plan },
      },
      // ── Trial sin tarjeta requerida ──────────────────────────────────────
      // El usuario prueba 7 días gratis. Al terminar el trial,
      // Stripe envía invoice → si no hay tarjeta, cancela → webhook → plan=free
      payment_method_collection: 'if_required',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    auditLog('CHECKOUT_CREATED', user.id, { plan, sessionId: session.id })
    res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/billing/portal ─────────────────────────────────────────────────
billingRouter.post('/portal', authenticate, async (req, res, next) => {
  try {
    const sub = await prisma.subscription.findFirst({ where: { userId: req.user!.id } })
    if (!sub?.stripeCustomerId) {
      return res.status(404).json({ error: 'No tienes suscripción activa' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer:   sub.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing`,
    })

    res.json({ url: session.url })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/billing/subscription ────────────────────────────────────────────
billingRouter.get('/subscription', authenticate, async (req, res, next) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where:   { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })
    const payments = await prisma.payment.findMany({
      where:   { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { plan: true, email: true },
    })

    res.json({
      currentPlan: user?.plan ?? 'free',
      subscription: sub,
      payments,
    })
  } catch (err) {
    next(err)
  }
})

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
webhookRouter.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature']!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    logger.warn({ event: 'WEBHOOK_SIGNATURE_FAILED', error: err.message })
    return res.status(400).send('Webhook signature error')
  }

  logger.info({ event: 'STRIPE_WEBHOOK', type: event.type, id: event.id })

  try {
    switch (event.type) {

      // ── Checkout completado → activar plan ─────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan   = session.metadata?.plan as 'pro' | 'team'
        if (!userId || !plan) break

        await activatePlan(
          userId, plan,
          session.customer as string,
          session.subscription as string,
          'active'
        )

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user) sendUpgradeEmail(user.email, user.name ?? 'Usuario', plan).catch(() => {})

        auditLog('PLAN_UPGRADED', userId, { plan, session: session.id })
        break
      }

      // ── Suscripción creada (trial o directa sin checkout) ──────────────────
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (!userId) break

        // Determinar plan desde el priceId del primer item
        const priceId = subscription.items.data[0]?.price?.id ?? ''
        const plan = getPlanByPriceId(priceId)
        if (!plan) {
          logger.warn({ event: 'UNKNOWN_PRICE', priceId })
          break
        }

        const status = subscription.status === 'trialing' ? 'trialing' : 'active'

        await activatePlan(
          userId, plan,
          subscription.customer as string,
          subscription.id,
          status
        )

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user) sendUpgradeEmail(user.email, user.name ?? 'Usuario', plan).catch(() => {})

        auditLog('SUBSCRIPTION_CREATED', userId, {
          plan, subscriptionId: subscription.id, status
        })
        break
      }

      // ── Pago exitoso → registrar payment ──────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice    = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } })
        if (!sub) break

        await prisma.payment.create({
          data: {
            userId:          sub.userId,
            stripeInvoiceId: invoice.id,
            amount:          invoice.amount_paid,
            currency:        invoice.currency,
            status:          'succeeded',
            description:     `Plan ${sub.plan} — ${new Date().toLocaleDateString('es')}`,
            receiptUrl:      invoice.hosted_invoice_url ?? null,
          },
        })

        await prisma.subscription.update({ where: { id: sub.id }, data: { status: 'active' } })
        await redis.del(`user_cache:${sub.userId}`)
        auditLog('PAYMENT_SUCCEEDED', sub.userId, { amount: invoice.amount_paid, invoiceId: invoice.id })
        break
      }

      // ── Pago fallido ───────────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice    = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } })
        if (!sub) break

        await prisma.subscription.update({ where: { id: sub.id }, data: { status: 'past_due' } })
        await redis.del(`user_cache:${sub.userId}`)

        const user = await prisma.user.findUnique({ where: { id: sub.userId } })
        if (user) sendPaymentFailedEmail(user.email, user.name ?? 'Usuario').catch(() => {})

        auditLog('PAYMENT_FAILED', sub.userId, { invoiceId: invoice.id })
        break
      }

      // ── Suscripción cancelada → downgrade a free ───────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })
        if (!sub) break

        const endDate = new Date(subscription.current_period_end * 1000)
          .toLocaleDateString('es', { day:'numeric', month:'long', year:'numeric' })

        await prisma.$transaction([
          prisma.subscription.update({ where: { id: sub.id }, data: { status: 'canceled' } }),
          prisma.user.update({ where: { id: sub.userId }, data: { plan: 'free' } }),
        ])
        await redis.del(`user_cache:${sub.userId}`)

        const user = await prisma.user.findUnique({ where: { id: sub.userId } })
        if (user) sendCancellationEmail(user.email, user.name ?? 'Usuario', endDate).catch(() => {})

        auditLog('SUBSCRIPTION_CANCELED', sub.userId, { subscriptionId: subscription.id })
        break
      }

      // ── Suscripción actualizada (reactivada, upgraded, etc) ─────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })
        if (!sub) break

        const stripeStatusMap: Record<string, 'active'|'canceled'|'past_due'|'trialing'> = {
          active: 'active', trialing: 'trialing', past_due: 'past_due',
          canceled: 'canceled', incomplete: 'past_due', incomplete_expired: 'canceled',
          paused: 'active', unpaid: 'past_due',
        }
        const newStatus = stripeStatusMap[subscription.status] ?? 'active'
        await prisma.subscription.update({ where: { id: sub.id }, data: { status: newStatus } })
        await redis.del(`user_cache:${sub.userId}`)
        break
      }
    }

    res.json({ received: true, type: event.type })
  } catch (err: any) {
    logger.error({ event: 'WEBHOOK_HANDLER_ERROR', type: event.type, error: err.message })
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})
