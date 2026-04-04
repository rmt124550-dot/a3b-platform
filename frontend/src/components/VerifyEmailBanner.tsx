'use client'
import { useState } from 'react'

interface Props { email: string }

export default function VerifyEmailBanner({ email }: Props) {
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)

  async function resend() {
    setLoading(true)
    try {
      const token = localStorage.getItem('a3b_access_token') || ''
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (r.ok) setSent(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-sm mb-6">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 flex-shrink-0">⚠️</span>
        <span className="text-amber-200/80">
          Confirma tu email <strong className="text-amber-200">{email}</strong> para acceder a todas las funciones.
        </span>
      </div>
      {sent ? (
        <span className="text-emerald-400 text-xs flex-shrink-0">✓ Enviado</span>
      ) : (
        <button onClick={resend} disabled={loading}
          className="text-amber-300 hover:text-amber-100 underline underline-offset-2 flex-shrink-0 disabled:opacity-50">
          {loading ? 'Enviando...' : 'Reenviar'}
        </button>
      )}
    </div>
  )
}
