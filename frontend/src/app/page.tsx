import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A3B Coursera Voice Narrator — Aprende en español',
  description: 'Extensión de navegador que traduce y narra en voz alta los subtítulos de Coursera en español. Gratis. Sin APIs. Sin costo.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">

      {/* ── Nav ────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-md bg-[#0a0a0f]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔊</span>
            <span className="font-bold text-lg tracking-tight">A3B<span className="text-[#6366f1]"> Narrator</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <Link href="/pricing" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
          </div>
          <Link href="/register" className="bg-[#6366f1] hover:bg-[#5558e8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────── */}
      <section className="pt-40 pb-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-radial from-[#6366f1]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/70 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          v2.0.0 — Gratis y Open Source
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
          Coursera en
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">
            tu idioma
          </span>
        </h1>

        <p className="text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
          Extensión de navegador que detecta subtítulos en inglés, 
          los traduce y los narra en voz alta en español. 
          En tiempo real. Sin costo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto bg-[#6366f1] hover:bg-[#5558e8] text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 text-lg">
            Descargar extensión →
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto border border-white/10 hover:border-white/30 text-white/70 hover:text-white font-medium px-8 py-4 rounded-xl transition-all">
            Ver planes PRO
          </Link>
        </div>

        {/* Browser badges */}
        <div className="flex items-center justify-center gap-6 mt-12 text-white/30 text-sm">
          {['Chrome', 'Edge', 'Firefox', 'Kiwi', 'Android'].map(b => (
            <span key={b} className="hover:text-white/60 transition-colors cursor-default">{b}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Instala la extensión', desc: 'En Chrome, Edge, Firefox o Kiwi Browser. Un clic.' },
              { step: '02', title: 'Activa subtítulos en CC', desc: 'Abre cualquier video en Coursera y activa los subtítulos en inglés.' },
              { step: '03', title: 'Escucha en español', desc: 'El narrador traduce y lee cada frase automáticamente.' },
            ].map(item => (
              <div key={item.step} className="bg-white/3 border border-white/8 rounded-2xl p-8 hover:border-[#6366f1]/40 transition-colors">
                <div className="text-[#6366f1] font-mono text-sm font-bold mb-4">{item.step}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ───────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Empieza gratis</h2>
          <p className="text-white/50 mb-16">Actualiza cuando necesites más</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free', price: '$0', period: 'siempre',
                color: 'border-white/10',
                features: ['Google TTS', 'Solo EN→ES', 'Coursera', 'Sin historial'],
              },
              {
                name: 'Pro', price: '$4.99', period: '/mes',
                color: 'border-[#6366f1]', highlight: true,
                features: ['DeepL (calidad superior)', '10 idiomas', 'Coursera + YouTube', 'Historial 30 días', 'Diccionario personal'],
              },
              {
                name: 'Team', price: '$19.99', period: '/mes',
                color: 'border-white/10',
                features: ['Todo PRO', 'Usuarios ilimitados', 'Dashboard admin', 'API access', 'Soporte prioritario'],
              },
            ].map(plan => (
              <div key={plan.name} className={`border ${plan.color} rounded-2xl p-8 ${plan.highlight ? 'bg-[#6366f1]/5' : 'bg-white/2'} relative`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6366f1] text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <div className="font-bold text-lg mb-1">{plan.name}</div>
                <div className="text-3xl font-black mb-1">{plan.price}<span className="text-sm font-normal text-white/40">{plan.period}</span></div>
                <ul className="mt-6 space-y-2 text-sm text-white/60 text-left">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.price === '$0' ? '/register' : '/pricing'} className={`mt-8 block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${plan.highlight ? 'bg-[#6366f1] hover:bg-[#5558e8] text-white' : 'border border-white/10 hover:border-white/30 text-white/70 hover:text-white'}`}>
                  {plan.price === '$0' ? 'Empezar gratis' : 'Elegir plan'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div>© 2025 A3B Cloud — MIT License</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Términos</Link>
            <Link href="/docs" className="hover:text-white/60 transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
