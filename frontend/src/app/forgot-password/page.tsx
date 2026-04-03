'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const r = await fetch(
        (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.a3bhub.cloud') + '/api/user/forgot-password',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        }
      )
      // Siempre mostrar éxito (anti-enumeración)
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🔊</span>
            <span className="font-black text-xl">A3B<span className="text-[#6366f1]"> Narrator</span></span>
          </Link>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-xl font-bold mb-3">Revisa tu email</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Si existe una cuenta con <strong className="text-white/70">{email}</strong>,
                recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
              <Link href="/login"
                className="inline-block mt-6 text-[#6366f1] hover:text-[#8b5cf6] text-sm font-medium">
                ← Volver al login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold mb-1">Recuperar contraseña</h1>
              <p className="text-white/40 text-sm mb-6">
                Ingresa tu email y te enviaremos un enlace para restablecerla.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email" required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366f1] transition-colors"
                  />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-all">
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperación →'}
                </button>
              </form>
              <p className="text-center text-sm text-white/30 mt-4">
                <Link href="/login" className="hover:text-white/60 transition-colors">← Volver al login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
