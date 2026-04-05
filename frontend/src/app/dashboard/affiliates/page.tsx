'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface AffiliateData {
  id: string; code: string; status: string
  referralLink: string; referralCount: number; activeCount: number
  totalEarned: number; totalPaid: number; pendingAmount: number
  paypalEmail: string | null; commissionRate: number
  referrals: Array<{
    id: string; status: string; plan: string
    commissionTotal: number; createdAt: string
    referredUser: { email: string; plan: string }
  }>
  payouts: Array<{
    id: string; amount: number; method: string; status: string; paidAt: string | null
  }>
}

export default function AffiliateDashboardPage() {
  const [data,      setData]      = useState<AffiliateData | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [joining,   setJoining]   = useState(false)
  const [notMember, setNotMember] = useState(false)
  const [paypal,    setPaypal]    = useState('')
  const [copied,    setCopied]    = useState(false)

  useEffect(() => {
    api.get('/api/affiliates/me')
      .then(r => setData(r.data.affiliate))
      .catch(e => { if (e.response?.status === 404) setNotMember(true) })
      .finally(() => setLoading(false))
  }, [])

  async function join() {
    setJoining(true)
    try {
      const { data: d } = await api.post('/api/affiliates/join')
      setData(d.affiliate); setNotMember(false)
      toast.success('¡Bienvenido al programa de afiliados!')
    } catch { toast.error('Error al unirte. Inténtalo de nuevo.') }
    finally { setJoining(false) }
  }

  async function savePaypal() {
    try {
      await api.patch('/api/affiliates/me', { paypalEmail: paypal })
      toast.success('Email de PayPal guardado')
    } catch { toast.error('Email inválido') }
  }

  function copyLink() {
    if (!data?.referralLink) return
    navigator.clipboard.writeText(data.referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fmt     = (n: number) => `$${n.toFixed(2)}`
  const fmtDate = (s: string) => new Date(s).toLocaleDateString('es', { month: 'short', day: 'numeric', year: '2-digit' })

  if (loading) return <div className="p-4 md:p-8 text-white/30 text-sm">Cargando...</div>

  /* ── Pantalla de unirse ─────────────────────────────────── */
  if (notMember) return (
    <div className="p-4 md:p-8 max-w-lg">
      <h1 className="text-xl sm:text-2xl font-black mb-2">Programa de Afiliados</h1>
      <p className="text-white/40 text-sm mb-6">
        Gana el 30% de comisión por cada usuario PRO durante 12 meses.
      </p>
      <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-6 space-y-3 text-sm text-white/55">
        {[
          ['💰','30% de comisión por 12 meses'],
          ['🔗','Link único de referido personalizado'],
          ['📊','Dashboard con estadísticas en tiempo real'],
          ['💸','Pagos mensuales vía PayPal'],
        ].map(([icon, text]) => (
          <div key={text as string} className="flex gap-3">
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>
      <button onClick={join} disabled={joining}
        className="w-full bg-emerald-500 text-white font-black py-4 rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-60 text-sm">
        {joining ? '⏳ Uniéndome...' : '🚀 Unirme al programa gratis'}
      </button>
      <p className="text-white/25 text-xs mt-3 text-center">Sin costos ni requisitos mínimos</p>
    </div>
  )

  if (!data) return null

  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-4 sm:space-y-6">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-black">Programa de Afiliados</h1>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
          data.status === 'active'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-white/10 bg-white/5 text-white/40'
        }`}>
          {data.status === 'active' ? '✅ Activo' : data.status}
        </span>
      </div>

      {/* ── Stats — 2x2 en mobile, 4 en desktop ────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Referidos',    value: data.referralCount,       color:'text-white' },
          { label:'Activos',      value: data.activeCount,         color:'text-emerald-400' },
          { label:'Total ganado', value: fmt(data.totalEarned),    color:'text-[#a5b4fc]' },
          { label:'Pendiente',    value: fmt(data.pendingAmount),  color:'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4">
            <div className={`text-lg sm:text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Link de referido ────────────────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4 sm:p-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 sm:mb-3">
          Tu link de referido
        </div>
        <div className="flex gap-2">
          <code className="flex-1 min-w-0 bg-black/30 border border-white/8 rounded-lg px-3 py-2.5 text-xs text-[#a5b4fc] truncate block">
            {data.referralLink}
          </code>
          <button onClick={copyLink}
            className={`flex-shrink-0 px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold transition-all min-w-[72px] ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/6 text-white/60 border border-white/10 hover:bg-white/10'
            }`}>
            {copied ? '✅ Copiado' : '📋 Copiar'}
          </button>
        </div>
        <p className="text-white/25 text-xs mt-2">
          Comisión: <strong className="text-emerald-400">{(data.commissionRate * 100).toFixed(0)}%</strong> durante 12 meses
        </p>
      </div>

      {/* ── PayPal ──────────────────────────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4 sm:p-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 sm:mb-3">
          Email de PayPal para cobros
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={paypal || data.paypalEmail || ''}
            onChange={e => setPaypal(e.target.value)}
            placeholder="tu@paypal.com"
            className="flex-1 min-w-0 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366f1]/50"
          />
          <button onClick={savePaypal}
            className="flex-shrink-0 bg-[#6366f1] text-white font-bold px-4 py-2.5 rounded-lg text-sm hover:bg-[#5558e8] transition-all">
            Guardar
          </button>
        </div>
        <p className="text-white/25 text-xs mt-2">Mínimo $50 acumulado para solicitar pago</p>
      </div>

      {/* ── Referidos ───────────────────────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/6 flex items-center justify-between">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Referidos ({data.referralCount})
          </div>
        </div>
        {data.referrals.length === 0 ? (
          <div className="px-4 sm:px-5 py-8 sm:py-10 text-center">
            <div className="text-3xl mb-2">🔗</div>
            <p className="text-white/25 text-sm">Aún no tienes referidos.</p>
            <p className="text-white/20 text-xs mt-1">Comparte tu link para empezar a ganar.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {data.referrals.map(ref => (
              <div key={ref.id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-white/2">
                <div className="min-w-0">
                  <div className="text-white/70 text-sm truncate">{ref.referredUser.email}</div>
                  <div className="text-white/30 text-xs">{fmtDate(ref.createdAt)} · {ref.plan.toUpperCase()}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-400 font-bold text-sm">{fmt(ref.commissionTotal)}</div>
                  <div className={`text-[10px] ${
                    ref.status==='active' ? 'text-emerald-400' :
                    ref.status==='pending' ? 'text-amber-400' : 'text-white/25'
                  }`}>{ref.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Pagos ───────────────────────────────────────────── */}
      {data.payouts.length > 0 && (
        <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/6">
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Pagos recibidos</div>
          </div>
          <div className="divide-y divide-white/5">
            {data.payouts.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 sm:px-5 py-3">
                <div>
                  <div className="font-bold text-emerald-400 text-sm">{fmt(p.amount)}</div>
                  <div className="text-white/30 text-xs">{p.method.toUpperCase()} · {p.paidAt ? fmtDate(p.paidAt) : 'Pendiente'}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.status==='paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Link a página pública ───────────────────────────── */}
      <div className="text-center pt-2">
        <Link href="/affiliates" className="text-white/25 text-xs hover:text-white/50 transition-colors">
          Ver página pública del programa →
        </Link>
      </div>

    </div>
  )
}
