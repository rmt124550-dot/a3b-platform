'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

interface Metrics {
  users: { total: number; pro: number; team: number; free: number; verified: number }
  revenue: { mrr: number; arr: number }
  ai?: { today: number; week: number; month: number; total: number; monthCostUsd: number; avgLatencyMs: number }
  usage?: { totalHistory: number; totalDictionary: number }
}

function fmt(n: number, prefix='$') {
  if (n >= 1000) return prefix + (n/1000).toFixed(1) + 'k'
  return prefix + n.toFixed(2)
}

export default function AdminPage() {
  const { user }  = useAuthStore()
  const router    = useRouter()
  const [m, setM] = useState<Metrics|null>(null)
  const [ai, setAi] = useState<any>(null)

  useEffect(() => {
    if (user && user.role !== 'admin') { router.replace('/dashboard'); return }
    api.get('/api/admin/metrics').then(r => setM(r.data)).catch(() => {})
    api.get('/api/admin/ai-metrics').then(r => setAi(r.data.ai)).catch(() => {})
  }, [user])

  if (!m) return <div className="p-8 text-white/30 text-sm">Cargando métricas...</div>

  const u = m.users; const rev = m.revenue

  return (
    <div className="p-4 md:p-8 max-w-5xl space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black">Panel Admin</h1>
        <span className="text-xs text-white/25">⬡ admin</span>
      </div>

      {/* ── Revenue ─────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Revenue</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'MRR',  value: fmt(rev?.mrr ?? 0),  sub:'mensual recurrente', color:'text-emerald-400' },
            { label:'ARR',  value: fmt(rev?.arr ?? 0),  sub:'anual proyectado',   color:'text-emerald-400' },
            { label:'PRO',  value: u.pro,                sub:'suscriptores activos',color:'text-[#a5b4fc]' },
            { label:'Team', value: u.team,               sub:'plan Team activo',   color:'text-violet-300' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4">
              <div className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-white/30 text-[10px] mt-0.5">{s.label}</div>
              <div className="text-white/20 text-[10px]">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Usuarios ────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Usuarios</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Total',     value: u.total },
            { label:'Verificados',value: u.verified, sub:`${u.total ? ((u.verified/u.total)*100).toFixed(0) : 0}% del total` },
            { label:'Free/Trial', value: u.free },
            { label:'Conversión', value: u.total ? `${(((u.pro+u.team)/u.total)*100).toFixed(1)}%` : '0%' },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-black">{s.value}</div>
              <div className="text-white/30 text-[10px] mt-0.5">{s.label}</div>
              {s.sub && <div className="text-white/20 text-[10px]">{s.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Metrics ──────────────────────────────────── */}
      {ai && (
        <section>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            IA — Groq Llama
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label:'Hoy',       value: ai.today,            color:'text-white' },
              { label:'Semana',    value: ai.week,             color:'text-white' },
              { label:'Mes',       value: ai.month,            color:'text-[#a5b4fc]' },
              { label:'Total AI',  value: ai.total,            color:'text-[#a5b4fc]' },
              { label:'Costo mes', value:`$${ai.monthCostUsd}`,color:'text-emerald-400' },
              { label:'Latencia',  value:`${ai.avgLatencyMs}ms`,color:'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#6366f1]/5 border border-[#6366f1]/15 rounded-xl p-3">
                <div className={`text-base sm:text-lg font-black ${s.color}`}>{s.value}</div>
                <div className="text-white/30 text-[10px] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-2">
            * Tokens estimados: 98/traducción · Costo: $0.065/M tokens (Llama 3.1 8B)
          </p>
        </section>
      )}

      {/* ── Links rápidos ───────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Acciones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href:'/admin/users',      label:'👥 Usuarios',    desc:'Gestionar cuentas' },
            { href:'/admin/selectors',  label:'🔍 Selectores',  desc:'CSS por plataforma' },
            { href:'/admin/affiliates', label:'💰 Afiliados',   desc:'Pagos y comisiones' },
            { href:'https://dashboard.stripe.com', label:'💳 Stripe', desc:'Pagos y suscripciones', external:true },
          ].map(item => (
            item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4 hover:border-white/15 transition-all">
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-white/30 text-xs mt-0.5">{item.desc}</div>
              </a>
            ) : (
              <a key={item.href} href={item.href}
                className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4 hover:border-white/15 transition-all">
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-white/30 text-xs mt-0.5">{item.desc}</div>
              </a>
            )
          ))}
        </div>
      </section>
    </div>
  )
}
