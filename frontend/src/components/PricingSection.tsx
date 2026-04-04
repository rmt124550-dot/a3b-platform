'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      id: 'free', name: 'Free', monthly: 0, annual: 0,
      border: 'border-white/10', bg: 'bg-white/2', highlight: false,
      features: ['Coursera — narración completa', 'Google Translate EN→ES', 'Overlay en pantalla', 'Sin cuenta requerida'],
      cta: 'Empezar gratis', href: '/register',
      ctaStyle: 'border border-white/12 text-white/60 hover:border-white/25',
    },
    {
      id: 'pro', name: 'Pro',
      monthly: 4.99, annual: 39.99, annualMonthly: 3.33, savings: '33%',
      annualBadge: '🔥 2 meses gratis',
      border: 'border-[#6366f1]/60', bg: 'bg-[#6366f1]/5', highlight: true,
      features: ['YouTube · Udemy · edX · LinkedIn', 'DeepL — mayor calidad', '10 idiomas destino', 'Historial + diccionario'],
      cta: 'Probar 7 días gratis', href: '/register?plan=pro',
      ctaStyle: 'bg-[#6366f1] text-white hover:bg-[#5558e8]',
    },
    {
      id: 'team', name: 'Team',
      monthly: 19.99, annual: 199.99, annualMonthly: 16.67, savings: '17%',
      annualBadge: '💎 2 meses gratis',
      border: 'border-white/10', bg: 'bg-white/2', highlight: false,
      features: ['Todo lo de Pro', 'Usuarios ilimitados', 'Dashboard admin', 'API access', 'Soporte prioritario'],
      cta: 'Probar 7 días gratis', href: '/register?plan=team',
      ctaStyle: 'border border-white/12 text-white/60 hover:border-white/25',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-black mb-4">Empieza gratis</h2>
      <p className="text-white/40 mb-8">
        Free incluye Coursera completo. PRO desbloquea todo — 7 días gratis · Sin tarjeta
      </p>

      {/* ── Toggle mensual / anual ──────────────────── */}
      <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-10">
        <button
          onClick={() => setBilling('monthly')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            billing === 'monthly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
          }`}>
          Mensual
        </button>
        <button
          onClick={() => setBilling('annual')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            billing === 'annual' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
          }`}>
          Anual
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
            -33%
          </span>
        </button>
      </div>

      {/* ── Cards ──────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map(plan => {
          const isAnnual = billing === 'annual' && plan.annual > 0
          const price    = isAnnual ? plan.annual : plan.monthly

          return (
            <div key={plan.id}
              className={`${plan.bg} border ${plan.border} rounded-2xl p-8 relative flex flex-col transition-all ${
                plan.highlight ? 'shadow-lg shadow-[#6366f1]/10' : 'hover:border-white/15'
              }`}>

              {/* Badge top */}
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6366f1] text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                  ⭐ MÁS POPULAR
                </div>
              )}

              {/* Nombre */}
              <div className="font-black text-xl mb-4">{plan.name}</div>

              {/* ── Precio ─────────────────────────────────── */}
              {plan.monthly === 0 ? (
                <div className="mb-6">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-white/35 text-sm ml-1">siempre</span>
                </div>
              ) : (
                <div className="mb-5">
                  {/* Precio original tachado (solo en anual) */}
                  {isAnnual && (
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <span className="text-white/25 line-through text-sm">
                        ${plan.monthly}/mes
                      </span>
                      <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded-full font-bold">
                        -{plan.savings}
                      </span>
                    </div>
                  )}

                  {/* Precio actual */}
                  <span className="text-4xl font-black">${price.toFixed(0)}</span>
                  <span className="text-white/35 text-sm ml-1">
                    {isAnnual ? '/año' : '/mes'}
                  </span>

                  {/* Equivalente mensual en anual */}
                  {isAnnual && plan.annualMonthly && (
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="text-emerald-400 font-bold text-sm">
                        ${plan.annualMonthly}/mes
                      </span>
                      <span className="text-white/30 text-xs">equivalente</span>
                    </div>
                  )}

                  {/* Badge de ahorro */}
                  {isAnnual && plan.annualBadge ? (
                    <div className="inline-block mt-2.5 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                      {plan.annualBadge}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-400/80 font-semibold mt-2.5">
                      🎁 7 días gratis · Sin tarjeta
                    </div>
                  )}
                </div>
              )}

              {/* Separador */}
              <div className="border-t border-white/6 mb-5" />

              {/* Features */}
              <ul className="space-y-2.5 text-sm text-white/55 text-left flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-400 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.id === 'free'
                  ? plan.href
                  : `${plan.href}${isAnnual ? '_annual' : ''}`
                }
                className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${plan.ctaStyle}`}>
                {plan.cta}
              </Link>
            </div>
          )
        })}
      </div>

      <Link href="/pricing"
        className="text-white/30 text-sm hover:text-white/60 transition-colors">
        Ver comparativa completa y preguntas frecuentes →
      </Link>
    </div>
  )
}
