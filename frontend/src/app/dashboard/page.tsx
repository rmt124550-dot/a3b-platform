'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'

interface Stats {
  historyCount:    number
  dictionaryCount: number
  platformsCount:  number
  trialDaysLeft:   number | null
}

const PLAN_INFO: Record<string, { label: string; color: string; desc: string }> = {
  free: { label: 'Trial activo',  color: 'text-emerald-400',  desc: '36 días gratis · Todas las plataformas' },
  pro:  { label: 'PRO',          color: 'text-[#a5b4fc]',    desc: 'Acceso completo · Todas las plataformas' },
  team: { label: 'Team',         color: 'text-violet-400',   desc: 'Todo PRO · API · Usuarios ilimitados' },
}

const QUICK_ACTIONS = [
  { href: 'https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/tag/v2.5.0',
    icon: '⬇️', title: 'Descargar extensión v2.5.0',
    desc: 'Chrome · Edge · Firefox · Kiwi', external: true },
  { href: '/dashboard/billing', icon: '💳', title: 'Facturación',
    desc: 'Trial · Planes · Historial de pagos', external: false },
  { href: '/dashboard/history', icon: '📖', title: 'Mi historial',
    desc: 'Frases traducidas y narradas', external: false },
  { href: '/dashboard/dictionary', icon: '📚', title: 'Mi diccionario',
    desc: 'Términos técnicos personalizados', external: false },
  { href: '/dashboard/affiliates', icon: '💰', title: 'Afiliados',
    desc: 'Gana 30% por cada referido', external: false },
  { href: '/help', icon: '❓', title: 'Centro de ayuda',
    desc: 'Guías · Instalación · FAQ', external: false },
]

const PLATFORMS = [
  { name: 'Coursera',       icon: '🎓', plan: 'trial', url: 'coursera.org' },
  { name: 'YouTube',        icon: '▶️', plan: 'pro',   url: 'youtube.com' },
  { name: 'Udemy',          icon: '📚', plan: 'pro',   url: 'udemy.com' },
  { name: 'edX',            icon: '🏛️', plan: 'pro',   url: 'edx.org' },
  { name: 'LinkedIn',       icon: '💼', plan: 'pro',   url: 'linkedin.com/learning' },
  { name: 'Khan Academy',   icon: '🌿', plan: 'pro',   url: 'khanacademy.org' },
  { name: 'DataCamp',       icon: '📊', plan: 'pro',   url: 'datacamp.com' },
]

export default function DashboardPage() {
  const { user }   = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([
      api.get('/api/history?limit=1').catch(() => ({ data: { total: 0 } })),
      api.get('/api/dictionary?limit=1').catch(() => ({ data: { total: 0 } })),
    ]).then(([hist, dict]) => {
      setStats({
        historyCount:    hist.data.total    ?? 0,
        dictionaryCount: dict.data.total    ?? 0,
        platformsCount:  7,
        trialDaysLeft:   user?.trialDaysLeft ?? null,
      })
    })
  }, [user])

  const plan       = PLAN_INFO[user?.plan ?? 'free']
  const isPro      = user?.plan === 'pro' || user?.plan === 'team'
  const trialExp   = user?.trialExpired ?? false
  const daysLeft   = user?.trialDaysLeft ?? null

  return (
    <div className="p-4 md:p-8 max-w-4xl">

      {/* ── Saludo + plan ─────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">
          Hola{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-sm font-bold ${
            trialExp ? 'text-red-400' : plan.color
          }`}>
            {trialExp ? '⏰ Trial expirado' : plan.label}
          </span>
          <span className="text-white/25 text-xs">·</span>
          <span className="text-white/40 text-xs">
            {trialExp
              ? 'Activa PRO para recuperar el acceso'
              : daysLeft !== null && !isPro
              ? `${daysLeft} días restantes de prueba`
              : plan.desc}
          </span>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Plataformas',      value: `${stats?.platformsCount ?? 7}`,      icon: '🌐', note: 'soportadas' },
          { label: 'Frases narradas',  value: stats ? String(stats.historyCount)  : '—', icon: '◷', note: 'en historial', locked: !isPro && !trialExp },
          { label: 'En diccionario',   value: stats ? String(stats.dictionaryCount): '—', icon: '◉', note: 'términos', locked: !isPro && !trialExp },
          { label: 'Trial',            value: trialExp ? 'Expirado' : daysLeft !== null ? `${daysLeft}d` : isPro ? '∞' : '—',
            icon: isPro ? '⭐' : trialExp ? '⏰' : '🎁', note: isPro ? 'acceso PRO' : 'restantes' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <div className="flex items-start justify-between mb-1">
              <span className="text-xl">{s.icon}</span>
              {s.locked && <span className="text-[10px] text-white/20 bg-white/5 px-1.5 rounded">PRO</span>}
            </div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-white/30 text-xs mt-0.5">{s.note}</div>
          </div>
        ))}
      </div>

      {/* ── CTA upgrade si trial expirado ─────────────────── */}
      {trialExp && (
        <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-black text-sm text-red-300 mb-1">Tu período de prueba ha terminado</div>
            <div className="text-white/40 text-xs">Activa PRO para seguir usando A3B en todas las plataformas.</div>
          </div>
          <Link href="/dashboard/billing"
            className="flex-shrink-0 bg-[#6366f1] text-white font-black px-6 py-2.5 rounded-xl hover:bg-[#5558e8] transition-all text-sm whitespace-nowrap">
            🚀 Activar PRO — $4.99/mes
          </Link>
        </div>
      )}

      {/* ── Plataformas disponibles ────────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm">Plataformas disponibles</h2>
          <Link href="/help/platforms" className="text-white/30 text-xs hover:text-white/60">Ver guías →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLATFORMS.map(p => {
            const available = isPro || p.plan === 'trial' || (!trialExp && p.plan === 'pro')
            return (
              <div key={p.name} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs border transition-all ${
                available
                  ? 'bg-white/3 border-white/8 text-white/70 hover:border-white/15'
                  : 'border-white/4 text-white/20 cursor-default'
              }`}>
                <span className={available ? '' : 'opacity-30'}>{p.icon}</span>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className={`text-[10px] ${
                    p.plan === 'trial'
                      ? 'text-emerald-400/70'
                      : available ? 'text-[#a5b4fc]/60' : 'text-white/20'
                  }`}>
                    {p.plan === 'trial' ? 'Incluido en trial' : available ? '⭐ PRO activo' : '⭐ PRO'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Acciones rápidas ──────────────────────────────── */}
      <h2 className="font-bold text-sm mb-3">Acciones rápidas</h2>
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {QUICK_ACTIONS.map(action => (
          action.external ? (
            <a key={action.title} href={action.href} target="_blank" rel="noopener noreferrer"
              className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
              <div className="text-xl mb-2">{action.icon}</div>
              <div className="font-semibold text-sm">{action.title}</div>
              <div className="text-white/35 text-xs mt-0.5">{action.desc}</div>
            </a>
          ) : (
            <Link key={action.title} href={action.href}
              className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
              <div className="text-xl mb-2">{action.icon}</div>
              <div className="font-semibold text-sm">{action.title}</div>
              <div className="text-white/35 text-xs mt-0.5">{action.desc}</div>
            </Link>
          )
        ))}
      </div>

      {/* ── Versión ───────────────────────────────────────── */}
      <div className="text-white/15 text-xs text-center pt-4 border-t border-white/5">
        A3B Narrator v2.5.0 · <a href="https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/tag/v2.5.0"
          target="_blank" rel="noopener noreferrer" className="hover:text-white/40">Changelog</a>
      </div>
    </div>
  )
}
