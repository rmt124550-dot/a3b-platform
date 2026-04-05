'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

export default function LoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', form)
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success('Bienvenido de vuelta')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Glow de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[300px] sm:w-[500px] h-[200px] sm:h-[300px]
                      bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl">🔊</span>
            <span className="font-bold text-lg sm:text-xl tracking-tight">
              A3B<span className="text-[#6366f1]"> Narrator</span>
            </span>
          </Link>
          <p className="text-sm text-white/40 mt-2 sm:mt-3">Inicia sesión en tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Contraseña
                </label>
                <Link href="/forgot-password"
                  className="text-xs text-[#6366f1] hover:text-[#a5b4fc] transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                type="password" required autoComplete="current-password"
                placeholder="••••••••"
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
              className="w-full bg-[#6366f1] text-white font-black py-3.5 rounded-xl
                         hover:bg-[#5558e8] active:bg-[#4a4dd4]
                         transition-all disabled:opacity-60 text-sm mt-2">
              {loading ? '⏳ Iniciando sesión...' : 'Iniciar sesión →'}
            </button>
          </form>
        </div>

        {/* Link a registro */}
        <p className="text-center text-sm text-white/35 mt-5 sm:mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-[#6366f1] font-semibold hover:text-[#a5b4fc] transition-colors">
            Empezar 36 días gratis
          </Link>
        </p>

        <p className="text-center mt-4 sm:mt-5">
          <Link href="/" className="text-xs text-white/20 hover:text-white/45 transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
