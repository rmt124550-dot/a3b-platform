'use client'
import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email,    setEmail]   = useState('')
  const [loading,  setLoading] = useState(false)
  const [sent,     setSent]    = useState(false)
  const [error,    setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true); setError('')
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
    } catch {
      setError('Error al enviar el email. Inténtalo de nuevo.')
    } finally { setLoading(false) }
  }

  if (sent) return (
    <main className="min-h-screen bg-surface grain flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-xl font-black mb-2">Revisa tu email</h1>
        <p className="text-white/45 text-sm mb-6">
          Si ese email existe en nuestra plataforma, recibirás un link para restablecer tu contraseña en los próximos minutos.
        </p>
        <p className="text-white/25 text-xs mb-6">No olvides revisar la carpeta de spam.</p>
        <Link href="/login" className="text-[#6366f1] text-sm hover:underline">← Volver al login</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-surface grain flex items-center justify-center px-4 py-12">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-3xl">🔐</span>
          <h1 className="text-xl font-black mt-3 mb-1">Recuperar contraseña</h1>
          <p className="text-white/40 text-sm">
            Ingresa tu email y te enviaremos un link para restablecerla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="input w-full"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Enviando...' : 'Enviar link de recuperación'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-white/35 text-sm hover:text-white/60">
            ← Volver al login
          </Link>
        </div>
      </div>
    </main>
  )
}
