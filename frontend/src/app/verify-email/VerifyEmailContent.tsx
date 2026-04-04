'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailContent() {
  const params   = useSearchParams()
  const token    = params.get('token')
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [msg,    setMsg]    = useState('')

  useEffect(() => {
    if (!token) { setStatus('error'); setMsg('Token de verificación no encontrado.'); return }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setStatus('success'); setMsg(d.message ?? '¡Email verificado!') }
        else      { setStatus('error');   setMsg(d.error  ?? 'Token inválido o expirado.') }
      })
      .catch(() => { setStatus('error'); setMsg('Error de conexión. Intenta de nuevo.') })
  }, [token])

  return (
    <main className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">
          {status === 'loading' && <span className="animate-spin inline-block">⏳</span>}
          {status === 'success' && '✅'}
          {status === 'error'   && '❌'}
        </div>

        <h1 className="text-2xl font-black mb-3">
          {status === 'loading' && 'Verificando tu email...'}
          {status === 'success' && '¡Email verificado!'}
          {status === 'error'   && 'Error de verificación'}
        </h1>

        <p className="text-white/50 text-sm mb-8">{msg}</p>

        {status === 'success' && (
          <Link href="/dashboard"
            className="inline-block bg-[#6366f1] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all">
            Ir al dashboard →
          </Link>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-white/30 text-xs">El link de verificación expira en 24 horas.</p>
            <Link href="/dashboard"
              className="block text-white/40 text-sm hover:text-white/70 underline">
              Volver al dashboard para reenviar el email
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
