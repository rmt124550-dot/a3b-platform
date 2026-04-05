import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo estudiar Data Science en español en 2026 — A3B',
  description: 'Guía de las mejores plataformas y cursos de Data Science en inglés que puedes narrar en español con IA. Coursera, DataCamp, edX y más.',
  keywords: ['data science español','aprender data science español','cursos data science hispano'],
}

export default function ArticleDataScience() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto">
      <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 block">← Blog</Link>

      <div className="mb-8">
        <div className="text-5xl mb-4">📊</div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/30 text-sm">4 abril 2026</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-sm">8 min lectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
          Cómo estudiar Data Science en español en 2026
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          El 90% del contenido premium de Data Science está en inglés.
          Con A3B Narrator + Llama 3.1, puedes narrar todo en tu idioma con terminología técnica correcta.
        </p>
      </div>

      <div className="space-y-6 text-white/70 text-sm leading-relaxed">
        <h2 className="text-lg sm:text-xl font-black text-white">El problema del Data Science en español</h2>
        <p>
          Coursera, DataCamp, edX y Udemy tienen miles de cursos de Python, Machine Learning,
          estadística y visualización. El problema: casi todo está en inglés, y los subtítulos
          automáticos en español son imprecisos con términos como "backpropagation",
          "gradient descent" o "cross-validation".
        </p>

        <h2 className="text-lg sm:text-xl font-black text-white">Por qué Llama 3.1 es mejor para tecnicismos</h2>
        <p>
          A diferencia de Google Translate, Llama 3.1 8B (disponible en el plan PRO de A3B) 
          recuerda el contexto de las últimas 5 frases y extrae automáticamente el glosario 
          técnico del curso. Resultado: "backpropagation" siempre se traduce igual durante 
          toda la sesión, y el código Python nunca se traduce.
        </p>

        <div className="bg-white/3 border border-white/8 rounded-xl p-4 font-mono text-xs">
          <p className="text-white/30 mb-2">Google Translate (Trial):</p>
          <p className="text-white/50">"backpropagation" → "retropropagación" (frase 1)</p>
          <p className="text-white/50">"backpropagation" → "propagación hacia atrás" (frase 15)</p>
          <p className="text-white/30 mt-3 mb-2">Llama 3.1 PRO — con glosario:</p>
          <p className="text-white/80">"backpropagation" → "backpropagación" ✓ (siempre igual)</p>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white">Las mejores plataformas para Data Science</h2>
        <div className="space-y-3">
          {[
            {p:'DataCamp', i:'📊', d:'La mejor para Python, R y SQL. Ejercicios interactivos + videos. A3B narra los videos con Llama.'},
            {p:'Coursera', i:'🎓', d:'IBM Data Science, Google Data Analytics, Andrew Ng ML. Auditoría gratuita disponible.'},
            {p:'edX', i:'🏛️', d:'MIT MicroMasters en Statistics & Data Science. Contenido universitario de alta calidad.'},
            {p:'Kaggle', i:'🏆', d:'Cursos gratuitos de ML con competencias reales. Videos con subtítulos CC compatibles con A3B.'},
          ].map(r => (
            <div key={r.p} className="flex gap-3 bg-white/3 border border-white/8 rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{r.i}</span>
              <div>
                <div className="font-bold text-sm text-white">{r.p}</div>
                <div className="text-white/45 text-xs mt-0.5">{r.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-5 text-center">
          <p className="font-bold text-white mb-1">🤖 Narración con IA — PRO</p>
          <p className="text-white/35 text-xs mb-4">Llama 3.1 + glosario técnico automático · 36 días gratis</p>
          <Link href="/register?plan=pro"
            className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            Activar narrador con IA →
          </Link>
        </div>
      </div>
    </main>
  )
}
