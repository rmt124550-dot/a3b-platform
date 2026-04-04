'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { Suspense } from 'react'

function BillingSuccessContent() {
  const params    = useSearchParams()
  const success   = params.get('success')
  const canceled  = params.get('canceled')
  const plan      = params.get('plan') ?? 'pro'
  const { setAuth, user } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (success) {
      // Refrescar datos del usuario para obtener el nuevo plan
      setTimeout(() => {
        api.get('/api/auth/me').then(r => {
          const u = r.data.user
          // Actualizar el store con el nuevo plan
          const token = localStorage.getItem('a3b_access_token') || ''
          const refresh = localStorage.getItem('a3b_refresh_token') || ''
          setAuth(u, token, refresh)
        }).catch(() => {}).finally(() => setLoading(false))
      }, 2000) // Dar tiempo al webhook de Stripe
    } else {
      setLoading(false)
    }
  }, [success])

  if (canceled) return (
    <div className="p-6 md:p-10 max-w-lg mx-auto text-center">
      <div className="text-5xl mb-4">😅</div>
      <h1 className="text-2xl font-black mb-3">Checkout cancelado</h1>
      <p className="text-white/45 text-sm mb-6">
        No se realizó ningún cargo. Tu trial sigue activo.
      </p>
      <Link href="/pricing"
        className="inline-block bg-[#6366f1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
        Ver planes →
      </Link>
    </div>
  )

  if (!success) return (
    <div className="p-6 md:p-10 max-w-lg mx-auto text-center">
      <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm">← Volver al dashboard</Link>
    </div>
  )

  const planNames: Record<string, string> = {
    pro: 'Pro', pro_annual: 'Pro Anual', team: 'Team', team_annual: 'Team Anual'
  }

  return (
    <div className="p-6 md:p-10 max-w-lg mx-auto text-center">
      <div className="text-6xl mb-6 animate-bounce">🎉</div>
      <h1 className="text-3xl font-black mb-3">¡Bienvenido a PRO!</h1>
      <p className="text-white/50 text-base mb-2">
        Plan <strong className="text-[#a5b4fc]">{planNames[plan] ?? 'Pro'}</strong> activado correctamente.
      </p>
      <p className="text-white/35 text-sm mb-8">
        Ahora tienes acceso completo a todas las plataformas.
      </p>

      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-8 text-left">
        <h3 className="font-bold text-sm mb-3 text-center">Lo que ya tienes disponible:</h3>
        <ul className="space-y-2 text-sm text-white/60">
          {['YouTube · Udemy · edX · LinkedIn Learning',
            'Khan Academy · DataCamp',
            'DeepL — traducción de alta calidad',
            '10 idiomas de destino',
            'Historial de frases (30 días)',
            'Diccionario personal técnico',
          ].map(f => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard"
          className="bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
          Ir al dashboard →
        </Link>
        <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer"
          className="border border-white/12 text-white/60 font-bold px-8 py-3 rounded-xl hover:border-white/25 hover:text-white transition-all text-sm">
          Abrir extensión →
        </a>
      </div>

      <p className="text-white/20 text-xs mt-6">
        Recibirás un recibo en tu email. Puedes gestionar tu suscripción en{' '}
        <Link href="/dashboard/billing" className="underline hover:text-white/40">Facturación</Link>.
      </p>
    </div>
  )
}

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-surface grain flex items-center justify-center px-4 py-12">
      <div className="w-full">
        <Suspense fallback={<div className="text-white/30 text-sm text-center p-8">Verificando pago...</div>}>
          <BillingSuccessContent />
        </Suspense>
      </div>
    </main>
  )
}
