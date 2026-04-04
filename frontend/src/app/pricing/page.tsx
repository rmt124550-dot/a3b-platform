'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0, annual: 0,
    monthlyId: null, annualId: null,
    period: 'para siempre',
    badge: null,
    highlight: false,
    features: [
      '✅ Coursera — narración completa',
      '✅ Google Translate EN → ES',
      '✅ Voz nativa del navegador',
      '✅ Overlay en pantalla',
      '✅ Kiwi Browser + Firefox Android',
      '❌ Solo Coursera en desktop',
      '❌ Sin historial ni diccionario',
    ],
    cta: 'Empezar gratis',
    ctaHref: '/register',
    ctaStyle: 'border border-white/12 text-white/70 hover:border-white/30 hover:text-white',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 4.99, annual: 39.99,
    monthlyId: 'pro', annualId: 'pro_annual',
    period: '/mes',
    badge: '⭐ MÁS POPULAR',
    highlight: true,
    annualBadge: '🔥 2 meses gratis',
    savings: '33%',
    features: [
      '✅ Todo lo de Free',
      '✅ YouTube · Udemy · edX · LinkedIn',
      '✅ DeepL — traducción de alta calidad',
      '✅ 10 idiomas de destino',
      '✅ Historial de frases (30 días)',
      '✅ Diccionario personal técnico',
      '✅ Sync config en la nube',
    ],
    cta: 'Probar 7 días gratis',
    ctaStyle: 'bg-[#6366f1] text-white hover:bg-[#5558e8]',
  },
  {
    id: 'team',
    name: 'Team',
    monthly: 19.99, annual: 199.99,
    monthlyId: 'team', annualId: 'team_annual',
    period: '/mes',
    badge: null,
    highlight: false,
    annualBadge: '💎 2 meses gratis',
    savings: '17%',
    features: [
      '✅ Todo lo de Pro',
      '✅ Usuarios ilimitados',
      '✅ Dashboard de administración',
      '✅ API access completo',
      '✅ Soporte prioritario',
      '✅ Exportar subtítulos .SRT',
      '✅ Informes de uso del equipo',
    ],
    cta: 'Probar 7 días gratis',
    ctaStyle: 'border border-white/12 text-white/70 hover:border-white/30 hover:text-white',
  },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')
  const [loading, setLoading]  = useState<string|null>(null)
  const { isAuthenticated }    = useAuthStore()

  async function handleCheckout(plan: typeof PLANS[0]) {
    const planId = billing === 'annual' ? plan.annualId : plan.monthlyId
    if (!planId) return

    setLoading(planId)
    try {
      if (!isAuthenticated()) {
        window.location.href = `/register?plan=${planId}`
        return
      }
      const { data } = await api.post('/api/billing/checkout', { plan: planId })
      window.location.href = data.url
    } catch {
      toast.error('Error al iniciar el checkout. Inténtalo de nuevo.')
    } finally {
      setLoading(null)
    }
  }

  const annualSavings = billing === 'annual'

  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-white/30 hover:text-white/60 text-sm mb-6 block">← Volver al inicio</Link>
          <h1 className="text-4xl font-black mb-3">Precios simples y honestos</h1>
          <p className="text-white/40 text-sm mb-8">
            Prueba PRO y Team 7 días gratis — sin tarjeta requerida
          </p>

          {/* Toggle mensual / anual */}
          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billing === 'monthly'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              Mensual
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              Anual
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                -33%
              </span>
            </button>
          </div>
        </div>

        {/* Planes */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => {
            const price    = billing === 'annual' && plan.annual > 0 ? plan.annual : plan.monthly
            const perMonth = billing === 'annual' && plan.annual > 0 ? (plan.annual/12).toFixed(2) : null
            const planId   = billing === 'annual' ? plan.annualId : plan.monthlyId
            const isLoading= loading === planId

            return (
              <div key={plan.id}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? 'border-[#6366f1]/60 bg-[#6366f1]/5'
                    : 'border-white/8 bg-white/2'
                }`}>

                {/* Badge superior */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6366f1] text-[10px] font-black tracking-widest text-white px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="font-black text-xl mb-3">{plan.name}</div>

                {/* Precio */}
                <div className="mb-1">
                  {plan.monthly === 0 ? (
                    <span className="text-4xl font-black">$0</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black">${price}</span>
                      <span className="text-white/35 text-sm font-normal">
                        {billing === 'annual' ? '/año' : plan.period}
                      </span>
                    </>
                  )}
                </div>

                {/* Equivalente mensual y ahorro */}
                {billing === 'annual' && perMonth && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-emerald-400 text-xs font-semibold">
                      ${perMonth}/mes
                    </span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-bold">
                      {plan.savings && `Ahorras ${plan.savings}`}
                    </span>
                  </div>
                )}

                {/* Badge anual */}
                {billing === 'annual' && plan.annualBadge && plan.monthly > 0 && (
                  <div className="text-xs text-amber-400/80 font-semibold mb-4">
                    {plan.annualBadge}
                  </div>
                )}

                {/* Separador */}
                {!(billing === 'annual' && perMonth) && <div className="mb-5" />}

                {/* Features */}
                <ul className="space-y-2 text-sm mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 ${
                      f.startsWith('❌') ? 'text-white/25' : 'text-white/60'
                    }`}>
                      <span className="flex-shrink-0 mt-0.5 text-xs">{f.slice(0,2)}</span>
                      <span>{f.slice(2)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.id === 'free' ? (
                  <Link href={plan.ctaHref}
                    className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${plan.ctaStyle}`}>
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan)}
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${plan.ctaStyle}`}>
                    {isLoading ? '⏳ Redirigiendo...' : plan.cta}
                  </button>
                )}

                {plan.id !== 'free' && (
                  <p className="text-center text-white/25 text-xs mt-3">
                    7 días gratis · Sin tarjeta · Cancela cuando quieras
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Comparativa */}
        <div className="bg-white/2 border border-white/8 rounded-2xl p-8 mb-12">
          <h2 className="font-black text-lg mb-6 text-center">¿Por qué elegir el plan anual?</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: '💰', title: 'Ahorras $19.89', desc: 'El equivalente a 2 meses gratis en PRO' },
              { icon: '🔒', title: 'Precio garantizado', desc: 'Bloqueas el precio actual por 12 meses' },
              { icon: '🧘', title: 'Sin preocupaciones', desc: 'Una sola factura al año, sin cargos mensuales' },
            ].map(item => (
              <div key={item.title}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-sm mb-1">{item.title}</div>
                <div className="text-white/40 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-black text-lg mb-6 text-center">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Necesito tarjeta para el trial?', a: 'No. Puedes probar PRO y Team durante 7 días completamente gratis sin ingresar ningún método de pago.' },
              { q: '¿Qué pasa al terminar el trial?', a: 'Si no agregas una tarjeta, vuelves automáticamente al plan Free. Si la agregas, se cobra al día 8.' },
              { q: '¿Puedo cambiar de plan anual a mensual?', a: 'Sí. Puedes cambiar desde Dashboard → Facturación en cualquier momento. El cambio aplica al siguiente período.' },
              { q: '¿Hay reembolsos?', a: 'No realizamos reembolsos por períodos parciales, salvo casos excepcionales a nuestra discreción. Puedes cancelar en cualquier momento.' },
              { q: '¿El plan Free tiene límites de uso?', a: 'No. El plan Free en Coursera es completamente ilimitado. Sin límite de narración, sin anuncios.' },
            ].map((faq, i) => (
              <details key={i} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden group">
                <summary className="flex justify-between items-center px-5 py-4 cursor-pointer list-none hover:bg-white/3">
                  <span className="text-sm font-medium">{faq.q}</span>
                  <span className="text-white/30 group-open:rotate-180 transition-transform text-xs flex-shrink-0 ml-2">▼</span>
                </summary>
                <div className="px-5 pb-4 pt-1 text-white/50 text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Footer de la página */}
        <div className="text-center mt-12 text-white/20 text-xs">
          <p>¿Tienes preguntas? <a href="mailto:hello@a3bhub.cloud" className="hover:text-white/50 underline">hello@a3bhub.cloud</a></p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/privacy" className="hover:text-white/40">Privacidad</Link>
            <Link href="/terms" className="hover:text-white/40">Términos</Link>
            <Link href="/help" className="hover:text-white/40">Ayuda</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
