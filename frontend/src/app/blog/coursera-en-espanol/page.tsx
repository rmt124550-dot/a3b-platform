import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo estudiar en Coursera en español — A3B Narrator',
  description: 'Coursera tiene 7,000+ cursos en inglés. Aprende a narrarlos en español en tiempo real con A3B Narrator. Guía paso a paso, gratis.',
  keywords: ['coursera en español', 'estudiar coursera español', 'subtítulos coursera español', 'narrador coursera'],
}

export default function ArticleCoursera() {
  return (
    <main className="min-h-screen bg-surface grain px-6 py-16 max-w-2xl mx-auto">
      <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 block">← Blog</Link>

      <div className="mb-8">
        <div className="text-5xl mb-4">🎓</div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/30 text-sm">4 abril 2026</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-sm">5 min lectura</span>
        </div>
        <h1 className="text-3xl font-black mb-4 leading-tight">
          Cómo estudiar en Coursera en español (sin perder el tiempo con subtítulos)
        </h1>
        <p className="text-white/50 text-base leading-relaxed">
          Coursera tiene más de 7,000 cursos en inglés. Si no dominas el idioma, te perdés el 95% del contenido.
          Aquí te explicamos cómo narrarlo todo en español en tiempo real.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-white/70 text-sm leading-relaxed">

        <h2 className="text-xl font-black text-white">El problema con estudiar en Coursera siendo hispanohablante</h2>
        <p>
          Coursera es la plataforma de educación online más grande del mundo. Tiene cursos de Stanford,
          MIT, Google, IBM y cientos de universidades más. El problema: casi todo el contenido premium está en inglés.
        </p>
        <p>
          Los subtítulos en español existen, pero son traducciones automáticas llenas de errores.
          Y si tu nivel de inglés no es avanzado, seguir una clase técnica de Machine Learning o Finanzas
          corporativas se vuelve un esfuerzo doble: entender el idioma y aprender el contenido.
        </p>

        <h2 className="text-xl font-black text-white">La solución: narración en tiempo real</h2>
        <p>
          <strong className="text-white">A3B Narrator</strong> es una extensión gratuita de Chrome que detecta
          los subtítulos en inglés de Coursera, los traduce automáticamente y los narra en voz alta en español.
          Sin configuración. Sin costo. Sin API keys.
        </p>

        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-5">
          <p className="font-bold text-emerald-400 mb-2">✅ Cómo funciona en 3 pasos:</p>
          <ol className="space-y-2 text-white/65">
            <li><strong className="text-white">1.</strong> Instala la extensión desde Chrome Web Store o GitHub</li>
            <li><strong className="text-white">2.</strong> Abre cualquier curso de Coursera y activa los subtítulos CC</li>
            <li><strong className="text-white">3.</strong> Haz clic en el ícono 🔊 y presiona "Activar Narrador"</li>
          </ol>
        </div>

        <h2 className="text-xl font-black text-white">Qué plataformas soporta</h2>
        <p>
          Durante los primeros 36 días (prueba gratuita sin tarjeta), tienes acceso a las 7 plataformas:
        </p>
        <ul className="space-y-1">
          {['🎓 Coursera — cursos universitarios y profesionales',
            '▶️ YouTube — videos educativos con CC',
            '📚 Udemy — cursos técnicos y de negocios',
            '🏛️ edX — MIT, Harvard, Stanford y más',
            '💼 LinkedIn Learning — habilidades profesionales',
            '🌿 Khan Academy — matemáticas, ciencias, programación',
            '📊 DataCamp — Data Science y Machine Learning',
          ].map(p => <li key={p} className="flex items-start gap-2"><span>✓</span><span>{p}</span></li>)}
        </ul>

        <h2 className="text-xl font-black text-white">¿Cuánto cuesta?</h2>
        <p>
          Los primeros <strong className="text-white">36 días son completamente gratuitos</strong>, sin tarjeta
          de crédito. Después, el plan PRO cuesta <strong className="text-white">$4.99/mes</strong> o
          <strong className="text-white"> $39.99/año</strong> (equivale a $3.33/mes).
        </p>
        <p>
          Para la mayoría de estudiantes, 36 días alcanza para completar 1 o 2 cursos completos.
          Es suficiente para evaluar si la herramienta vale la pena — y en ese tiempo ya vas a notar
          la diferencia en tu capacidad de aprendizaje.
        </p>

        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-5 text-center">
          <p className="font-bold text-white mb-2">Prueba A3B Narrator gratis</p>
          <p className="text-white/45 text-xs mb-4">36 días · Sin tarjeta · Sin límites</p>
          <Link href="/register"
            className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            Empezar ahora →
          </Link>
        </div>
      </div>
    </main>
  )
}
