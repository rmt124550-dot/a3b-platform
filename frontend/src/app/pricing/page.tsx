'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, period: '',
    color: 'border-white/8',
    features: [
      { text: 'Google Text-to-Speech', ok: true },
      { text: 'Traducción EN → ES', ok: true },
      { text: 'Compatible con Coursera', ok: true },
      { text: 'Historial de traducciones', ok: false },
      { text: 'Diccionario personal', ok: false },
      { text: 'DeepL (calidad superior)', ok: false },
      { text: 'Múltiples idiomas', ok: false },
    ],
    cta: 'Empezar gratis',
  },
  {
    id: 'pro', name: 'Pro', price: 4.99, period: '/mes',
    color: 'border-indigo', highlight: true,
    badge: 'Más popular',
    features: [
      { text: 'DeepL (calidad superior)', ok: true },
      { text: '10 idiomas destino', ok: true },
      { text: 'Coursera + YouTube + Udemy', ok: true },
      { text: 'Historial 30 días', ok: true },
      { text: 'Diccionario personal', ok: true },
      { text: '7 días de prueba gratis', ok: true },
      { text: 'Admin dashboard', ok: false },
    ],
    cta: 'Empezar prueba gratis',
  },
  {
    id: 'team', name: 'Team', price: 19.99, period: '/mes',
    color: 'border-white/8',
    features: [
      { text: 'Todo lo de PRO', ok: true },
      { text: 'Usuarios ilimitados', ok: true },
      { text: 'Admin dashboard', ok: true },
      { text: 'API access', ok: true },
      { text: 'Exportar SRT', ok: true },
      { text: 'Soporte prioritario', ok: true },
      { text: '7 días de prueba gratis', ok: true },
    ],
    cta: 'Empezar prueba gratis',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSelect(planId: string) {
    if (planId === 'free') {
      router.push(isAuthenticated() ? '/dashboard' : '/register')
      return
    }
    if (!isAuthenticated()) {
      router.push(`/register?plan=${planId}`)
      return
    }
    setLoading(planId)
    try {
      const { data } = await api.post('/api/billing/checkout', { plan: planId })
      window.location.href = data.url
    } catch {
      toast.error('Error al iniciar el pago')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-surface grain relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo/6 rounded-full blur-[150px] pointer-events-none" />

      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-md bg-surface/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span>🔊</span> A3B<span className="text-indigo"> Narrator</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated() ? (
              <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Iniciar sesión</Link>
                <Link href="/register" className="btn-primary text-sm">Empezar gratis</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeup">
          <div className="inline-flex items-center gap-2 badge badge-indigo mb-6">
            ✦ Precios simples
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">
            Elige tu plan
          </h1>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            Empieza gratis. Actualiza cuando necesites más potencia.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-5 animate-fadeup delay-100">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-2xl p-7 flex flex-col relative transition-all duration-300 ${
                plan.highlight
                  ? 'bg-indigo/5 border-indigo shadow-[0_0_60px_rgba(99,102,241,0.12)]'
                  : 'bg-s1 border-white/8 hover:border-white/16'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-indigo' : 'text-white/40'}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-serif text-4xl">${plan.price}</span>
                  <span className="text-white/40 text-sm mb-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.ok ? 'text-white/80' : 'text-white/25 line-through'}`}>
                    <span className={`mt-0.5 text-base leading-none flex-shrink-0 ${f.ok ? 'text-emerald' : 'text-white/15'}`}>
                      {f.ok ? '✓' : '×'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(plan.id)}
                disabled={loading === plan.id || (user?.plan === plan.id)}
                className={`w-full h-11 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'btn-primary'
                    : 'btn-ghost'
                } ${user?.plan === plan.id ? 'opacity-40 cursor-default' : ''}`}
              >
                {loading === plan.id ? (
                  <svg className="animate-spin w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                ) : user?.plan === plan.id ? 'Plan actual ✓' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto animate-fadeup delay-200">
          <h2 className="font-serif text-2xl text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. Puedes cancelar desde tu dashboard. No hay penalizaciones ni contratos.' },
              { q: '¿Qué pasa con mis datos si cancelo?', a: 'Tu historial y diccionario se conservan 30 días después de cancelar.' },
              { q: '¿La prueba gratuita requiere tarjeta?', a: 'Sí, necesitamos una tarjeta para la prueba. No se realiza ningún cargo durante 7 días.' },
              { q: '¿Funciona en todos los navegadores?', a: 'Chrome, Edge, Firefox y Kiwi Browser (Android). También disponible como bookmarklet.' },
            ].map((item) => (
              <div key={item.q} className="card p-5">
                <div className="font-semibold text-sm mb-2">{item.q}</div>
                <div className="text-sm text-white/50 leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
