'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'

interface Stats {
  historyCount:    number
  dictionaryCount: number
}

const PLATFORMS = [
  { name:'Coursera',      icon:'🎓', plan:'trial', url:'coursera.org' },
  { name:'YouTube',       icon:'▶️', plan:'pro',   url:'youtube.com' },
  { name:'Udemy',         icon:'📚', plan:'pro',   url:'udemy.com' },
  { name:'edX',           icon:'🏛️', plan:'pro',   url:'edx.org' },
  { name:'LinkedIn',      icon:'💼', plan:'pro',   url:'linkedin.com/learning' },
  { name:'Khan Academy',  icon:'🌿', plan:'pro',   url:'khanacademy.org' },
  { name:'DataCamp',      icon:'📊', plan:'pro',   url:'datacamp.com' },
]

const QUICK_ACTIONS = [
  { href:'https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/tag/v2.5.0',
    icon:'⬇️', title:'Descargar v2.5.0', desc:'Chrome · Edge · Firefox · Kiwi', external:true },
  { href:'/dashboard/billing',    icon:'💳', title:'Facturación',   desc:'Trial · Planes · Pagos' },
  { href:'/dashboard/history',    icon:'📖', title:'Historial',     desc:'Frases narradas' },
  { href:'/dashboard/dictionary', icon:'📚', title:'Diccionario',   desc:'Términos técnicos' },
  { href:'/dashboard/affiliates', icon:'💰', title:'Afiliados',     desc:'Gana 30% por referido' },
  { href:'/help',                 icon:'❓', title:'Ayuda',          desc:'Guías · FAQ' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats|null>(null)

  useEffect(() => {
    Promise.all([
      api.get('/api/history?limit=1').catch(() => ({ data: { total: 0 } })),
      api.get('/api/dictionary?limit=1').catch(() => ({ data: { total: 0 } })),
    ]).then(([hist, dict]) => setStats({
      historyCount:    hist.data.total ?? 0,
      dictionaryCount: dict.data.total ?? 0,
    }))
  }, [])

  const isPro       = user?.plan === 'pro' || user?.plan === 'team'
  const trialExp    = user?.trialExpired ?? false
  const daysLeft    = user?.trialDaysLeft ?? null

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl">

      {/* ── Saludo ───────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-black mb-1">
          Hola{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-bold ${
            trialExp ? 'text-red-400' :
            isPro    ? 'text-[#a5b4fc]' : 'text-emerald-400'
          }`}>
            {trialExp ? '⏰ Trial expirado' :
             isPro    ? `⭐ Plan ${user?.plan?.toUpperCase()}` :
             daysLeft !== null ? `🎁 ${daysLeft} días de trial` :
             '🎁 Trial activo'}
          </span>
          {trialExp && (
            <Link href="/dashboard/billing"
              className="text-xs text-[#6366f1] hover:underline">
              Activar PRO →
            </Link>
          )}
        </div>
      </div>

      {/* ── CTA upgrade si expirado ──────────────────────────── */}
      {trialExp && (
        <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="font-black text-sm text-red-300 mb-1">Tu período de prueba ha terminado</div>
            <div className="text-white/40 text-xs">Activa PRO para seguir usando A3B en todas las plataformas.</div>
          </div>
          <Link href="/dashboard/billing"
            className="w-full sm:w-auto flex-shrink-0 bg-[#6366f1] text-white font-black
                       px-5 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm text-center">
            🚀 Activar PRO — $4.99/mes
          </Link>
        </div>
      )}

      {/* ── Stats — 2x2 en mobile, 4 en desktop ─────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 sm:mb-6">
        {[
          { label:'Plataformas', value:'7',                              icon:'🌐', note:'soportadas' },
          { label:'Narradas',    value:stats ? String(stats.historyCount)  : '—', icon:'◷', note:'frases' },
          { label:'Diccionario', value:stats ? String(stats.dictionaryCount): '—', icon:'◉', note:'términos' },
          { label:'Trial',
            value: trialExp ? 'Expirado' : daysLeft !== null ? `${daysLeft}d` : isPro ? '∞' : '—',
            icon:  isPro ? '⭐' : trialExp ? '⏰' : '🎁',
            note:  isPro ? 'acceso PRO' : 'restantes' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4">
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-lg sm:text-xl font-black">{s.value}</div>
            <div className="text-white/30 text-xs">{s.note}</div>
          </div>
        ))}
      </div>


      {/* ── Motor AI activo ──────────────────────────────── */}
      <div className={`border rounded-xl p-4 mb-4 sm:mb-6 ${
        isPro && user?.plan === 'team'
          ? 'bg-violet-500/8 border-violet-500/25'
          : isPro
          ? 'bg-[#6366f1]/8 border-[#6366f1]/20'
          : 'bg-white/3 border-white/8'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
              isPro && user?.plan === 'team' ? 'bg-violet-500/15' :
              isPro ? 'bg-[#6366f1]/15' : 'bg-white/6'
            }`}>
              {isPro && user?.plan === 'team' ? '🚀' : isPro ? '🤖' : '🌐'}
            </div>
            <div>
              <div className="font-bold text-sm">
                {isPro && user?.plan === 'team'
                  ? 'Llama 4 Scout 17B'
                  : isPro
                  ? 'Llama 3.1 8B instant'
                  : 'Google Translate'}
              </div>
              <div className={`text-xs ${
                isPro ? 'text-violet-300' : 'text-white/35'
              }`}>
                {isPro && user?.plan === 'team'
                  ? '🚀 Motor AI Team — máxima calidad'
                  : isPro
                  ? '🤖 Motor AI PRO — contexto + glosario técnico'
                  : '🌐 Traducción rápida sin servidor'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
              isPro && user?.plan === 'team'
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : isPro
                ? 'bg-[#6366f1]/15 border-[#6366f1]/30 text-[#a5b4fc]'
                : 'bg-white/6 border-white/10 text-white/40'
            }`}>
              {isPro && user?.plan === 'team' ? '~300ms' : isPro ? '~200ms' : '~50ms'}
            </span>
            {!isPro && (
              <Link href="/dashboard/billing"
                className="text-xs bg-[#6366f1] text-white font-bold px-3 py-1.5 rounded-lg
                           hover:bg-[#5558e8] transition-all whitespace-nowrap">
                Activar IA →
              </Link>
            )}
          </div>
        </div>
        {isPro && (
          <div className="mt-3 pt-3 border-t border-white/6 grid grid-cols-3 gap-3 text-center">
            {[
              ['Contexto', '5 frases', 'últimas frases del video'],
              ['Glosario', 'Auto', 'términos técnicos del curso'],
              ['Latencia', isPro && user?.plan==='team' ? '~300ms' : '~200ms', 'por subtítulo'],
            ].map(([label, val, desc]) => (
              <div key={label as string}>
                <div className="text-white/70 font-bold text-xs sm:text-sm">{val}</div>
                <div className="text-white/25 text-[10px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Plataformas ──────────────────────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-bold text-sm">Plataformas</h2>
          <Link href="/help/platforms" className="text-white/30 text-xs hover:text-white/60">
            Ver guías →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLATFORMS.map(p => {
            const available = isPro || p.plan === 'trial' || (!trialExp && p.plan === 'pro')
            return (
              <div key={p.name}
                className={`flex items-center gap-2 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5
                             text-xs border transition-all ${
                  available
                    ? 'bg-white/3 border-white/8 text-white/70 hover:border-white/15'
                    : 'border-white/4 text-white/20'
                }`}>
                <span className={available ? '' : 'opacity-30'}>{p.icon}</span>
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className={`text-[10px] ${
                    p.plan === 'trial'
                      ? 'text-emerald-400/70'
                      : available ? 'text-[#a5b4fc]/60' : 'text-white/20'
                  }`}>
                    {p.plan === 'trial' ? 'Trial' : available ? 'PRO ✓' : 'PRO'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Acciones rápidas — 2 col mobile, 3 col desktop ───── */}
      <h2 className="font-bold text-sm mb-3">Acciones rápidas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {QUICK_ACTIONS.map(action =>
          action.external ? (
            <a key={action.title} href={action.href} target="_blank" rel="noopener noreferrer"
              className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4
                         hover:border-white/15 active:bg-white/5 transition-all">
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{action.icon}</div>
              <div className="font-semibold text-xs sm:text-sm leading-tight">{action.title}</div>
              <div className="text-white/35 text-[10px] sm:text-xs mt-0.5">{action.desc}</div>
            </a>
          ) : (
            <Link key={action.title} href={action.href}
              className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4
                         hover:border-white/15 active:bg-white/5 transition-all">
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{action.icon}</div>
              <div className="font-semibold text-xs sm:text-sm leading-tight">{action.title}</div>
              <div className="text-white/35 text-[10px] sm:text-xs mt-0.5">{action.desc}</div>
            </Link>
          )
        )}
      </div>

      {/* ── Versión ───────────────────────────────────────────── */}
      <div className="text-white/15 text-xs text-center pt-4 border-t border-white/5">
        A3B Narrator v2.5.0 ·{' '}
        <a href="https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/tag/v2.5.0"
          target="_blank" rel="noopener noreferrer"
          className="hover:text-white/40">
          Changelog
        </a>
      </div>
    </div>
  )
}
