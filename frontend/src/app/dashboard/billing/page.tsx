'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface Subscription {
  plan: string; status: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  trialEnd: string | null
}
interface Payment {
  id: string; amount: number; currency: string
  status: string; description: string
  receiptUrl: string | null; createdAt: string
}

export default function BillingPage() {
  const { user } = useAuthStore()
  const [sub, setSub] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    api.get('/api/billing/status').then(({ data }) => {
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

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
  const fmtMoney = (cents: number, currency: string) =>
    new Intl.NumberFormat('es', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-8 animate-fadeup">
        <h1 className="font-serif text-3xl mb-1">Facturación</h1>
        <p className="text-sm text-white/40">Gestiona tu suscripción y pagos</p>
      </div>

      {/* Current plan card */}
      <div className="card p-6 mb-5 animate-fadeup delay-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-white/35 uppercase tracking-widest font-semibold mb-2">Plan actual</div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-3xl capitalize">{user?.plan}</span>
              <span className={`badge text-[10px] ${
                sub?.status === 'active' ? 'badge-emerald' :
                sub?.status === 'trialing' ? 'badge-amber' :
                sub?.status === 'past_due' ? 'badge-rose' : 'badge-indigo'
              }`}>
                {sub?.status ?? 'free'}
              </span>
            </div>

            {sub?.trialEnd && new Date(sub.trialEnd) > new Date() && (
              <p className="text-xs text-amber/80 mt-2">
                ⏳ Prueba gratuita hasta el {fmt(sub.trialEnd)}
              </p>
            )}
            {sub?.currentPeriodEnd && (
              <p className="text-xs text-white/35 mt-2">
                {sub.cancelAtPeriodEnd
                  ? `⚠️ Cancela el ${fmt(sub.currentPeriodEnd)}`
                  : `Siguiente cobro: ${fmt(sub.currentPeriodEnd)}`}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {user?.plan !== 'free' ? (
              <button onClick={openPortal} disabled={portalLoading} className="btn-ghost text-sm px-4">
                {portalLoading ? '...' : 'Gestionar suscripción'}
              </button>
            ) : (
              <Link href="/pricing" className="btn-primary text-sm px-4">
                Actualizar plan →
              </Link>
            )}
          </div>
        </div>

        {/* Feature comparison */}
        {user?.plan === 'free' && (
          <div className="mt-5 pt-5 border-t border-white/6">
            <p className="text-xs text-white/40 mb-3">Con PRO desbloqueas:</p>
            <div className="grid grid-cols-2 gap-2">
              {['DeepL (mayor calidad)', 'Historial 30 días', '10 idiomas', 'Diccionario personal'].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="text-emerald">✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment history */}
      <div className="animate-fadeup delay-200">
        <h2 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">
          Historial de pagos
        </h2>
        {loading ? (
          <div className="card p-8 text-center text-white/30 text-sm">Cargando...</div>
        ) : payments.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-2xl mb-2 opacity-30">◇</div>
            <p className="text-sm text-white/35">No hay pagos registrados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className={`badge text-[10px] ${p.status === 'succeeded' ? 'badge-emerald' : 'badge-rose'}`}>
                    {p.status === 'succeeded' ? 'Pagado' : 'Fallido'}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{p.description}</div>
                    <div className="text-xs text-white/35 mt-0.5">{fmt(p.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-medium">{fmtMoney(p.amount, p.currency)}</span>
                  {p.receiptUrl && (
                    <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo hover:text-violet transition-colors">
                      Recibo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
