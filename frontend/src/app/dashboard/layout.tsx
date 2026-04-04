'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import VerifyEmailBanner from '@/components/VerifyEmailBanner'
import TrialBanner       from '@/components/TrialBanner'

// ─── Navegación principal (sidebar + bottom nav) ──────────────────────────────
const NAV_MAIN = [
  { href: '/dashboard',            icon: '⊞', label: 'Inicio'      },
  { href: '/dashboard/history',    icon: '◷', label: 'Historial'   },
  { href: '/dashboard/billing',    icon: '◇', label: 'Facturación' },
  { href: '/dashboard/settings',   icon: '◎', label: 'Ajustes'     },
]

// ─── Navegación secundaria (solo sidebar + panel "Más") ───────────────────────
const NAV_SECONDARY = [
  { href: '/dashboard/dictionary', icon: '◉', label: 'Diccionario' },
  { href: '/dashboard/affiliates', icon: '💰', label: 'Afiliados'  },
  { href: '/help',                 icon: '❓', label: 'Ayuda'       },
]

const PLAN_COLORS: Record<string, string> = {
  free: 'plan-free', pro: 'plan-pro', team: 'plan-team'
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [mounted,     setMounted]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [moreOpen,    setMoreOpen]    = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) router.replace('/login')
  }, [])

  // Cerrar drawers al navegar
  useEffect(() => {
    setSidebarOpen(false)
    setMoreOpen(false)
  }, [pathname])

  async function handleLogout() {
    try { await api.post('/api/auth/logout') } catch {}
    logout()
    toast.success('Sesión cerrada')
    router.push('/')
  }

  if (!mounted || !user) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-white/40 text-sm">Cargando...</div>
    </div>
  )

  const allNav = [...NAV_MAIN, ...NAV_SECONDARY]
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  // ─── Contenido del sidebar ─────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/6 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
          <span className="text-xl">🔊</span>
          <span className="font-bold text-sm tracking-tight">
            A3B<span className="text-indigo"> Narrator</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto text-white/30 hover:text-white/70 lg:hidden p-1">
          ✕
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Principales */}
        <div className="space-y-0.5 mb-4">
          {NAV_MAIN.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-indigo/15 text-indigo'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/4'
              }`}>
              <span className="font-mono text-base leading-none w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Separador */}
        <div className="border-t border-white/6 mb-4" />

        {/* Secundarios */}
        <div className="space-y-0.5">
          {NAV_SECONDARY.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-indigo/15 text-indigo'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/4'
              }`}>
              <span className="font-mono text-base leading-none w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Admin */}
        {user.role === 'admin' && (
          <div className="mt-4 border-t border-white/6 pt-4">
            <Link href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-white/30 hover:text-amber-400/70'
              }`}>
              <span className="font-mono text-base leading-none w-5 text-center">⬡</span>
              Admin
            </Link>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/6 p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo/20 border border-indigo/30 flex items-center justify-center text-xs font-bold text-indigo flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name ?? 'Usuario'}</div>
            <div className="text-xs text-white/35 truncate">{user.email}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`badge text-[10px] ${PLAN_COLORS[user.plan] ?? 'plan-free'}`}>
            {user.plan.toUpperCase()}
          </span>
          <button onClick={handleLogout} className="text-xs text-white/30 hover:text-white/60 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-surface flex">

      {/* ── Overlay sidebar mobile ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Panel "Más" — overlay mobile ──────────────────────────────── */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden flex items-end"
          onClick={() => setMoreOpen(false)}>
          <div
            className="w-full bg-s1 border-t border-white/10 rounded-t-3xl p-5 pb-8"
            onClick={e => e.stopPropagation()}>

            {/* Handle */}
            <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5" />

            {/* Links secundarios */}
            <div className="space-y-1 mb-4">
              {NAV_SECONDARY.map(item => (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-indigo/15 text-indigo'
                      : 'text-white/60 hover:bg-white/6 hover:text-white/90'
                  }`}
                  onClick={() => setMoreOpen(false)}>
                  <span className="text-xl w-6 text-center">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                  {isActive(item.href) && <span className="ml-auto text-indigo text-xs">●</span>}
                </Link>
              ))}
            </div>

            {/* Admin (si aplica) */}
            {user.role === 'admin' && (
              <Link href="/admin"
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium text-amber-400/70 hover:bg-white/6 hover:text-amber-400 transition-all mb-4"
                onClick={() => setMoreOpen(false)}>
                <span className="text-xl w-6 text-center">⬡</span>
                <span className="font-semibold">Panel Admin</span>
              </Link>
            )}

            {/* Separador */}
            <div className="border-t border-white/8 my-4" />

            {/* Info usuario + logout */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo/20 border border-indigo/30 flex items-center justify-center text-sm font-bold text-indigo">
                  {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">{user.name ?? 'Usuario'}</div>
                  <div className="text-xs text-white/35">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => { setMoreOpen(false); handleLogout() }}
                className="text-xs text-white/30 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/8 font-medium">
                Salir →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar desktop ────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 border-r border-white/6 bg-s1 flex-col fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile (drawer) ────────────────────────────────────── */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-s1 border-r border-white/6 flex flex-col z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">

        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-20 h-14 bg-surface/95 backdrop-blur border-b border-white/6 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all"
            aria-label="Abrir menú">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg">🔊</span>
            <span className="font-bold text-sm">A3B<span className="text-indigo"> Narrator</span></span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {/* Trial badge si aplica */}
            {!['pro','team'].includes(user.plan) && user.trialDaysLeft !== null && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                (user.trialExpired || (user.trialDaysLeft ?? 36) <= 0)
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : (user.trialDaysLeft ?? 36) <= 6
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              }`}>
                {user.trialExpired ? '⏰ Expirado' : `🎁 ${user.trialDaysLeft}d`}
              </span>
            )}
            {['pro','team'].includes(user.plan) && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo/30 bg-indigo/10 text-indigo">
                ⭐ {user.plan.toUpperCase()}
              </span>
            )}
          </div>
        </header>

        {/* Banners */}
        {user && !user.emailVerified && (
          <div className="px-4 md:px-8 pt-4">
            <VerifyEmailBanner email={user.email ?? ''} />
          </div>
        )}
        {user && (user.trialExpired || (user.trialDaysLeft !== null && user.trialDaysLeft !== undefined)) && (
          <div className="px-4 md:px-8 pt-4">
            <TrialBanner
              daysLeft={user.trialDaysLeft ?? null}
              expired={user.trialExpired ?? false}
              plan={user.plan}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 pb-20 lg:pb-0">
          {children}
        </div>

        {/* ── Bottom nav mobile — 4 items + Más ─────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface/98 backdrop-blur-lg border-t border-white/8">
          <div className="flex items-stretch h-16">

            {/* Los 4 links principales */}
            {NAV_MAIN.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative ${
                    active ? 'text-indigo' : 'text-white/35 hover:text-white/60'
                  }`}>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo rounded-full" />
                  )}
                  <span className={`text-xl leading-none transition-transform ${active ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide leading-none">
                    {item.label}
                  </span>
                </Link>
              )
            })}

            {/* Botón "Más" */}
            <button
              onClick={() => setMoreOpen(true)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                moreOpen ? 'text-indigo' : 'text-white/35 hover:text-white/60'
              }`}>
              {/* Dot indicator si alguna secundaria está activa */}
              {NAV_SECONDARY.some(n => isActive(n.href)) && (
                <span className="absolute top-0 w-1.5 h-1.5 bg-indigo rounded-full -translate-y-0.5" />
              )}
              <span className="text-xl leading-none">
                {NAV_SECONDARY.some(n => isActive(n.href)) ? '⊟' : '⊡'}
              </span>
              <span className="text-[10px] font-semibold tracking-wide leading-none">
                Más
              </span>
            </button>
          </div>
        </nav>

      </main>
    </div>
  )
}
