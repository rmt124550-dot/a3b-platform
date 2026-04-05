'use client'
import { useState } from 'react'
import Link from 'next/link'

function fmtPrice(n: number): string {
  if (n === 0) return '0'
  return n % 1 > 0.001 ? n.toFixed(2) : Math.round(n).toString()
}

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')

  const plans = [
    {
      id:'trial', name:'🎁 Prueba 36 días', monthly:0, annual:0,
      border:'border-emerald-500/30', bg:'bg-emerald-500/5', highlight:false,
      features:['Coursera — narración completa','YouTube · Udemy · edX · LinkedIn','Khan Academy · DataCamp','Google Translate EN → ES','Web Speech API nativa'],
      note:'Sin tarjeta. Al día 37 activa PRO para continuar.',
      cta:'Empezar 36 días gratis', href:'/register',
      ctaStyle:'bg-emerald-500 text-white hover:bg-emerald-400',
    },
    {
      id:'pro', name:'Pro', monthly:4.99, annual:39.99, annualMonthly:3.33, savings:'33%', annualBadge:'🔥 2 meses gratis',
      border:'border-[#6366f1]/60', bg:'bg-[#6366f1]/5', highlight:true,
      features:['36 días gratis incluidos','Todas las plataformas ilimitadas','DeepL — mayor calidad','10 idiomas de destino','Historial + diccionario personal'],
      cta:'Activar PRO', href:'/register?plan=pro',
      ctaStyle:'bg-[#6366f1] text-white hover:bg-[#5558e8]',
    },
    {
      id:'team', name:'Team', monthly:19.99, annual:199.99, annualMonthly:16.67, savings:'17%', annualBadge:'💎 2 meses gratis',
      border:'border-white/10', bg:'bg-white/2', highlight:false,
      features:['36 días gratis incluidos','Todo lo de Pro','Usuarios ilimitados','Dashboard admin','API access · Soporte prioritario'],
      cta:'Activar Team', href:'/register?plan=team',
      ctaStyle:'border border-white/12 text-white/70 hover:border-white/30 hover:text-white',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Empieza gratis 36 días</h2>
      <p className="text-white/40 text-sm sm:text-base mb-7 sm:mb-8 px-2">
        Sin tarjeta. Al terminar el trial, activa PRO para continuar.
      </p>

      {/* Toggle */}
      <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-8 sm:mb-10">
        <button onClick={() => setBilling('monthly')}
          className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            billing==='monthly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
          }`}>
          Mensual
        </button>
        <button onClick={() => setBilling('annual')}
          className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            billing==='annual' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
          }`}>
          Anual
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">-33%</span>
        </button>
      </div>

      {/* Cards — 1 col mobile, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 text-left">
        {plans.map(plan => {
          const isAnnual = billing==='annual' && plan.annual > 0
          const price    = isAnnual ? plan.annual : plan.monthly

          return (
            <div key={plan.id}
              className={`${plan.bg} border ${plan.border} rounded-2xl p-5 sm:p-8 flex flex-col transition-all ${
                plan.highlight ? 'shadow-lg shadow-[#6366f1]/10' : 'hover:border-white/15'
              } relative`}>

              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6366f1] text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                  ⭐ MÁS POPULAR
                </div>
              )}

              <div className="font-black text-lg sm:text-xl mb-3 sm:mb-4">{plan.name}</div>

              {/* Precio */}
              {plan.monthly === 0 ? (
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">$0</span>
                  <span className="text-white/35 text-sm ml-1">/36 días</span>
                  <div className="mt-2 inline-block text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                    🎁 Sin tarjeta requerida
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  {isAnnual && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-white/25 line-through text-sm">${fmtPrice(plan.monthly)}/mes</span>
                      <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded-full font-bold">-{plan.savings}</span>
                    </div>
                  )}
                  <span className="text-3xl sm:text-4xl font-black">${fmtPrice(price)}</span>
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
                  ) : !isAnnual && (
                    <div className="text-xs text-emerald-400/80 font-semibold mt-2">🎁 36 días gratis · Sin tarjeta</div>
                  )}
                </div>
              )}

              <div className="border-t border-white/6 mb-4" />

              <ul className="space-y-2 sm:space-y-2.5 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="text-white/25 text-xs mb-4 bg-white/3 rounded-lg px-3 py-2">⚠️ {plan.note}</p>
              )}

              <Link href={plan.id==='trial' ? plan.href : `${plan.href}${isAnnual ? '_annual' : ''}`}
                className={`block w-full py-3.5 rounded-xl text-sm font-bold text-center transition-all ${plan.ctaStyle}`}>
                {plan.cta}
              </Link>
            </div>
          )
        })}
      </div>

      <Link href="/pricing" className="text-white/30 text-sm hover:text-white/60 transition-colors">
        Ver comparativa completa y FAQ →
      </Link>
    </div>
  )
}
