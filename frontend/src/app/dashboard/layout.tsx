'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import VerifyEmailBanner from '@/components/VerifyEmailBanner'

const NAV = [
  { href: '/dashboard',            icon: '◈', label: 'Overview' },
  { href: '/dashboard/history',    icon: '◷', label: 'Historial' },
  { href: '/dashboard/dictionary', icon: '◉', label: 'Diccionario' },
  { href: '/dashboard/settings',   icon: '◎', label: 'Ajustes' },
  { href: '/dashboard/billing',    icon: '◇', label: 'Facturación' },
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

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) router.replace('/login')
  }, [])

  // Cerrar sidebar al navegar (mobile)
  useEffect(() => { setSidebarOpen(false) }, [pathname])

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
        {/* Cerrar sidebar en mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto text-white/30 hover:text-white/70 lg:hidden p-1">
          ✕
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-indigo/15 text-indigo' : 'text-white/45 hover:text-white/80 hover:bg-white/4'
              }`}>
              <span className="font-mono text-base leading-none w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
        {user.role === 'admin' && (
          <Link href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mt-4 ${
              pathname.startsWith('/admin') ? 'bg-amber-500/15 text-amber-400' : 'text-white/30 hover:text-amber-400/70'
            }`}>
            <span className="font-mono text-base leading-none w-5 text-center">⬡</span>
            Admin
          </Link>
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
            Salir
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-surface flex">

      {/* ── Overlay mobile (tap fuera para cerrar) ─────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar desktop: siempre visible ──────────────────────────── */}
      <aside className="hidden lg:flex w-60 border-r border-white/6 bg-s1 flex-col fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile: slide-in drawer ───────────────────────────── */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-s1 border-r border-white/6 flex flex-col z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">

        {/* Top bar — solo mobile/tablet */}
        <header className="lg:hidden sticky top-0 z-20 h-14 bg-surface/95 backdrop-blur border-b border-white/6 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all"
            aria-label="Abrir menú">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">🔊</span>
            <span className="font-bold text-sm">A3B<span className="text-indigo"> Narrator</span></span>
          </Link>
          <div className="ml-auto">
            <span className={`badge text-[10px] ${PLAN_COLORS[user.plan] ?? 'plan-free'}`}>
              {user.plan.toUpperCase()}
            </span>
          </div>
        </header>

        {/* Verify email banner */}
        {user && !user.emailVerified && (
          <div className="px-4 md:px-8 pt-4">
            <VerifyEmailBanner email={user.email ?? ''} />
          </div>
        )}

        {/* Page content */}
        <div className="flex-1 pb-20 lg:pb-0">
          {children}
        </div>

        {/* ── Bottom nav — solo mobile ───────────────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface/95 backdrop-blur border-t border-white/6 flex items-center">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all ${
                  active ? 'text-indigo' : 'text-white/30 hover:text-white/60'
                }`}>
                <span className={`text-lg leading-none ${active ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </span>
                <span className="text-[9px] font-semibold tracking-wide leading-none">
                  {item.label.slice(0,6)}
                </span>
              </Link>
            )
          })}
        </nav>

      </main>
    </div>
  )
}
