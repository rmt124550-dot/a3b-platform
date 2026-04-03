import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A3B Narrator — Aprende en tu idioma en cualquier plataforma',
  description: 'Extensión que traduce y narra en voz alta los subtítulos de Coursera, edX, Udemy, Udacity, DataCamp y más. Gratis.',
}

const PLATFORMS = [
  {
    name: 'Coursera',
    icon: '📚',
    url: 'coursera.org',
    badge: 'Completo',
    color: '#0056d2',
    desc: 'Todos los cursos con CC',
  },
  {
    name: 'edX',
    icon: '🎓',
    url: 'edx.org',
    badge: 'Completo',
    color: '#02262b',
    desc: 'Open edX incluido',
  },
  {
    name: 'Udemy',
    icon: '🔥',
    url: 'udemy.com',
    badge: 'Completo',
    color: '#a435f0',
    desc: 'Todos los cursos',
  },
  {
    name: 'Udacity',
    icon: '🚀',
    url: 'udacity.com',
    badge: 'Completo',
    color: '#01b3e3',
    desc: 'Nano-degrees y cursos',
  },
  {
    name: 'DataCamp',
    icon: '📊',
    url: 'datacamp.com',
    badge: 'Completo',
    color: '#03ef62',
    desc: 'Campus incluido',
  },
  {
    name: 'Codecademy',
    icon: '💻',
    url: 'codecademy.com',
    badge: 'Parcial',
    color: '#1f4056',
    desc: 'Solo lecciones con video',
  },
  {
    name: 'YouTube',
    icon: '▶️',
    url: 'youtube.com',
    badge: 'Beta',
    color: '#ff0000',
    desc: 'Videos con subtítulos CC',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    url: 'linkedin.com/learning',
    badge: 'Beta',
    color: '#0a66c2',
    desc: 'LinkedIn Learning',
  },
]

const LANGS = ['Español','Portugués','Francés','Alemán','Italiano','Japonés','Coreano','Chino','Árabe','Ruso']

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-x-hidden"
          style={{ fontFamily: "'system-ui', sans-serif" }}>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-[#080810]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔊</span>
            <span className="font-black text-lg tracking-tight">
              A3B<span className="text-[#6366f1]"> Narrator</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#platforms" className="hover:text-white transition-colors">Plataformas</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
          </div>
          <Link href="/register"
            className="bg-[#6366f1] hover:bg-[#5558e8] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:scale-105">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pt-44 pb-28 px-6 text-center relative">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
               style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        </div>

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          v3.2 — 5 plataformas con soporte completo
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
          Aprende en{' '}
          <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' }}>
            tu idioma
          </span>
          <br />
          en cualquier plataforma
        </h1>

        <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
          Una extensión que detecta subtítulos en inglés, los traduce y los narra en voz alta.
          Funciona en <strong className="text-white/70">Coursera, edX, Udemy, Udacity, DataCamp</strong> y más.
          En tiempo real. Sin costo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link href="/register"
            className="w-full sm:w-auto text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 text-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Descargar extensión →
          </Link>
          <a href="#platforms"
            className="w-full sm:w-auto border border-white/10 hover:border-white/25 text-white/60 hover:text-white font-medium px-8 py-4 rounded-xl transition-all">
            Ver plataformas ↓
          </a>
        </div>

        {/* Browser compatibility pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/30">
          {[
            { name: 'Chrome', icon: '🟡' },
            { name: 'Edge', icon: '🔵' },
            { name: 'Firefox', icon: '🦊' },
            { name: 'Kiwi (Android)', icon: '📱' },
            { name: 'Firefox Nightly', icon: '🌙' },
          ].map(b => (
            <span key={b.name}
              className="flex items-center gap-1.5 bg-white/4 border border-white/8 rounded-full px-3 py-1">
              <span>{b.icon}</span> {b.name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Plataformas ─────────────────────────────────────────── */}
      <section id="platforms" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-block bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full px-4 py-1 text-xs text-[#a5b4fc] font-semibold tracking-wider uppercase mb-4">
              Compatibilidad
            </div>
            <h2 className="text-4xl font-black mb-4">
              Funciona donde estudias
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Una extensión. Todas las plataformas. Sin configuración extra.
            </p>
          </div>

          {/* Platform grid principal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {PLATFORMS.filter(p => p.badge === 'Completo').map(p => (
              <div key={p.name}
                className="group relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/20 transition-all hover:-translate-y-1 cursor-default"
                style={{ '--glow': p.color } as React.CSSProperties}>
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                     style={{ boxShadow: `inset 0 0 30px ${p.color}15` }} />

                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                    ✓ Completo
                  </span>
                </div>
                <div className="font-bold text-base mb-1">{p.name}</div>
                <div className="text-xs text-white/35">{p.url}</div>
                <div className="text-xs text-white/40 mt-2">{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Beta / Parcial row */}
          <div className="grid grid-cols-3 gap-4">
            {PLATFORMS.filter(p => p.badge !== 'Completo').map(p => (
              <div key={p.name}
                className="bg-white/2 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      p.badge === 'Beta'
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        : 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                    }`}>
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/30 truncate">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon teaser */}
          <div className="mt-4 border border-dashed border-white/8 rounded-xl p-4 text-center">
            <span className="text-white/30 text-sm">
              🔜 Próximamente: Khan Academy · MIT OpenCourseWare · FutureLearn · Skillshare
            </span>
          </div>
        </div>
      </section>

      {/* ── Idiomas ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3">
              <div className="text-[#6366f1] text-sm font-semibold mb-2 uppercase tracking-wider">10 idiomas</div>
              <h2 className="text-3xl font-black mb-4">Escucha en tu idioma nativo</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Traduce desde inglés (o cualquier idioma) a tu idioma preferido.
                La selección automática de voz elige la mejor voz del sistema.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-5 gap-3">
              {LANGS.map((lang, i) => (
                <div key={lang}
                  className="bg-white/3 border border-white/8 rounded-xl py-3 px-2 text-center hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5 transition-all cursor-default">
                  <div className="text-[11px] text-white/50 font-medium">{lang}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ───────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📥', title: 'Instala', desc: 'En Chrome, Edge, Firefox o Kiwi. Un clic.' },
              { step: '02', icon: '🎬', title: 'Abre un video', desc: 'En cualquier plataforma soportada con subtítulos CC.' },
              { step: '03', icon: '🌐', title: 'Selecciona idioma', desc: 'Elige entre 10 idiomas de destino en el popup.' },
              { step: '04', icon: '🔊', title: 'Escucha', desc: 'Traducción y narración automática en tiempo real.' },
            ].map(item => (
              <div key={item.step}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#6366f1]/30 transition-colors text-center">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-[#6366f1] font-mono text-xs font-bold mb-2">{item.step}</div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '8',    label: 'Plataformas', sub: '5 con soporte completo' },
              { value: '10',   label: 'Idiomas',      sub: 'de destino disponibles' },
              { value: '0ms',  label: 'Setup',         sub: 'Sin API keys necesarias' },
              { value: '100%', label: 'Gratis',        sub: 'Plan Free sin límites básicos' },
            ].map(s => (
              <div key={s.label} className="bg-white/2 border border-white/6 rounded-2xl p-6">
                <div className="text-4xl font-black text-[#6366f1] mb-1">{s.value}</div>
                <div className="font-semibold text-sm mb-1">{s.label}</div>
                <div className="text-xs text-white/30">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ─────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Empieza gratis</h2>
          <p className="text-white/40 mb-16">Actualiza cuando necesites más potencia</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free', price: '$0', period: 'siempre',
                border: 'border-white/10', bg: 'bg-white/2',
                features: [
                  '✓ Google Translate',
                  '✓ Solo EN→ES',
                  '✓ Todas las plataformas',
                  '✓ Sin historial',
                ],
                cta: 'Empezar gratis', ctaStyle: 'border border-white/10 text-white/60',
              },
              {
                name: 'Pro', price: '$4.99', period: '/mes',
                border: 'border-[#6366f1]/60', bg: 'bg-[#6366f1]/5',
                highlight: true,
                features: [
                  '✓ DeepL (calidad superior)',
                  '✓ 10 idiomas de destino',
                  '✓ Historial 30 días',
                  '✓ Diccionario personal',
                  '✓ Sin límites',
                ],
                cta: 'Elegir Pro', ctaStyle: 'bg-[#6366f1] text-white',
              },
              {
                name: 'Team', price: '$19.99', period: '/mes',
                border: 'border-white/10', bg: 'bg-white/2',
                features: [
                  '✓ Todo lo de Pro',
                  '✓ Usuarios ilimitados',
                  '✓ Dashboard admin',
                  '✓ API access',
                  '✓ Soporte prioritario',
                ],
                cta: 'Elegir Team', ctaStyle: 'border border-white/10 text-white/60',
              },
            ].map(plan => (
              <div key={plan.name}
                className={`${plan.bg} border ${plan.border} rounded-2xl p-8 relative`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6366f1] text-[10px] font-black px-3 py-1 rounded-full tracking-wider">
                    MÁS POPULAR
                  </div>
                )}
                <div className="font-black text-xl mb-1">{plan.name}</div>
                <div className="text-4xl font-black mb-1">
                  {plan.price}
                  <span className="text-sm font-normal text-white/35">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm text-white/55 text-left mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-400 flex-shrink-0">✓</span>
                      <span>{f.replace('✓ ','')}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.price === '$0' ? '/register' : '/pricing'}
                  className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all hover:scale-105 ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">🔊</div>
          <h2 className="text-4xl font-black mb-4">
            Empieza a aprender<br />en tu idioma hoy
          </h2>
          <p className="text-white/40 mb-10">
            Instala en 30 segundos. Sin cuenta, sin API key, sin costo.
          </p>
          <Link href="/register"
            className="inline-block text-white font-bold px-10 py-5 rounded-xl text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Descargar extensión gratis →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔊</span>
              <span className="font-black text-sm">A3B Narrator</span>
              <span className="text-white/20 text-xs ml-2">v3.2</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/30 text-sm">
              <a href="#platforms" className="hover:text-white/60 transition-colors">Plataformas</a>
              <Link href="/pricing" className="hover:text-white/60 transition-colors">Precios</Link>
              <Link href="/login" className="hover:text-white/60 transition-colors">Login</Link>
              <Link href="/register" className="hover:text-white/60 transition-colors">Registro</Link>
            </div>
            <div className="text-white/20 text-xs">© 2026 A3B Cloud — MIT License</div>
          </div>
        </div>
      </footer>

    </main>
  )
}
