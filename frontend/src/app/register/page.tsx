'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

function RegisterContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const affiliateRef = searchParams.get('ref')  ?? ''
  const planParam    = searchParams.get('plan') ?? ''
  const setAuth      = useAuthStore((s) => s.setAuth)

  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        ...(affiliateRef ? { affiliateCode: affiliateRef } : {}),
      }
      const { data } = await api.post('/api/auth/register', payload)
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success('¡Cuenta creada! Revisa tu email para verificarla.', { duration: 6000 })

      if (planParam && planParam !== 'free') {
        const { data: checkout } = await api.post('/api/billing/checkout', { plan: planParam })
        window.location.href = checkout.url
      } else {
        router.push('/onboarding')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Glow de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[300px] sm:w-[600px] h-[200px] sm:h-[300px]
                      bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo + badge trial */}
        <div className="text-center mb-7 sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🔊</span>
            <span className="font-bold text-lg sm:text-xl tracking-tight">
              A3B<span className="text-[#6366f1]"> Narrator</span>
            </span>
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20
                          text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
            🎁 36 días gratis — sin tarjeta
          </div>
          {affiliateRef && (
            <p className="text-white/30 text-xs mt-2">
              Referido por un afiliado de A3B
            </p>
          )}
        </div>

        {/* Card formulario */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Nombre completo
              </label>
              <input
                type="text" required autoComplete="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-sm text-white placeholder-white/20
                           focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/6
                           transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email" required autoComplete="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-sm text-white placeholder-white/20
                           focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/6
                           transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password" required minLength={8} autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-sm text-white placeholder-white/20
                           focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/6
                           transition-all"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#6366f1] text-white font-black py-3.5 rounded-xl mt-1
                         hover:bg-[#5558e8] active:bg-[#4a4dd4]
                         transition-all disabled:opacity-60 text-sm">
              {loading ? '⏳ Creando cuenta...' : '🚀 Empezar 36 días gratis'}
            </button>

            <p className="text-white/25 text-xs text-center">
              Al registrarte aceptas los{' '}
              <Link href="/terms" className="underline hover:text-white/50">Términos</Link>{' '}
              y{' '}
              <Link href="/privacy" className="underline hover:text-white/50">Privacidad</Link>
            </p>
          </form>
        </div>

        {/* Link a login */}
        <p className="text-center text-sm text-white/35 mt-5 sm:mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#6366f1] font-semibold hover:text-[#a5b4fc] transition-colors">
            Iniciar sesión
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-white/20 hover:text-white/45 transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-white/30 text-sm">Cargando...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
