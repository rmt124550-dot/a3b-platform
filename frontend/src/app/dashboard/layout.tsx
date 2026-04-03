'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

const NAV = [
  { href: '/dashboard',            icon: '◈', label: 'Overview' },
  { href: '/dashboard/history',    icon: '◷', label: 'Historial' },
  { href: '/dashboard/dictionary', icon: '◉', label: 'Diccionario' },
  { href: '/dashboard/settings',   icon: '◎', label: 'Configuración' },
  { href: '/dashboard/billing',    icon: '◇', label: 'Facturación' },
]

const PLAN_COLORS: Record<string, string> = {
  free: 'plan-free', pro: 'plan-pro', team: 'plan-team'
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) router.replace('/login')
  }, [])

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

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-60 border-r border-white/6 bg-s1 flex flex-col fixed h-full z-40">
        <div className="h-16 flex items-center px-5 border-b border-white/6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🔊</span>
            <span className="font-bold text-sm tracking-tight">
              A3B<span className="text-indigo"> Narrator</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-indigo/15 text-indigo' : 'text-white/45 hover:text-white/80 hover:bg-white/4'
                }`}>
                <span className="font-mono text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
          {user.role === 'admin' && (
            <Link href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mt-4 ${
                pathname.startsWith('/admin') ? 'bg-amber-500/15 text-amber-400' : 'text-white/30 hover:text-amber-400/70'
              }`}>
              <span className="font-mono text-base leading-none">⬡</span>Admin
            </Link>
          )}
        </nav>
        <div className="border-t border-white/6 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo/20 border border-indigo/30 flex items-center justify-center text-xs font-bold text-indigo">
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
      </aside>
      <main className="flex-1 ml-60 min-h-screen">{children}</main>
    </div>
  )
}
