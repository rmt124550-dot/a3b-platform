'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'

interface Stats {
  historyCount: number
  dictionaryCount: number
  settings: { targetLang: string; translator: string }
}

const PLAN_INFO: Record<string, { label: string; color: string; limit: string }> = {
  free: { label: 'Free',  color: 'text-white/40', limit: 'Google TTS · Solo EN→ES' },
  pro:  { label: 'Pro',   color: 'text-indigo',   limit: 'DeepL · 10 idiomas · Historial 30d' },
  team: { label: 'Team',  color: 'text-violet',   limit: 'Todo PRO · API · SRT export' },
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/api/user/profile').then(({ data }) => {
      setStats({
        historyCount: data.user._count.history,
        dictionaryCount: data.user._count.dictionary,
        settings: data.user.settings,
      })
    }).catch(() => {})
  }, [])

  const plan = PLAN_INFO[user?.plan ?? 'free']
  const hour = new Date().getHours()
  const greeting = hour < 13 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-10 animate-fadeup">
        <p className="text-sm text-white/35 font-mono mb-1">{greeting} —</p>
        <h1 className="font-serif text-4xl">{user?.name ?? 'Usuario'}</h1>
        <div className="flex items-center gap-3 mt-3">
          <span className={`badge badge-indigo text-[10px] ${user?.plan === 'team' ? 'badge-violet' : ''}`}>
            {plan.label}
          </span>
          <span className="text-xs text-white/35">{plan.limit}</span>
          {user?.plan === 'free' && (
            <Link href="/pricing" className="text-xs text-indigo hover:text-violet transition-colors font-medium">
              Actualizar a PRO →
            </Link>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeup delay-100">
        {[
          { label: 'Traducciones guardadas', value: stats?.historyCount ?? '—', icon: '◷', locked: user?.plan === 'free' },
          { label: 'Términos en diccionario', value: stats?.dictionaryCount ?? '—', icon: '◉', locked: user?.plan === 'free' },
          { label: 'Motor de traducción', value: stats?.settings?.translator?.toUpperCase() ?? 'Google', icon: '⟳', locked: false },
          { label: 'Idioma destino', value: stats?.settings?.targetLang?.toUpperCase() ?? 'ES', icon: '◎', locked: false },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 relative overflow-hidden">
            {stat.locked && (
              <div className="absolute inset-0 bg-surface/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                <Link href="/pricing" className="text-xs text-indigo font-medium hover:underline">Requiere PRO</Link>
              </div>
            )}
            <div className="font-mono text-indigo text-lg mb-2">{stat.icon}</div>
            <div className="font-mono text-2xl font-medium mb-1">{stat.value}</div>
            <div className="text-xs text-white/35">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="animate-fadeup delay-200">
        <h2 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Acceso rápido</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { href: '/docs', icon: '↓', title: 'Instalar extensión', desc: 'Chrome, Edge, Firefox, Kiwi' },
            { href: '/dashboard/settings', icon: '◎', title: 'Configurar voz', desc: 'Velocidad, tono, idioma' },
            user?.plan === 'free'
              ? { href: '/pricing', icon: '↑', title: 'Actualizar a PRO', desc: 'DeepL · Historial · 10 idiomas' }
              : { href: '/dashboard/history', icon: '◷', title: 'Ver historial', desc: 'Tus traducciones guardadas' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="card p-5 group hover:border-indigo/40 transition-all">
              <div className="font-mono text-white/30 group-hover:text-indigo text-xl mb-3 transition-colors">{item.icon}</div>
              <div className="font-medium text-sm mb-1">{item.title}</div>
              <div className="text-xs text-white/35">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Extension status */}
      <div className="mt-6 card p-5 flex items-center gap-4 animate-fadeup delay-300">
        <div className="w-10 h-10 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald text-lg flex-shrink-0">
          🔊
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Extensión A3B Narrator v2.0.0</div>
          <div className="text-xs text-white/35 mt-0.5">Chrome · Edge · Firefox · Kiwi Browser · Android Bookmarklet</div>
        </div>
        <Link href="/docs" className="btn-ghost text-xs px-4 py-2 flex-shrink-0">
          Instalar
        </Link>
      </div>
    </div>
  )
}
