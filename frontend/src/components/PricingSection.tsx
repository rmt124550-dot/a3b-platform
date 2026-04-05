'use client'
import { useState } from 'react'
import Link from 'next/link'

function fmtPrice(n: number): string {
  if (n === 0) return '0'
  return n % 1 > 0.001 ? n.toFixed(2) : Math.round(n).toString()
}

const AI_BADGES = {
  trial: { label: 'Google Translate',  color: 'text-emerald-400',  bg: 'bg-emerald-500/10 border-emerald-500/20', icon: '🌐' },
  pro:   { label: 'Llama 3.1 8B',     color: 'text-violet-300',   bg: 'bg-violet-500/10 border-violet-500/20',   icon: '🤖' },
  team:  { label: 'Llama 4 Scout 17B', color: 'text-violet-200',  bg: 'bg-violet-500/15 border-violet-500/30',   icon: '🚀' },
}

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')

  const plans = [
    {
      id:'trial', name:'🎁 Prueba 36 días', monthly:0, annual:0,
      border:'border-emerald-500/30', bg:'bg-emerald-500/5', highlight:false,
      aiEngine: 'trial',
      features:[
        'Google Translate — EN → 10 idiomas',
        'Traducción rápida sin servidor',
        'Coursera + todas las plataformas',
        'Web Speech API (voz nativa)',
        'Overlay de subtítulos en pantalla',
      ],
      note:'Sin tarjeta. Al día 37 activa PRO para continuar.',
      cta:'Empezar 36 días gratis', href:'/register',
      ctaStyle:'bg-emerald-500 text-white hover:bg-emerald-400',
    },
    {
      id:'pro', name:'Pro', monthly:4.99, annual:39.99, annualMonthly:3.33, savings:'33%', annualBadge:'🔥 2 meses gratis',
      border:'border-[#6366f1]/60', bg:'bg-[#6366f1]/5', highlight:true,
      aiEngine: 'pro',
      features:[
        '🤖 Llama 3.1 8B — IA contextual',
        'Contexto de las últimas 5 frases',
        'Glosario técnico del curso auto',
        'DeepL disponible + 10 idiomas',
        'Historial + diccionario personal',
      ],
      cta:'Activar PRO con IA', href:'/register?plan=pro',
      ctaStyle:'bg-[#6366f1] text-white hover:bg-[#5558e8]',
    },
    {
      id:'team', name:'Team', monthly:19.99, annual:199.99, annualMonthly:16.67, savings:'17%', annualBadge:'💎 2 meses gratis',
      border:'border-violet-500/30', bg:'bg-violet-500/5', highlight:false,
      aiEngine: 'team',
      features:[
        '🚀 Llama 4 Scout 17B — máxima calidad',
        'Todo lo de Pro',
        'Usuarios ilimitados + admin',
        'API access completo',
        'Soporte prioritario',
      ],
      cta:'Activar Team', href:'/register?plan=team',
      ctaStyle:'bg-violet-600 text-white hover:bg-violet-500',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">Empieza gratis 36 días</h2>
        <p className="text-white/40 text-sm sm:text-base mb-2">
          Cada plan tiene un motor de traducción diferente.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-white/30 mb-7">
          <span className="flex items-center gap-1">🌐 Trial: Google Translate</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-violet-300">🤖 PRO: Llama 3.1 8B</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-violet-200">🚀 Team: Llama 4 Scout</span>
        </div>

        {/* Toggle */}
        <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
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
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {plans.map(plan => {
          const isAnnual = billing==='annual' && plan.annual > 0
          const price    = isAnnual ? plan.annual : plan.monthly
          const badge    = AI_BADGES[plan.aiEngine as keyof typeof AI_BADGES]

          return (
            <div key={plan.id}
              className={`${plan.bg} border ${plan.border} rounded-2xl p-5 sm:p-6 flex flex-col
                         relative transition-all ${plan.highlight ? 'shadow-lg shadow-[#6366f1]/10' : 'hover:border-white/15'}`}>

              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6366f1] text-white
                                text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                  ⭐ MÁS POPULAR
                </div>
              )}

              {/* AI Engine badge */}
              <div className={`inline-flex items-center gap-1.5 self-start mb-3 px-2.5 py-1
                               rounded-full border text-[10px] font-bold ${badge.bg} ${badge.color}`}>
                {badge.icon} {badge.label}
              </div>

              <div className="font-black text-base sm:text-lg mb-3">{plan.name}</div>

              {/* Precio */}
              {plan.monthly === 0 ? (
                <div className="mb-4">
                  <span className="text-3xl font-black text-emerald-400">$0</span>
                  <span className="text-white/35 text-sm ml-1">/36 días</span>
                  <div className="text-xs text-emerald-400/80 font-semibold mt-1">🎁 Sin tarjeta</div>
                </div>
              ) : (
                <div className="mb-4">
                  {isAnnual && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/25 line-through text-sm">${fmtPrice(plan.monthly)}/mes</span>
                      <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded-full font-bold">-{plan.savings}</span>
                    </div>
                  )}
                  <span className="text-3xl font-black">${fmtPrice(price)}</span>
                  <span className="text-white/35 text-sm ml-1">{isAnnual ? '/año' : '/mes'}</span>
                  {isAnnual && plan.annualMonthly && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-emerald-400 font-bold text-sm">${fmtPrice(plan.annualMonthly)}/mes</span>
                      <span className="text-white/30 text-xs">equiv.</span>
                    </div>
                  )}
                  {!isAnnual && <div className="text-xs text-emerald-400/80 font-semibold mt-1">🎁 36 días gratis · Sin tarjeta</div>}
                  {isAnnual && plan.annualBadge && (
                    <div className="inline-block mt-2 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                      {plan.annualBadge}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-white/6 mb-4" />

              <ul className="space-y-2 sm:space-y-2.5 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                    <span className={`flex-shrink-0 mt-0.5 ${
                      f.startsWith('🤖') || f.startsWith('🚀') ? '' : 'text-emerald-400'
                    }`}>{f.startsWith('🤖') || f.startsWith('🚀') ? '' : '✓'}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="text-white/25 text-xs mb-4 bg-white/3 rounded-lg px-3 py-2">⚠️ {plan.note}</p>
              )}

              <Link href={plan.id==='trial' ? plan.href : `${plan.href}${isAnnual ? '_annual' : ''}`}
                className={`block w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-center transition-all ${plan.ctaStyle}`}>
                {plan.cta}
              </Link>
            </div>
          )
        })}
      </div>

      <p className="text-center text-white/25 text-xs">
        Todos los planes incluyen 36 días gratis · Sin tarjeta · Cancela cuando quieras
      </p>
    </div>
  )
}
