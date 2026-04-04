'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

interface Metrics {
  users: { total: number; free: number; pro: number; team: number; emailVerified: number }
  revenue?: { mrr: number; arr: number }
}

interface User {
  id: string; email: string; name: string | null; plan: string
  role: string; emailVerified: boolean; createdAt: string
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const router   = useRouter()
  const [metrics,  setMetrics]  = useState<Metrics | null>(null)
  const [users,    setUsers]    = useState<User[]>([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'admin') { router.replace('/dashboard'); return }
    Promise.all([
      api.get('/api/admin/metrics').then(r => setMetrics(r.data)),
      api.get('/api/admin/users?limit=100').then(r => setUsers(r.data.users ?? [])),
    ]).finally(() => setLoading(false))
  }, [user])

  async function deleteUser(id: string, email: string) {
    if (!confirm(`¿Eliminar usuario ${email}?`)) return
    setDeleting(id)
    try {
      await api.delete(`/api/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch { alert('Error al eliminar') }
    finally { setDeleting(null) }
  }

  const filtered = users.filter(u =>
    search === '' ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="p-8 text-white/30 text-sm">Cargando panel admin...</div>
  )

  const u = metrics?.users
  const MRR = u ? (u.pro * 4.99 + u.team * 19.99) : 0
  const ARR = MRR * 12

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Panel Admin</h1>
        <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">
          👑 ADMIN
        </span>
      </div>

      {/* ── Métricas ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total usuarios', value: u?.total ?? 0,        color: 'text-white' },
          { label: 'Plan PRO',       value: u?.pro ?? 0,          color: 'text-[#a5b4fc]' },
          { label: 'Plan Team',      value: u?.team ?? 0,         color: 'text-violet-400' },
          { label: 'MRR estimado',   value: `$${MRR.toFixed(0)}`, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Métricas secundarias ─────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Plan Free',         value: u?.free ?? 0,          color: 'text-white/60' },
          { label: 'Emails verificados', value: u?.emailVerified ?? 0, color: 'text-emerald-400' },
          { label: 'ARR estimado',       value: `$${ARR.toFixed(0)}`,  color: 'text-emerald-400' },
          { label: 'Conversión Free→PRO',value: u?.total && u.total > 1
              ? `${((u.pro + u.team) / u.total * 100).toFixed(1)}%`
              : '—',                                                    color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Acciones rápidas ─────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer"
          className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
          <div className="text-2xl mb-2">💳</div>
          <div className="font-semibold text-sm">Stripe Dashboard</div>
          <div className="text-white/30 text-xs">Pagos y suscripciones</div>
        </a>
        <a href="https://app.resend.com" target="_blank" rel="noopener noreferrer"
          className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
          <div className="text-2xl mb-2">📧</div>
          <div className="font-semibold text-sm">Resend</div>
          <div className="text-white/30 text-xs">Emails enviados</div>
        </a>
        <Link href="/dashboard/affiliates"
          className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
          <div className="text-2xl mb-2">💰</div>
          <div className="font-semibold text-sm">Afiliados</div>
          <div className="text-white/30 text-xs">Comisiones y pagos</div>
        </Link>
      </div>

      {/* ── Lista de usuarios ─────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/6 flex items-center justify-between gap-4">
          <h2 className="font-bold text-sm">Usuarios ({users.length})</h2>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por email o nombre..."
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white w-48 sm:w-64 focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-white/6">
              <tr className="text-white/30 text-left">
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Plan</th>
                <th className="px-4 py-3 font-normal">Verificado</th>
                <th className="px-4 py-3 font-normal">Creado</th>
                <th className="px-4 py-3 font-normal">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(u => (
                <tr key={u.id} className="border-b border-white/4 hover:bg-white/2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.role === 'admin' && <span className="text-amber-400">👑</span>}
                      <div>
                        <div className="text-white/80">{u.email}</div>
                        {u.name && <div className="text-white/30">{u.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                      u.plan === 'pro'  ? 'border-[#6366f1]/30 bg-[#6366f1]/10 text-[#a5b4fc]' :
                      u.plan === 'team' ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' :
                      'border-white/10 bg-white/5 text-white/40'
                    }`}>
                      {u.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.emailVerified ? '✅' : '❌'}
                  </td>
                  <td className="px-4 py-3 text-white/35">
                    {new Date(u.createdAt).toLocaleDateString('es', { day:'numeric', month:'short', year:'2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        disabled={deleting === u.id}
                        className="text-red-400/60 hover:text-red-400 text-[10px] disabled:opacity-40">
                        {deleting === u.id ? '...' : 'Eliminar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 50 && (
            <div className="px-4 py-3 text-white/25 text-xs">
              Mostrando 50 de {filtered.length} usuarios
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
