'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface Metrics {
  users: { total: number; free: number; pro: number; team: number }
  revenue: { total: number; mrr: string }
  activity: { translationsToday: number }
  recentSignups: Array<{ id: string; name: string; email: string; plan: string; createdAt: string }>
}
interface User {
  id: string; email: string; name: string | null
  plan: string; role: string; createdAt: string; lastLoginAt: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') { router.replace('/dashboard'); return }
    loadMetrics()
  }, [user, router])

  useEffect(() => { loadUsers() }, [search, planFilter, page])

  async function loadMetrics() {
    try {
      const { data } = await api.get('/api/admin/metrics')
      setMetrics(data)
    } catch { toast.error('Error al cargar métricas') }
  }

  async function loadUsers() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (planFilter) params.set('plan', planFilter)
      const { data } = await api.get(`/api/admin/users?${params}`)
      setUsers(data.users)
      setTotal(data.total)
    } catch {} finally { setLoading(false) }
  }

  async function changePlan(id: string, plan: string) {
    try {
      await api.patch(`/api/admin/users/${id}`, { plan })
      toast.success(`Plan actualizado a ${plan}`)
      loadUsers()
    } catch { toast.error('Error') }
  }

  async function suspendUser(id: string) {
    if (!confirm('¿Suspender este usuario?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      toast.success('Usuario suspendido')
      loadUsers()
    } catch { toast.error('Error') }
  }

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('es', { month: 'short', day: 'numeric', year: '2-digit' })
  const PLAN_BADGE: Record<string, string> = {
    free: 'badge text-[10px] plan-free', pro: 'badge text-[10px] plan-pro', team: 'badge text-[10px] plan-team'
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8 animate-fadeup">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-amber-400 text-sm">⬡ Admin</span>
        </div>
        <h1 className="font-serif text-3xl">Panel de administración</h1>
      </div>

      {/* Metrics grid */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeup delay-100">
          {[
            { label: 'MRR', value: `$${metrics.revenue.mrr}`, sub: 'Mensual recurrente', color: 'text-emerald' },
            { label: 'Ingresos totales', value: `$${metrics.revenue.total.toFixed(0)}`, sub: 'Histórico', color: 'text-indigo' },
            { label: 'Usuarios', value: metrics.users.total, sub: `${metrics.users.pro} PRO · ${metrics.users.team} Team`, color: 'text-white' },
            { label: 'Traducciones hoy', value: metrics.activity.translationsToday, sub: 'Actividad del día', color: 'text-violet' },
          ].map((m) => (
            <div key={m.label} className="card p-5">
              <div className={`font-mono text-2xl font-medium mb-1 ${m.color}`}>{m.value}</div>
              <div className="text-xs font-semibold text-white/60">{m.label}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Plan breakdown */}
      {metrics && (
        <div className="card p-5 mb-6 animate-fadeup delay-200">
          <h2 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-4">Distribución de planes</h2>
          <div className="flex items-center gap-4">
            {[
              { label: 'Free', count: metrics.users.free, color: 'bg-white/10' },
              { label: 'PRO', count: metrics.users.pro, color: 'bg-indigo/60' },
              { label: 'Team', count: metrics.users.team, color: 'bg-violet/60' },
            ].map((p) => (
              <div key={p.label} className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-white/50">{p.label}</span>
                  <span className="font-mono">{p.count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color} transition-all duration-700`}
                    style={{ width: `${metrics.users.total ? (p.count/metrics.users.total*100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="animate-fadeup delay-300">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            className="input flex-1 text-sm"
            placeholder="Buscar por email o nombre..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          <select
            className="input w-auto text-sm"
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1) }}
          >
            <option value="">Todos los planes</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="team">Team</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/6 text-[10px] font-bold text-white/25 uppercase tracking-widest">
            <div className="col-span-4">Usuario</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-2">Registro</div>
            <div className="col-span-2">Último acceso</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-center text-white/30 text-sm">Cargando...</div>
          ) : users.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/30 text-sm">No se encontraron usuarios</div>
          ) : (
            users.map((u, i) => (
              <div
                key={u.id}
                className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center text-sm transition-colors hover:bg-white/2 ${
                  i < users.length - 1 ? 'border-b border-white/4' : ''
                }`}
              >
                <div className="col-span-4 min-w-0">
                  <div className="font-medium truncate">{u.name ?? '—'}</div>
                  <div className="text-xs text-white/35 truncate">{u.email}</div>
                </div>
                <div className="col-span-2">
                  <span className={PLAN_BADGE[u.plan] ?? PLAN_BADGE.free}>{u.plan}</span>
                </div>
                <div className="col-span-2 text-xs text-white/40 font-mono">{fmt(u.createdAt)}</div>
                <div className="col-span-2 text-xs text-white/40 font-mono">
                  {u.lastLoginAt ? fmt(u.lastLoginAt) : '—'}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <select
                    value={u.plan}
                    onChange={(e) => changePlan(u.id, e.target.value)}
                    className="bg-s2 border border-white/8 rounded-lg px-2 py-1 text-xs text-white/70 outline-none"
                  >
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="team">team</option>
                  </select>
                  <button
                    onClick={() => suspendUser(u.id)}
                    className="text-white/20 hover:text-rose text-xs transition-colors"
                    title="Suspender"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {total > 20 && (
          <div className="flex items-center justify-between mt-4 text-xs text-white/35">
            <span className="font-mono">{total} usuarios en total</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn-ghost text-xs px-3 py-1.5">←</button>
              <span className="font-mono px-2 py-1.5">Pág {page} / {Math.ceil(total/20)}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page >= Math.ceil(total/20)} className="btn-ghost text-xs px-3 py-1.5">→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
