import { Router } from 'express'
import Stripe from 'stripe'
import { prisma } from '../utils/prisma'
import { authenticate } from '../middleware/authenticate'

export const billingRouter = Router()
export const webhookRouter = Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any })

const PLANS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  team: process.env.STRIPE_PRICE_TEAM_MONTHLY!,
}

// ─── POST /api/billing/checkout ───────────
// Crea sesión de Stripe Checkout
billingRouter.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { plan } = req.body
    const priceId = PLANS[plan]
    if (!priceId) return res.status(400).json({ error: 'Invalid plan' })

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Get or create Stripe customer
    let sub = await prisma.subscription.findFirst({ where: { userId: user.id } })
    let customerId = sub?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=1`,
      metadata: { userId: user.id, plan },
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: user.id },
      },
    })

    res.json({ url: session.url })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/billing/portal ─────────────
// Portal de Stripe para gestionar suscripción
billingRouter.post('/portal', authenticate, async (req, res, next) => {
  try {
    const sub = await prisma.subscription.findFirst({ where: { userId: req.user!.id } })
    if (!sub?.stripeCustomerId) return res.status(404).json({ error: 'No subscription found' })

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing`,
    })

    res.json({ url: session.url })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/billing/status ──────────────
billingRouter.get('/status', authenticate, async (req, res, next) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    res.json({ subscription: sub, payments })
  } catch (err) {
    next(err)
  }
})

// ─── Stripe Webhook ───────────────────────
// Montado en /api/billing/webhook con body raw
webhookRouter.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature']!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return res.status(400).send('Webhook Error')
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as 'pro' | 'team'
        if (!userId || !plan) break

        await prisma.$transaction([
          prisma.subscription.upsert({
            where: { userId_stripeCustomerId: { userId, stripeCustomerId: session.customer as string } },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan,
              status: 'active',
            },
            update: {
              stripeSubscriptionId: session.subscription as string,
              plan,
              status: 'active',
            },
          }),
          prisma.user.update({ where: { id: userId }, data: { plan } }),
        ])
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } })
        if (!sub) break

        await prisma.payment.create({
          data: {
            userId: sub.userId,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            description: `Subscription payment - ${sub.plan} plan`,
            receiptUrl: invoice.hosted_invoice_url ?? null,
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })
        if (!sub) break

        await prisma.$transaction([
          prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'canceled' },
          }),
          prisma.user.update({ where: { id: sub.userId }, data: { plan: 'free' } }),
        ])
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } })
        if (!sub) break

        await prisma.subscription.update({ where: { id: sub.id }, data: { status: 'past_due' } })
        break
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})
