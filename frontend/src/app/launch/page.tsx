import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A3B Narrator en Product Hunt — IA para estudiar en tu idioma',
  description: 'Votamos en Product Hunt. A3B Narrator usa Llama 3.1 para narrar subtítulos de Coursera, YouTube y Udemy en español con IA contextual. 36 días gratis.',
}

export default function ProductHuntPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center
                     px-4 py-12 text-center">

      {/* Logo PH */}
      <div className="mb-8">
        <div className="text-6xl sm:text-7xl mb-4">🔊</div>
        <div className="inline-flex items-center gap-2 bg-[#ff6154]/10 border border-[#ff6154]/30
                        rounded-full px-4 py-2 text-sm font-bold text-[#ff6154] mb-6">
          🐱 Disponible en Product Hunt
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 max-w-xl leading-tight">
        A3B Narrator — Estudia en tu idioma con IA
      </h1>
      <p className="text-white/45 text-sm sm:text-base max-w-lg mb-8">
        Extensión Chrome que usa <strong className="text-white/80">Llama 3.1</strong> para traducir
        y narrar subtítulos de Coursera, YouTube, Udemy y más.
        Contexto del video · Glosario técnico · 10 idiomas · 36 días gratis.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 w-full max-w-xl">
        {[
          { n:'7', label:'Plataformas' },
          { n:'10', label:'Idiomas' },
          { n:'200ms', label:'Latencia IA' },
          { n:'$0', label:'Setup' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl py-3 px-2">
            <div className="text-xl sm:text-2xl font-black text-[#6366f1]">{s.n}</div>
            <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-10">
        <a href="https://www.producthunt.com/posts/a3b-narrator"
          target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-[#ff6154] text-white font-black py-4 rounded-xl
                     hover:bg-[#e5564a] transition-all text-sm flex items-center justify-center gap-2">
          🐱 Votar en Product Hunt
        </a>
        <Link href="/register"
          className="flex-1 bg-[#6366f1] text-white font-bold py-4 rounded-xl
                     hover:bg-[#5558e8] transition-all text-sm flex items-center justify-center gap-2">
          🎁 Probar gratis 36 días
        </Link>
      </div>

      {/* Testimonios rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full text-left mb-10">
        {[
          { t:'"Sin A3B hubiera abandonado Coursera. Ahora entiendo todo en español."', a:'Ahmed K.', role:'ML Engineer' },
          { t:'"La IA mantiene los términos técnicos correctos en toda la sesión."', a:'Camila F.', role:'Data Analyst' },
        ].map((r,i) => (
          <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-white/60 text-xs leading-relaxed mb-3">{r.t}</p>
            <div className="text-white/80 text-xs font-bold">{r.a}</div>
            <div className="text-white/30 text-[10px]">{r.role}</div>
          </div>
        ))}
      </div>

      <Link href="/" className="text-white/25 text-sm hover:text-white/50 transition-colors">
        Ver el sitio completo →
      </Link>
    </main>
  )
}
