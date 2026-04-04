import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Plataformas compatibles — A3B Narrator',
  description: '7 plataformas soportadas: Coursera, YouTube, Udemy, edX, LinkedIn Learning, Khan Academy y DataCamp. 36 días gratis.',
}

const PLATFORMS = [
  {
    name: 'Coursera', icon: '🎓', plan: 'trial', color: 'text-emerald-400',
    url: 'coursera.org',
    desc: 'Todos los cursos con subtítulos en inglés. Incluido en el trial de 36 días.',
    steps: [
      'Abre cualquier curso con video en Coursera',
      'Activa los subtítulos en inglés desde el reproductor (botón CC)',
      'Haz clic en el ícono de A3B Narrator en la barra del navegador',
      'Presiona "Activar Narrador"',
    ],
    notes: 'Incluido durante todo el trial. Sin restricciones.',
  },
  {
    name: 'YouTube', icon: '▶️', plan: 'pro', color: 'text-[#a5b4fc]',
    url: 'youtube.com',
    desc: 'Videos con subtítulos CC generados automáticamente o manuales.',
    steps: [
      'El video debe tener subtítulos CC disponibles',
      'Actívalos desde el ícono CC del reproductor de YouTube',
      'Activa A3B Narrator',
    ],
    notes: 'Disponible durante el trial de 36 días y con plan PRO.',
  },
  {
    name: 'Udemy', icon: '📚', plan: 'pro', color: 'text-[#a5b4fc]',
    url: 'udemy.com',
    desc: 'Cursos técnicos y profesionales. Compatible con subtítulos automáticos.',
    steps: [
      'Abre una lección de video en tu curso de Udemy',
      'Activa los subtítulos desde el reproductor (ícono CC)',
      'Activa A3B Narrator',
    ],
    notes: 'Disponible durante el trial de 36 días y con plan PRO.',
  },
  {
    name: 'edX', icon: '🏛️', plan: 'pro', color: 'text-[#a5b4fc]',
    url: 'edx.org',
    desc: 'Cursos universitarios de MIT, Harvard, Stanford y más.',
    steps: [
      'Abre una unidad de video en tu curso de edX',
      'Activa la transcripción o subtítulos desde el reproductor',
      'Activa A3B Narrator',
    ],
    notes: 'Compatible con Open edX. Disponible durante trial y PRO.',
  },
  {
    name: 'LinkedIn Learning', icon: '💼', plan: 'pro', color: 'text-[#a5b4fc]',
    url: 'linkedin.com/learning',
    desc: 'Cursos de negocios, tecnología y habilidades profesionales.',
    steps: [
      'Abre cualquier curso de LinkedIn Learning',
      'Activa los subtítulos CC desde el reproductor',
      'Activa A3B Narrator',
    ],
    notes: 'Requiere cuenta de LinkedIn activa. Disponible durante trial y PRO.',
  },
  {
    name: 'Khan Academy', icon: '🌿', plan: 'pro', color: 'text-[#a5b4fc]',
    url: 'khanacademy.org',
    desc: 'Videos de matemáticas, ciencias, programación y más. Completamente gratuito.',
    steps: [
      'Abre cualquier video de Khan Academy',
      'Activa los subtítulos desde el reproductor',
      'Activa A3B Narrator desde el popup',
    ],
    notes: 'Disponible durante el trial de 36 días y con plan PRO. Contenido 100% gratuito.',
  },
  {
    name: 'DataCamp', icon: '📊', plan: 'pro', color: 'text-[#a5b4fc]',
    url: 'datacamp.com',
    desc: 'Cursos de Data Science, Python, R, Machine Learning y análisis de datos.',
    steps: [
      'Abre una lección de video en DataCamp',
      'Activa los subtítulos desde el reproductor del curso',
      'Activa A3B Narrator',
    ],
    notes: 'Disponible durante el trial de 36 días y con plan PRO.',
  },
]

export default function PlatformsPage() {
  return (
    <main className="min-h-screen bg-surface grain px-6 py-12 max-w-3xl mx-auto">
      <Link href="/help" className="text-white/30 hover:text-white/60 text-sm mb-6 block">
        ← Centro de ayuda
      </Link>

      <h1 className="text-3xl font-black mb-2">Plataformas compatibles</h1>
      <p className="text-white/40 text-sm mb-8">
        A3B Narrator funciona en <strong className="text-white/70">7 plataformas</strong>.
        Todas disponibles durante el <strong className="text-emerald-400">trial de 36 días</strong> — sin tarjeta.
      </p>

      {/* Resumen de acceso */}
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-emerald-400 font-bold text-sm mb-1">🎁 Durante el trial (36 días)</div>
          <div className="text-white/50 text-xs">Acceso completo a las 7 plataformas. Sin tarjeta requerida.</div>
        </div>
        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-4">
          <div className="text-[#a5b4fc] font-bold text-sm mb-1">⭐ Con plan PRO ($4.99/mes)</div>
          <div className="text-white/50 text-xs">Acceso ilimitado + DeepL + 10 idiomas + historial + diccionario.</div>
        </div>
      </div>

      {/* Lista de plataformas */}
      <div className="space-y-4">
        {PLATFORMS.map(p => (
          <div key={p.name} className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h2 className="font-black text-lg">{p.name}</h2>
                  <a href={`https://${p.url}`} target="_blank" rel="noopener noreferrer"
                    className="text-white/30 text-xs hover:text-white/60">{p.url}</a>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                p.plan === 'trial'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-[#6366f1]/30 bg-[#6366f1]/10 text-[#a5b4fc]'
              }`}>
                {p.plan === 'trial' ? '🆓 Trial' : '⭐ PRO'}
              </span>
            </div>
            <p className="text-white/50 text-sm mb-4">{p.desc}</p>
            <div className="bg-black/20 rounded-xl p-4">
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Cómo activar</p>
              <ol className="space-y-1.5">
                {p.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="text-[#6366f1] font-bold flex-shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            {p.notes && (
              <p className="text-white/30 text-xs mt-3 flex items-start gap-1.5">
                <span className="flex-shrink-0">ℹ️</span> {p.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-2xl p-6 text-center">
        <h3 className="font-black mb-2">¿Listo para empezar?</h3>
        <p className="text-white/40 text-sm mb-4">36 días gratis en todas las plataformas — sin tarjeta.</p>
        <Link href="/register"
          className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
          Empezar trial gratuito →
        </Link>
      </div>
    </main>
  )
}
