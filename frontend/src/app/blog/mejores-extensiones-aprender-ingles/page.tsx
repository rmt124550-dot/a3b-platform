import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Las mejores extensiones de Chrome para aprender inglés en 2026 — A3B Narrator',
  description: 'Comparamos las mejores extensiones de Chrome para aprender inglés mientras estudias online: traductores, narradores, diccionarios y más.',
  keywords: ['extensiones chrome aprender inglés','herramientas aprender inglés','extensión coursera español'],
}

const TOOLS = [
  { n:1, name:'A3B Narrator',    icon:'🔊', stars:'⭐⭐⭐⭐⭐', free:'36 días gratis',
    pros:['Narra subtítulos en tiempo real','Sin API keys','7 plataformas','Web Speech API nativa'],
    cons:['Solo funciona con subtítulos CC activados'],
    verdict:'La mejor opción si estudias en plataformas como Coursera, YouTube o Udemy.'},
  { n:2, name:'Google Translate', icon:'🌐', stars:'⭐⭐⭐⭐',  free:'Gratis',
    pros:['Traduce cualquier texto','Integrado en Chrome','Muy preciso en textos simples'],
    cons:['No narra automáticamente','No integra con reproductores de video'],
    verdict:'Útil para leer artículos, pero no para aprender de videos.'},
  { n:3, name:'Language Reactor', icon:'📺', stars:'⭐⭐⭐⭐',  free:'Plan gratuito limitado',
    pros:['Doble subtítulo en Netflix y YouTube','Flashcards integradas','Muy popular'],
    cons:['Solo Netflix y YouTube','No hace narración de voz','Plan PRO caro ($10/mes)'],
    verdict:'Excelente para practicar inglés con series, no tanto para cursos técnicos.'},
]

export default function ArticleExtensiones() {
  return (
    <main className="min-h-screen bg-surface grain px-6 py-16 max-w-2xl mx-auto">
      <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 block">← Blog</Link>
      <div className="mb-8">
        <div className="text-5xl mb-4">🔧</div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/30 text-sm">4 abril 2026</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-sm">7 min lectura</span>
        </div>
        <h1 className="text-3xl font-black mb-4 leading-tight">
          Las mejores extensiones de Chrome para aprender inglés en 2026
        </h1>
        <p className="text-white/50 text-base">
          Comparamos las herramientas más populares para aprender mientras estudias online.
        </p>
      </div>
      <div className="space-y-8 text-white/70 text-sm leading-relaxed">
        <p>
          Si estudias en plataformas en inglés como Coursera, YouTube o Udemy, las extensiones
          de Chrome pueden marcar una diferencia enorme. Aquí comparamos las mejores opciones en 2026.
        </p>
        {TOOLS.map(t => (
          <div key={t.n} className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <div className="font-black text-white">#{t.n} {t.name}</div>
                <div className="text-xs text-white/30">{t.stars} · {t.free}</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs font-bold text-emerald-400 mb-1.5">✅ Pros</div>
                <ul className="space-y-1">{t.pros.map(p => <li key={p} className="text-xs text-white/55">· {p}</li>)}</ul>
              </div>
              <div>
                <div className="text-xs font-bold text-red-400 mb-1.5">❌ Contras</div>
                <ul className="space-y-1">{t.cons.map(c => <li key={c} className="text-xs text-white/55">· {c}</li>)}</ul>
              </div>
            </div>
            <div className="bg-[#6366f1]/8 border border-[#6366f1]/15 rounded-lg p-3">
              <p className="text-xs text-[#a5b4fc]"><strong>Veredicto:</strong> {t.verdict}</p>
            </div>
          </div>
        ))}
        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-5 text-center">
          <p className="font-bold text-white mb-1">Prueba A3B Narrator gratis 36 días</p>
          <p className="text-white/35 text-xs mb-4">Sin tarjeta · Sin configuración</p>
          <Link href="/register" className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            Empezar ahora →
          </Link>
        </div>
      </div>
    </main>
  )
}
