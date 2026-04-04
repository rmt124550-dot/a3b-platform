'use client'
import Link from 'next/link'

interface Props {
  daysLeft: number | null
  expired: boolean
  plan: string
}

export default function TrialBanner({ daysLeft, expired, plan }: Props) {
  if (plan === 'pro' || plan === 'team') return null

  if (expired) return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-start gap-2">
        <span className="text-red-400 flex-shrink-0 mt-0.5">⏰</span>
        <div>
          <div className="text-red-300 font-bold text-sm">Tu período de prueba ha terminado</div>
          <div className="text-red-300/60 text-xs mt-0.5">
            Activa PRO para seguir usando A3B Narrator en todas las plataformas.
          </div>
        </div>
      </div>
      <Link href="/dashboard/billing"
        className="flex-shrink-0 bg-[#6366f1] text-white font-black px-5 py-2.5 rounded-xl hover:bg-[#5558e8] transition-all text-sm whitespace-nowrap">
        🚀 Activar PRO — $4.99/mes
      </Link>
    </div>
  )

  if (daysLeft !== null && daysLeft <= 7) return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-start gap-2">
        <span className="text-amber-400 flex-shrink-0 mt-0.5">⚠️</span>
        <div>
          <div className="text-amber-200 font-bold text-sm">
            {daysLeft === 0
              ? 'Tu prueba termina hoy'
              : `Tu prueba termina en ${daysLeft} día${daysLeft === 1 ? '' : 's'}`
            }
          </div>
          <div className="text-amber-200/50 text-xs mt-0.5">
            Activa PRO para no perder el acceso a YouTube, Udemy, edX y más.
          </div>
        </div>
      </div>
      <Link href="/dashboard/billing"
        className="flex-shrink-0 bg-amber-500 text-white font-black px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-sm whitespace-nowrap">
        Mantener acceso →
      </Link>
    </div>
  )

  // Trial activo con más de 7 días — mostrar barra de progreso sutil
  if (daysLeft !== null && daysLeft > 7) return (
    <div className="bg-white/2 border border-white/6 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2.5">
        <span className="text-emerald-400 text-sm">🎁</span>
        <span className="text-white/50 text-xs">
          Prueba gratuita — <strong className="text-white/70">{daysLeft} días restantes</strong>
        </span>
      </div>
      <Link href="/pricing" className="text-[#a5b4fc] text-xs hover:underline flex-shrink-0">
        Ver planes →
      </Link>
    </div>
  )

  return null
}
