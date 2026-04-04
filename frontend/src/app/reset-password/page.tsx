'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

function ResetPasswordContent() {
  const params   = useSearchParams()
  const token    = params.get('token') ?? ''
  const router   = useRouter()
  const [password,  setPassword]  = useState('')
  const [password2, setPassword2] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true); setError('')
    try {
      await api.post('/api/auth/reset-password', { token, password })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Error al restablecer. El link puede haber expirado.')
    } finally { setLoading(false) }
  }

  if (!token) return (
    <div className="text-center">
      <div className="text-4xl mb-4">❌</div>
      <p className="text-white/50 text-sm mb-4">Token inválido o faltante.</p>
      <Link href="/forgot-password" className="text-[#6366f1] text-sm hover:underline">
        Solicitar nuevo link
      </Link>
    </div>
  )

  if (success) return (
    <div className="text-center">
      <div className="text-4xl mb-4">✅</div>
      <h2 className="font-black text-lg mb-2">¡Contraseña actualizada!</h2>
      <p className="text-white/45 text-sm mb-4">Redirigiendo al login en 3 segundos...</p>
      <Link href="/login" className="text-[#6366f1] text-sm hover:underline">Ir al login →</Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          Nueva contraseña
        </label>
        <input type="password" required minLength={8}
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
          className="input w-full" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          Confirmar contraseña
        </label>
        <input type="password" required
          value={password2} onChange={e => setPassword2(e.target.value)}
          placeholder="Repite la contraseña"
          className="input w-full" />
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs">{error}</div>
      )}
      <button type="submit" disabled={loading}
        className="btn-primary w-full py-3 disabled:opacity-60">
        {loading ? 'Actualizando...' : 'Actualizar contraseña'}
      </button>
    </form>
  )
}

import { Suspense } from 'react'
export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-surface grain flex items-center justify-center px-4 py-12">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-3xl">🔑</span>
          <h1 className="text-xl font-black mt-3 mb-1">Nueva contraseña</h1>
          <p className="text-white/40 text-sm">Elige una contraseña segura para tu cuenta.</p>
        </div>
        <Suspense fallback={<div className="text-white/30 text-sm text-center">Cargando...</div>}>
          <ResetPasswordContent />
        </Suspense>
        <div className="text-center mt-6">
          <Link href="/login" className="text-white/35 text-sm hover:text-white/60">← Volver al login</Link>
        </div>
      </div>
    </main>
  )
}
