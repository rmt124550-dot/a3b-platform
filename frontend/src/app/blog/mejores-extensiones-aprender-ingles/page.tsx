import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mejores extensiones Chrome para aprender inglés 2026 — A3B Narrator',
  description: 'Las mejores extensiones de Chrome para estudiar en plataformas online en inglés. Comparamos A3B Narrator, Google Translate, Language Reactor y más.',
  keywords: ['extensiones chrome aprender inglés', 'herramientas aprender inglés online', 'extensión coursera español'],
}

type Tool = {
  n: number; name: string; icon: string; stars: string; free: string
  pros: string[]; cons: string[]; verdict: string
}

const TOOLS: Tool[] = [
  {
    n: 1, name: 'A3B Narrator', icon: '🔊', stars: '⭐⭐⭐⭐⭐', free: '36 días gratis',
    pros: [
      'Narra subtítulos en tiempo real en español',
      'Sin API keys — funciona al instante',
      '7 plataformas (Coursera, YouTube, Udemy, edX...)',
      'Web Speech API nativa del navegador',
    ],
    cons: ['Solo funciona con subtítulos CC activados'],
    verdict: 'La mejor opción si estudias en plataformas como Coursera, YouTube o Udemy.',
  },
  {
    n: 2, name: 'Google Translate', icon: '🌐', stars: '⭐⭐⭐⭐', free: 'Gratis',
    pros: [
      'Traduce cualquier texto en la página',
      'Integrado directamente en Chrome',
      'Muy preciso en textos simples',
    ],
    cons: [
      'No narra automáticamente',
      'No se integra con reproductores de video',
    ],
    verdict: 'Útil para leer artículos, pero no para aprender desde videos.',
  },
  {
    n: 3, name: 'Language Reactor', icon: '📺', stars: '⭐⭐⭐⭐', free: 'Plan gratuito limitado',
    pros: [
      'Doble subtítulo en Netflix y YouTube',
      'Flashcards integradas para vocabulario',
      'Muy popular entre estudiantes de idiomas',
    ],
    cons: [
      'Solo funciona en Netflix y YouTube',
      'No hace narración de voz',
      'Plan PRO caro ($10/mes)',
    ],
    verdict: 'Excelente para practicar inglés con series, no tanto para cursos técnicos.',
  },
]

export default function ArticleExtensiones() {
  return (
    <main className="min-h-screen bg-surface grain px-6 py-16 max-w-2xl mx-auto">
      <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 block">
        ← Blog
      </Link>

      <div className="mb-10">
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
          Cuál vale la pena y cuál no.
        </p>
      </div>

      <div className="space-y-4 text-sm leading-relaxed mb-8">
        <p className="text-white/65">
          Si estudias en plataformas en inglés como Coursera, YouTube o Udemy, las extensiones
          de Chrome pueden marcar una diferencia enorme. Aquí comparamos las mejores opciones en 2026.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        {TOOLS.map(tool => (
          <div key={tool.n} className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <div className="font-black text-white text-base">#{tool.n} {tool.name}</div>
                <div className="text-xs text-white/30">{tool.stars} · {tool.free}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-bold text-emerald-400 mb-2">✅ Pros</div>
                <ul className="space-y-1">
                  {tool.pros.map((p, i) => (
                    <li key={i} className="text-xs text-white/55">· {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-bold text-red-400 mb-2">❌ Contras</div>
                <ul className="space-y-1">
                  {tool.cons.map((c, i) => (
                    <li key={i} className="text-xs text-white/55">· {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#6366f1]/8 border border-[#6366f1]/15 rounded-lg p-3">
              <p className="text-xs text-[#a5b4fc]">
                <strong className="font-bold">Veredicto: </strong>{tool.verdict}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-2xl p-6 text-center">
        <p className="font-black text-white mb-2">Prueba A3B Narrator gratis</p>
        <p className="text-white/35 text-sm mb-4">36 días · Sin tarjeta · Sin configuración</p>
        <Link href="/register"
          className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
          Empezar ahora →
        </Link>
      </div>
    </main>
  )
}
