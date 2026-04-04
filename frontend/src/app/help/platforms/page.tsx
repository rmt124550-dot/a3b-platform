import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Plataformas soportadas — Ayuda A3B Narrator' }

const PLATFORMS = [
  { name: 'Coursera',          plan: 'free',  icon: '🎓', color: 'text-emerald-400', url: 'coursera.org',
    steps: ['Abre cualquier curso con video','Activa los subtítulos en inglés (botón CC)','Haz clic en el ícono 🔊 y activa el narrador'],
    notes: 'Totalmente gratuito. No requiere cuenta.' },
  { name: 'YouTube',           plan: 'pro',   icon: '▶️', color: 'text-[#a5b4fc]',   url: 'youtube.com',
    steps: ['El video debe tener subtítulos CC disponibles','Actívalos desde el ícono CC del reproductor','Activa el narrador de A3B'],
    notes: 'Requiere plan PRO. Activa el trial de 7 días gratis.' },
  { name: 'Udemy',             plan: 'pro',   icon: '📚', color: 'text-[#a5b4fc]',   url: 'udemy.com',
    steps: ['Abre una lección de video en tu curso','Activa los subtítulos desde el reproductor','Activa A3B Narrator'],
    notes: 'Solo funciona en cursos con subtítulos activados.' },
  { name: 'edX',               plan: 'pro',   icon: '🏛️', color: 'text-[#a5b4fc]',   url: 'edx.org',
    steps: ['Abre una unidad de video','Activa la transcripción o subtítulos','Activa el narrador'],
    notes: 'Compatible con Open edX.' },
  { name: 'LinkedIn Learning', plan: 'pro',   icon: '💼', color: 'text-[#a5b4fc]',   url: 'linkedin.com/learning',
    steps: ['Abre cualquier curso de LinkedIn Learning','Activa los subtítulos CC','Activa A3B Narrator'],
    notes: 'Requiere cuenta de LinkedIn activa.' },
]

export default function PlatformsPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link href="/help" className="hover:text-white/60">← Centro de Ayuda</Link>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🎓</span>
          <h1 className="text-2xl font-black">Plataformas soportadas</h1>
        </div>
        <div className="space-y-6">
          {PLATFORMS.map(p => (
            <div key={p.name} className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {p.name}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      p.plan === 'free'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-[#6366f1]/30 bg-[#6366f1]/10 text-[#a5b4fc]'
                    }`}>
                      {p.plan === 'free' ? '🆓 FREE' : '⭐ PRO'}
                    </span>
                  </div>
                  <div className="text-white/30 text-xs">{p.url}</div>
                </div>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-white/55 mb-3">
                {p.steps.map(s => <li key={s}>{s}</li>)}
              </ol>
              {p.plan === 'pro' && (
                <div className="mt-4 bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-3 flex items-center justify-between gap-3">
                  <p className="text-white/40 text-xs">{p.notes}</p>
                  <Link href="/register?plan=pro"
                    className="flex-shrink-0 text-xs bg-[#6366f1] text-white font-bold px-3 py-1.5 rounded-lg hover:bg-[#5558e8] transition-all">
                    Probar gratis
                  </Link>
                </div>
              )}
              {p.plan === 'free' && (
                <p className="text-white/30 text-xs mt-2">✅ {p.notes}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 flex gap-3">
          <Link href="/help" className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg hover:border-white/25 hover:text-white/60 transition-all">← Volver a Ayuda</Link>
        </div>
      </div>
    </main>
  )
}
