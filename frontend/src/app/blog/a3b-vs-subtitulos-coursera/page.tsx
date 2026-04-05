import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A3B Narrator vs subtítulos en español de Coursera — Comparativa 2026',
  description: '¿Los subtítulos automáticos en español de Coursera son suficientes? Comparamos A3B Narrator (IA) vs subtítulos manuales y por qué la narración en voz alta cambia todo.',
  keywords: ['subtitulos coursera español','subtitulos automaticos coursera','narrador coursera','a3b narrator'],
}

export default function ArticleA3BvsSubtitulos() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto">
      <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 block">← Blog</Link>

      <div className="mb-8">
        <div className="text-5xl mb-4">⚡</div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/30 text-sm">4 abril 2026</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-sm">5 min lectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
          A3B Narrator vs subtítulos en español de Coursera — ¿Cuál es mejor?
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          Coursera tiene subtítulos en español para muchos cursos. Pero ¿son suficientes?
          Comparamos calidad, cobertura y el impacto de escuchar vs leer.
        </p>
      </div>

      <div className="space-y-6 text-white/70 text-sm leading-relaxed">
        <h2 className="text-lg sm:text-xl font-black text-white">El problema de los subtítulos de Coursera</h2>
        <p>
          Los subtítulos en español de Coursera son traducciones automáticas o humanas
          de baja calidad que se actualizan raramente. En cursos técnicos como Machine Learning
          o Finanzas, la terminología suele ser incorrecta o inconsistente.
        </p>

        {/* Tabla comparativa */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[420px]">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-white/40 font-normal">Característica</th>
                <th className="text-center px-4 py-3 text-white/40 font-normal">Subtítulos Coursera</th>
                <th className="text-center px-4 py-3 text-[#a5b4fc] font-bold">A3B PRO (Llama 3.1)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cobertura', '~30% de cursos', '100% con CC en inglés'],
                ['Calidad técnica', '⚠️ Variable', '✅ Glosario automático'],
                ['Narración en voz', '❌ Solo texto', '✅ Audio en tiempo real'],
                ['Contexto del video', '❌ Frase por frase', '✅ Últimas 5 frases'],
                ['Actualización', '❌ Meses de retraso', '✅ En tiempo real'],
                ['10 idiomas', '❌ Solo español', '✅ Todos los idiomas'],
                ['Precio', 'Gratis', '$4.99/mes o 36d gratis'],
              ].map(([feat, sub, a3b]) => (
                <tr key={feat as string} className="border-t border-white/5">
                  <td className="px-4 py-3 font-medium text-white/70">{feat}</td>
                  <td className="px-4 py-3 text-center text-white/45">{sub}</td>
                  <td className="px-4 py-3 text-center text-emerald-400 font-medium">{a3b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white">El factor clave: escuchar vs leer</h2>
        <p>
          Los estudios de aprendizaje muestran que procesar información por dos canales
          simultáneos (audio + visual) mejora la retención en un 40-65%. Con A3B Narrator,
          escuchas la traducción mientras ves el video — sin dividir la atención para leer subtítulos.
        </p>

        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-5 text-center">
          <p className="font-bold text-white mb-4">Prueba A3B gratis 36 días</p>
          <Link href="/register"
            className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            Empezar ahora →
          </Link>
        </div>
      </div>
    </main>
  )
}
