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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

const PLANS: Record<string, { priceId: string; name: string }> = {
  pro:  { priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,  name: 'Pro'  },
  team: { priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY!, name: 'Team' },
}

// ─── GET /api/billing/plans ───────────────────────────────────────────────────
// Planes disponibles (público — sin auth)
billingRouter.get('/plans', (_req, res) => {
  res.json({
    plans: [
      {
        id: 'free', name: 'Free', price: 0, currency: 'usd', interval: 'forever',
        features: ['Google Translate', 'Solo EN→ES', 'Todas las plataformas', 'Sin historial'],
      },
      {
        id: 'pro', name: 'Pro', price: 4.99, currency: 'usd', interval: 'month',
        priceId: PLANS.pro.priceId,
        features: ['DeepL (mayor calidad)', '10 idiomas', 'Historial 30 días', 'Diccionario personal', 'Sin límites'],
        trial_days: 7,
      },
      {
        id: 'team', name: 'Team', price: 19.99, currency: 'usd', interval: 'month',
        priceId: PLANS.team.priceId,
        features: ['Todo lo de Pro', 'Usuarios ilimitados', 'Dashboard admin', 'API access', 'Soporte prioritario'],
        trial_days: 7,
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

    // Get or create Stripe customer
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
        trial_period_days: 7,
        metadata: { userId: user.id, plan },
      },
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

        await prisma.$transaction([
          prisma.subscription.upsert({
            where:  { userId },
            create: {
              userId,
              stripeCustomerId:     session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan, status: 'active',
            },
            update: {
              stripeCustomerId:     session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan, status: 'active',
            },
          }),
          prisma.user.update({ where: { id: userId }, data: { plan } }),
        ])

        // Invalidar caché del usuario
        await redis.del(`user_cache:${userId}`)

        // Email de bienvenida al plan
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user) {
          sendUpgradeEmail(user.email, user.name ?? 'Usuario', plan).catch(() => {})
        }

        auditLog('PLAN_UPGRADED', userId, { plan, session: session.id })
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

        // Asegurar que el plan está activo (puede haber caído a free por fallo anterior)
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
        if (user) {
          sendPaymentFailedEmail(user.email, user.name ?? 'Usuario').catch(() => {})
        }

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
        if (user) {
          sendCancellationEmail(user.email, user.name ?? 'Usuario', endDate).catch(() => {})
        }

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

        const newStatus = subscription.status === 'active' ? 'active' : subscription.status
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
