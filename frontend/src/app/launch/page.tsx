import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A3B Narrator — Aprende en Coursera en Español | Product Hunt',
  description: 'La extensión gratuita de Chrome que traduce y narra los subtítulos de Coursera en español en tiempo real. Ahora en Product Hunt.',
}

export default function ProductHuntPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="px-6 py-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#da552f]/10 border border-[#da552f]/20 text-[#da552f] text-xs font-bold px-3 py-1.5 rounded-full mb-6">
          🚀 EN PRODUCT HUNT
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Aprende en Coursera<br />
          <span className="text-[#6366f1]">en tu idioma</span>
        </h1>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
          A3B Narrator traduce y narra los subtítulos de Coursera en español (y 9 idiomas más) en tiempo real. Gratis. Sin APIs. Sin configuración.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a href="https://www.producthunt.com/posts/a3b-narrator"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#da552f] text-white font-black px-8 py-4 rounded-xl hover:bg-[#c44a28] transition-all">
            <span className="text-xl">🦁</span>
            Votar en Product Hunt
          </a>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-[#6366f1] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#5558e8] transition-all">
            🎁 Probar gratis — 7 días PRO
          </Link>
        </div>

        {/* Demo gif / screenshot placeholder */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-12">
          <div className="text-6xl mb-4">🎧</div>
          <p className="text-white/50 text-sm">
            Instala la extensión → abre Coursera → activa subtítulos CC → escucha en español
          </p>
          <p className="text-white/25 text-xs mt-2">Sin registro. Sin API keys. Sin costo.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { n: '100%', label: 'Gratis para Coursera' },
            { n: '7',    label: 'Plataformas soportadas' },
            { n: '10',   label: 'Idiomas disponibles (PRO)' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-[#6366f1]">{s.n}</div>
              <div className="text-white/35 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4 text-left mb-12">
          {[
            { icon: '🎓', title: 'Coursera gratis', desc: 'Narración completa sin cuenta ni pago.' },
            { icon: '▶️', title: 'YouTube, Udemy, edX, LinkedIn', desc: 'Desbloquea con PRO — 36 días gratis.' },
            { icon: '🔊', title: 'Web Speech API nativa', desc: 'Usa la voz del sistema. Sin servidores.' },
            { icon: '🌐', title: 'DeepL incluido (PRO)', desc: 'Traducción de mayor calidad para textos técnicos.' },
            { icon: '📱', title: 'Funciona en Android', desc: 'Kiwi Browser + Firefox Nightly.' },
            { icon: '🔒', title: 'Sin tracking', desc: 'No almacenamos tu historial de navegación.' },
          ].map(f => (
            <div key={f.title} className="flex gap-3 bg-white/3 border border-white/8 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="font-semibold text-sm">{f.title}</div>
                <div className="text-white/40 text-xs">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Maker */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
          <div className="text-2xl mb-2">👋</div>
          <h3 className="font-black mb-2">Hola, soy el creador de A3B Narrator</h3>
          <p className="text-white/45 text-sm max-w-lg mx-auto mb-4">
            Construí esta herramienta porque siempre quise aprender en Coursera pero el inglés era una barrera. Ahora es completamente gratis para Coursera y cuesta menos de un café al mes para todas las plataformas.
          </p>
          <a href="mailto:hello@a3bhub.cloud"
            className="text-[#6366f1] text-sm hover:underline">
            hello@a3bhub.cloud
          </a>
        </div>
      </div>
    </main>
  )
}
