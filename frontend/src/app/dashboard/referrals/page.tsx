'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface ReferralData {
  code: string; link: string; bonusDays: number
  referralsCount: number; daysEarned: number
}

export default function ReferralsDashboard() {
  const [data,   setData]   = useState<ReferralData|null>(null)
  const [copied, setCopied] = useState(false)
  const [loading,setLoading]= useState(true)

  useEffect(() => {
    api.get('/api/referrals/my-link').then(r => setData(r.data))
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  function copy() {
    if (!data?.link) return
    navigator.clipboard.writeText(data.link)
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  if (loading) return <div className="p-4 md:p-8 text-white/30 text-sm">Cargando...</div>

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <h1 className="text-xl sm:text-2xl font-black mb-2">Invita amigos</h1>
      <p className="text-white/40 text-sm mb-6">
        Cuando alguien se registra con tu link, <strong className="text-white/70">ambos ganan +{data?.bonusDays ?? 7} días</strong> de trial gratis.
        Sin límite de invitados.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label:'Invitados', value: data?.referralsCount ?? 0, icon:'👥' },
          { label:'Días ganados', value: data?.daysEarned ?? 0, icon:'🎁' },
          { label:'Por invitado', value: `+${data?.bonusDays ?? 7}d`, icon:'⏰' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-lg font-black">{s.value}</div>
            <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Link */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4 sm:p-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 sm:mb-3">
          Tu link de invitación
        </div>
        <div className="flex gap-2">
          <code className="flex-1 min-w-0 bg-black/30 border border-white/8 rounded-lg px-3 py-2.5
                           text-xs text-[#a5b4fc] truncate block">
            {data?.link ?? 'Cargando...'}
          </code>
          <button onClick={copy}
            className={`flex-shrink-0 px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold transition-all min-w-[72px] ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/6 text-white/60 border border-white/10 hover:bg-white/10'
            }`}>
            {copied ? '✅ Copiado' : '📋 Copiar'}
          </button>
        </div>
        <p className="text-white/25 text-xs mt-2">
          Compártelo en tus redes, email o grupos de estudio.
        </p>
      </div>

      {/* How it works */}
      <div className="mt-6 space-y-3">
        {[
          { n:'1', text:'Comparte tu link con amigos que quieren estudiar en inglés' },
          { n:'2', text:'Se registran con tu link → ambos reciben +7 días de trial' },
          { n:'3', text:'Sin límite — cada invitado suma más días' },
        ].map(s => (
          <div key={s.n} className="flex gap-3 text-sm text-white/50">
            <span className="w-6 h-6 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30
                             flex items-center justify-center text-xs font-bold text-[#6366f1] flex-shrink-0">
              {s.n}
            </span>
            {s.text}
          </div>
        ))}
      </div>
    </div>
  )
}
