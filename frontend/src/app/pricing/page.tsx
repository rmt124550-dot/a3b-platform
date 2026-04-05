'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Plan {
  id: string; name: string; price: number; currency: string; interval: string
  priceId: string | null; note?: string
  annualPrice?: number; annualPriceId?: string
  annualMonthly?: number; savings?: string; annualBadge?: string
  trial_days?: number; trial_no_card?: boolean
  features: string[]
}

function fmtPrice(n: number): string {
  if (n === 0) return '0'
  return n % 1 > 0.001 ? n.toFixed(2) : Math.round(n).toString()
}

export default function PricingPage() {
  const [plans,   setPlans]   = useState<Plan[]>([])
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')
  const [loading, setLoading] = useState<string|null>(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    api.get('/api/billing/plans').then(r => setPlans(r.data.plans)).catch(() => {})
  }, [])

  async function handleCheckout(plan: Plan) {
    const planId = billing==='annual' && plan.annualPriceId ? plan.id+'_annual' : plan.id
    if (!planId || plan.price === 0) return
    setLoading(planId)
    try {
      if (!isAuthenticated()) { window.location.href = `/register?plan=${planId}`; return }
      const { data } = await api.post('/api/billing/checkout', { plan: planId })
      window.location.href = data.url
    } catch { toast.error('Error al iniciar el checkout.') }
    finally { setLoading(null) }
  }

  return (
    <main className="min-h-screen bg-[#080810] text-white px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center mb-10 sm:mb-14">
          <Link href="/" className="text-white/30 hover:text-white/60 text-sm mb-5 block">← Volver al inicio</Link>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Precios simples y honestos</h1>
          <p className="text-white/40 text-sm mb-7 sm:mb-8">Prueba PRO 36 días gratis — sin tarjeta requerida</p>

          {/* Toggle mensual / anual */}
          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button onClick={() => setBilling('monthly')}
              className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billing==='monthly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}>
              Mensual
            </button>
            <button onClick={() => setBilling('annual')}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billing==='annual' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}>
              Anual
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                -33%
              </span>
            </button>
          </div>
        </div>

        {/* ── Planes — 1 col mobile, 3 col desktop ─────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {plans.map(plan => {
            const isAnnual  = billing==='annual' && !!plan.annualPrice
            const showPrice = isAnnual ? plan.annualPrice! : plan.price
            const planId    = isAnnual ? plan.id+'_annual' : plan.id
            const isLoading = loading === planId
            const highlight = plan.id === 'pro'

            return (
              <div key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-5 sm:p-8 transition-all ${
                  highlight ? 'border-[#6366f1]/60 bg-[#6366f1]/5 shadow-lg shadow-[#6366f1]/10'
                            : 'border-white/8 bg-white/2 hover:border-white/15'
                }`}>

                {/* Badge top */}
                {highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6366f1] text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                    ⭐ MÁS POPULAR
                  </div>
                )}

                <div className="font-black text-lg sm:text-xl mb-3 sm:mb-4">{plan.name}</div>

                {/* Precio */}
                {plan.price === 0 ? (
                  <div className="mb-4 sm:mb-5">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400">$0</span>
                    <span className="text-white/35 text-sm ml-1">/{plan.interval}</span>
                    <div className="mt-2 inline-block text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                      🎁 36 días · Sin tarjeta
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 sm:mb-5">
                    {isAnnual && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white/25 line-through text-sm">${fmtPrice(plan.price)}/mes</span>
                        <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded-full font-bold">
                          -{plan.savings}
                        </span>
                      </div>
                    )}
                    <span className="text-3xl sm:text-4xl font-black">${fmtPrice(showPrice)}</span>
                    <span className="text-white/35 text-sm ml-1">{isAnnual ? '/año' : '/mes'}</span>
                    {isAnnual && plan.annualMonthly && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-emerald-400 font-bold text-sm">${fmtPrice(plan.annualMonthly)}/mes</span>
                        <span className="text-white/30 text-xs">equiv.</span>
                      </div>
                    )}
                    {isAnnual && plan.annualBadge ? (
                      <div className="inline-block mt-2 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                        {plan.annualBadge}
                      </div>
                    ) : !isAnnual && plan.trial_no_card && (
                      <div className="text-xs text-emerald-400/80 font-semibold mt-2">🎁 36 días gratis · Sin tarjeta</div>
                    )}
                  </div>
                )}

                {/* Nota trial */}
                {plan.note && (
                  <div className="bg-amber-500/8 border border-amber-500/15 rounded-lg px-3 py-2 mb-4 text-xs text-amber-300/70">
                    ⚠️ {plan.note}
                  </div>
                )}

                <div className="border-t border-white/6 my-3 sm:my-4" />

                {/* Features */}
                <ul className="space-y-2 sm:space-y-2.5 flex-1 mb-5 sm:mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.price === 0 ? (
                  <Link href="/register"
                    className="block w-full py-3.5 rounded-xl text-sm font-bold text-center border border-white/12 text-white/60 hover:border-white/25 hover:text-white transition-all">
                    Empezar gratis
                  </Link>
                ) : (
                  <>
                    <button onClick={() => handleCheckout(plan)} disabled={!!isLoading}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
                        highlight ? 'bg-[#6366f1] text-white hover:bg-[#5558e8]'
                                  : 'border border-white/12 text-white/70 hover:border-white/30 hover:text-white'
                      }`}>
                      {isLoading ? '⏳ Redirigiendo...' : 'Probar 36 días gratis'}
                    </button>
                    <p className="text-center text-white/20 text-xs mt-2">Sin tarjeta · Cancela cuando quieras</p>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Banner anual ─────────────────────────────────────── */}
        {billing==='annual' && (
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5 sm:p-6 mb-10 sm:mb-12 text-center">
            <p className="text-sm sm:text-base text-white/70">
              🎉 Plan anual = <strong className="text-emerald-400">$3.33/mes</strong> vs $4.99/mes mensual.
              Ahorras <strong className="text-emerald-400">$19.89 al año</strong>.
            </p>
          </div>
        )}

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-black text-lg sm:text-xl text-center mb-5 sm:mb-6">Preguntas frecuentes</h2>
          <div className="space-y-2 sm:space-y-3">
            {[
              { q:'¿Necesito tarjeta para el trial?',
                a:'No. 36 días completamente gratis sin ningún método de pago.' },
              { q:'¿Qué pasa al terminar el trial?',
                a:'El acceso se suspende. Puedes activar PRO en cualquier momento.' },
              { q:'¿Puedo cambiar de plan anual a mensual?',
                a:'Sí, desde Dashboard → Facturación. El cambio aplica al siguiente período.' },
              { q:'¿El plan anual incluye el trial?',
                a:'Sí. El plan anual también incluye 36 días gratis sin tarjeta.' },
              { q:'¿Qué pasa después del trial?',
                a:'Al terminar los 36 días necesitas activar PRO ($4.99/mes) para seguir usando la extensión.' },
            ].map((faq, i) => (
              <details key={i} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden group">
                <summary className="flex justify-between items-center px-4 sm:px-5 py-4 cursor-pointer list-none hover:bg-white/3 gap-3">
                  <span className="text-sm font-medium">{faq.q}</span>
                  <span className="text-white/30 group-open:rotate-180 transition-transform text-xs flex-shrink-0">▼</span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 pt-1 text-white/50 text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8 text-white/20 text-xs flex justify-center gap-4 flex-wrap">
            <a href="mailto:hello@a3bhub.cloud" className="hover:text-white/50">Soporte</a>
            <Link href="/help/billing" className="hover:text-white/50">Ayuda facturación</Link>
            <Link href="/affiliates" className="hover:text-white/50">Programa afiliados</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
