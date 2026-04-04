'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface Subscription {
  plan: string; status: string
  currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean; trialEnd: string | null
}
interface Payment {
  id: string; amount: number; currency: string
  status: string; description: string; receiptUrl: string | null; createdAt: string
}

export default function BillingPage() {
  const { user } = useAuthStore()
  const [sub,      setSub]      = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading,  setLoading]  = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState('')

  useEffect(() => {
    api.get('/api/billing/subscription').then(({ data }) => {
      setSub(data.subscription)
      setPayments(data.payments ?? [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function openPortal() {
    setPortalLoading(true)
    try {
      const { data } = await api.post('/api/billing/portal')
      window.location.href = data.url
    } catch { toast.error('Error al abrir el portal') }
    finally { setPortalLoading(false) }
  }

  async function upgrade(planId: string) {
    setCheckoutLoading(planId)
    try {
      const { data } = await api.post('/api/billing/checkout', { plan: planId })
      window.location.href = data.url
    } catch { toast.error('Error al iniciar el checkout') }
    finally { setCheckoutLoading('') }
  }

  const fmt      = (iso: string) => new Date(iso).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
  const fmtMoney = (cents: number, currency: string) =>
    new Intl.NumberFormat('es', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)

  const isPro       = user?.plan === 'pro' || user?.plan === 'team'
  const trialDays   = user?.trialDaysLeft ?? null
  const trialExpired= user?.trialExpired ?? false

  const trialEndDate = user?.trialEndsAt
    ? new Date(user.trialEndsAt).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-6">
      <h1 className="text-2xl font-black">Facturación</h1>

      {/* ── Estado del trial o suscripción ──────────────── */}
      {!isPro && (
        <div className={`border rounded-2xl p-6 ${
          trialExpired
            ? 'bg-red-500/8 border-red-500/25'
            : trialDays !== null && trialDays <= 6
            ? 'bg-amber-500/8 border-amber-500/25'
            : 'bg-emerald-500/8 border-emerald-500/20'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-black text-lg mb-1">
                {trialExpired
                  ? '🔒 Tu período de prueba ha terminado'
                  : trialDays === 0
                  ? '⏰ Tu prueba termina hoy'
                  : trialDays !== null && trialDays <= 6
                  ? `⚠️ Tu prueba termina en ${trialDays} día${trialDays===1?'':'s'}`
                  : `🎁 Prueba gratuita activa`
                }
              </div>
              {!trialExpired && trialEndDate && (
                <div className="text-white/50 text-sm">
                  Válida hasta el <strong className="text-white/70">{trialEndDate}</strong>
                  {trialDays !== null && ` · ${trialDays} días restantes`}
                </div>
              )}
              {trialExpired && (
                <div className="text-white/50 text-sm">
                  Activa PRO para recuperar el acceso completo a todas las plataformas.
                </div>
              )}
            </div>
            {!trialExpired && trialDays !== null && trialDays <= 10 && (
              <span className={`text-2xl font-black flex-shrink-0 ${trialDays<=6?'text-amber-400':'text-emerald-400'}`}>
                {trialDays}d
              </span>
            )}
          </div>

          {/* Upgrade buttons */}
          {(!isPro) && (
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button onClick={() => upgrade('pro')} disabled={!!checkoutLoading}
                className="flex-1 bg-[#6366f1] text-white font-black py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm disabled:opacity-60">
                {checkoutLoading==='pro' ? '⏳ Redirigiendo...' : '🚀 Activar PRO — $4.99/mes'}
              </button>
              <button onClick={() => upgrade('pro_annual')} disabled={!!checkoutLoading}
                className="flex-1 border border-emerald-500/30 text-emerald-400 font-bold py-3 rounded-xl hover:bg-emerald-500/10 transition-all text-sm disabled:opacity-60">
                {checkoutLoading==='pro_annual' ? '⏳...' : '🔥 PRO Anual — $39.99/año (33% off)'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Plan activo (PRO/Team) ───────────────────────── */}
      {isPro && !loading && (
        <div className="bg-[#6366f1]/8 border border-[#6366f1]/25 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-black text-lg">
                ⭐ Plan {user?.plan?.toUpperCase()} activo
              </div>
              {sub?.status === 'trialing' && sub.trialEnd && (
                <div className="text-emerald-400 text-sm mt-1">
                  🎁 Trial hasta el {fmt(sub.trialEnd)}
                </div>
              )}
              {sub?.status === 'active' && sub.currentPeriodEnd && (
                <div className="text-white/50 text-sm mt-1">
                  Próxima renovación: {fmt(sub.currentPeriodEnd)}
                  {sub.cancelAtPeriodEnd && ' · Cancelación programada'}
                </div>
              )}
            </div>
            <button onClick={openPortal} disabled={portalLoading}
              className="bg-white/8 border border-white/12 text-white/70 font-bold px-5 py-2.5 rounded-xl hover:bg-white/12 transition-all text-sm disabled:opacity-60">
              {portalLoading ? '⏳...' : '⚙️ Gestionar suscripción'}
            </button>
          </div>
        </div>
      )}

      {/* ── Historial de pagos ───────────────────────────── */}
      {payments.length > 0 && (
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6">
            <h2 className="font-bold text-sm">Historial de pagos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[460px]">
              <thead className="border-b border-white/5">
                <tr className="text-white/30 text-left text-xs">
                  <th className="px-6 py-3 font-normal">Fecha</th>
                  <th className="px-6 py-3 font-normal">Descripción</th>
                  <th className="px-6 py-3 font-normal">Monto</th>
                  <th className="px-6 py-3 font-normal">Estado</th>
                  <th className="px-6 py-3 font-normal">Recibo</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-white/4 hover:bg-white/2">
                    <td className="px-6 py-3 text-white/50">{fmt(p.createdAt)}</td>
                    <td className="px-6 py-3 text-white/70">{p.description || 'Suscripción A3B'}</td>
                    <td className="px-6 py-3 font-mono">{fmtMoney(p.amount, p.currency)}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        p.status === 'paid' || p.status === 'succeeded'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-3">
                      {p.receiptUrl && (
                        <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[#6366f1] text-xs hover:underline">
                          Ver →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {payments.length === 0 && !loading && isPro && (
        <div className="bg-white/3 border border-white/8 rounded-2xl px-6 py-8 text-center text-white/30 text-sm">
          Sin pagos aún — estás en el período de prueba.
        </div>
      )}

      {loading && (
        <div className="text-white/30 text-sm py-4">Cargando facturación...</div>
      )}

      <div className="text-white/25 text-xs">
        <p>¿Problemas con tu suscripción? <a href="mailto:hello@a3bhub.cloud" className="underline hover:text-white/50">hello@a3bhub.cloud</a></p>
      </div>
    </div>
  )
}
