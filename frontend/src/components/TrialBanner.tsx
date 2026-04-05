'use client'
import Link from 'next/link'

interface Props {
  daysLeft:  number | null
  expired:   boolean
  plan:      string
}

export default function TrialBanner({ daysLeft, expired, plan }: Props) {
  // No mostrar si ya es PRO o Team
  if (plan === 'pro' || plan === 'team') return null

  // No mostrar si no estamos en trial
  if (daysLeft === null && !expired) return null

  // Expirado
  if (expired || (daysLeft !== null && daysLeft <= 0)) {
    return (
      <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3 sm:p-4
                      flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-red-400 text-xl">🔒</span>
          <div>
            <div className="font-black text-sm text-red-300">Tu período de prueba ha terminado</div>
            <div className="text-white/40 text-xs mt-0.5">
              Activa PRO para recuperar el acceso completo a todas las plataformas.
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
          <Link href="/dashboard/billing"
            className="flex-1 sm:flex-none bg-[#6366f1] text-white font-black
                       px-4 py-2.5 rounded-xl hover:bg-[#5558e8] transition-all
                       text-xs text-center whitespace-nowrap">
            🚀 Activar PRO — $4.99/mes
          </Link>
          <Link href="/dashboard/billing"
            className="border border-emerald-500/30 text-emerald-400 font-bold
                       px-4 py-2.5 rounded-xl hover:bg-emerald-500/10 transition-all
                       text-xs text-center whitespace-nowrap">
            Anual -33%
          </Link>
        </div>
      </div>
    )
  }

  // Urgente (≤ 3 días)
  if (daysLeft !== null && daysLeft <= 3) {
    return (
      <div className="bg-amber-500/8 border border-amber-500/30 rounded-xl p-3 sm:p-4
                      flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-xl">⏰</span>
          <div>
            <div className="font-black text-sm text-amber-300">
              {daysLeft === 0 ? 'Tu trial termina hoy' : `${daysLeft} día${daysLeft === 1 ? '' : 's'} restantes`}
            </div>
            <div className="text-white/40 text-xs mt-0.5">
              Activa PRO para no perder el acceso. 36 días de datos guardados.
            </div>
          </div>
        </div>
        <Link href="/dashboard/billing"
          className="w-full sm:w-auto bg-amber-500 text-black font-black
                     px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all
                     text-xs text-center whitespace-nowrap">
          Activar ahora →
        </Link>
      </div>
    )
  }

  // Aviso moderado (4-10 días)
  if (daysLeft !== null && daysLeft <= 10) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4
                      flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[#a5b4fc] text-xl">🎁</span>
          <div className="text-sm">
            <span className="text-white/60">
              Te quedan <strong className="text-white/85">{daysLeft} días</strong> de trial gratis.
            </span>
            <Link href="/dashboard/referrals" className="ml-2 text-[#6366f1] hover:underline text-xs">
              Invita amigos y gana +7 días →
            </Link>
          </div>
        </div>
        <Link href="/dashboard/billing"
          className="flex-shrink-0 text-xs border border-[#6366f1]/30 text-[#a5b4fc]
                     px-4 py-2 rounded-lg hover:bg-[#6366f1]/10 transition-all whitespace-nowrap">
          Ver planes PRO
        </Link>
      </div>
    )
  }

  // Trial OK — no mostrar nada (no molestar al usuario)
  return null
}
