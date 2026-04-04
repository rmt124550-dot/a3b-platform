'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

const PLANS = [
  { id: 'free', label: 'Free', price: '$0', desc: 'Google TTS · EN→ES · Coursera' },
  { id: 'pro',  label: 'Pro',  price: '$4.99/mes', desc: 'DeepL · 10 idiomas · Historial', highlight: true },
  { id: 'team', label: 'Team', price: '$19.99/mes', desc: 'Todo PRO · Admin · API' },
]

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', form)
      setAuth(data.user, data.accessToken, data.refreshToken)

      // Mostrar mensaje de verificación de email
      toast.success('¡Cuenta creada! Revisa tu email para verificarla.', { duration: 6000 })

      if (plan !== 'free') {
        // Redirect to Stripe checkout
        const { data: checkout } = await api.post('/api/billing/checkout', { plan })
        window.location.href = checkout.url
      } else {
        // Ir al dashboard con banner de verificación
        router.push('/dashboard?verify=1')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface grain flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fadeup">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🔊</span>
            <span className="font-bold text-xl tracking-tight">A3B<span className="text-indigo"> Narrator</span></span>
          </Link>
          <p className="text-sm text-white/40 mt-3">Crea tu cuenta gratis</p>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                plan === p.id
                  ? 'border-indigo bg-indigo/10 text-white'
                  : 'border-white/8 bg-s1 text-white/50 hover:border-white/20'
              }`}
            >
              <div className={`text-xs font-bold mb-0.5 ${plan === p.id ? 'text-indigo' : ''}`}>{p.label}</div>
              <div className="text-sm font-semibold">{p.price}</div>
              <div className="text-[10px] text-white/40 mt-1 leading-tight">{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Nombre</label>
              <input
                className="input" type="text" placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
              <input
                className="input" type="email" placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Contraseña</label>
              <input
                className="input" type="password" placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required minLength={8} autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 h-11 text-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Creando cuenta...
                </span>
              ) : plan === 'free' ? 'Crear cuenta gratis →' : `Crear cuenta y pagar ${PLANS.find(p=>p.id===plan)?.price} →`}
            </button>
          </form>

          <p className="text-xs text-white/25 text-center mt-4">
            Al registrarte aceptas los{' '}
            <Link href="/terms" className="text-white/40 hover:text-white/60 underline">Términos</Link>
            {' '}y la{' '}
            <Link href="/privacy" className="text-white/40 hover:text-white/60 underline">Política de privacidad</Link>
          </p>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-indigo hover:text-violet transition-colors font-medium">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
