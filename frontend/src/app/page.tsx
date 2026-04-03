import type { Metadata } from 'next'
import Link from 'next/link'
import PlatformLogo from '@/components/PlatformLogos'

export const metadata: Metadata = {
  title: 'A3B Narrator — Aprende en tu idioma en cualquier plataforma',
  description: 'Extensión que traduce y narra subtítulos de Coursera, edX, Udemy, Udacity, DataCamp y más. Gratis. Sin APIs.',
}

const PLATFORMS = [
  { id: 'coursera',  name: 'Coursera',   url: 'coursera.org',           badge: 'Completo', desc: 'Todos los cursos con CC' },
  { id: 'edx',       name: 'edX',        url: 'edx.org',                badge: 'Completo', desc: 'Open edX incluido' },
  { id: 'udemy',     name: 'Udemy',      url: 'udemy.com',              badge: 'Completo', desc: 'Todos los cursos' },
  { id: 'udacity',   name: 'Udacity',    url: 'udacity.com',            badge: 'Completo', desc: 'Nano-degrees y cursos' },
  { id: 'datacamp',  name: 'DataCamp',   url: 'datacamp.com',           badge: 'Completo', desc: 'Campus incluido' },
  { id: 'codecademy',name: 'Codecademy', url: 'codecademy.com',         badge: 'Parcial',  desc: 'Solo lecciones con video' },
  { id: 'youtube',   name: 'YouTube',    url: 'youtube.com',            badge: 'Beta',     desc: 'Videos con subtítulos CC' },
  { id: 'linkedin',  name: 'LinkedIn',   url: 'linkedin.com/learning',  badge: 'Beta',     desc: 'LinkedIn Learning' },
]

const LANGS = [
  { code:'es', name:'Español',   flag:'🇪🇸' },
  { code:'pt', name:'Portugués', flag:'🇧🇷' },
  { code:'fr', name:'Francés',   flag:'🇫🇷' },
  { code:'de', name:'Alemán',    flag:'🇩🇪' },
  { code:'it', name:'Italiano',  flag:'🇮🇹' },
  { code:'ja', name:'Japonés',   flag:'🇯🇵' },
  { code:'ko', name:'Coreano',   flag:'🇰🇷' },
  { code:'zh', name:'Chino',     flag:'🇨🇳' },
  { code:'ar', name:'Árabe',     flag:'🇸🇦' },
  { code:'ru', name:'Ruso',      flag:'🇷🇺' },
]

const TESTIMONIALS = [
  {
    text: 'Estudio en Udemy y no hablo inglés bien. Con A3B puedo seguir todos los cursos técnicos sin problema. Increíble.',
    author: 'Miguel R.',
    role: 'Desarrollador web',
    platform: 'udemy',
    lang: '🇨🇴',
  },
  {
    text: 'Uso DataCamp para aprender Data Science. La extensión narra perfectamente los videos y puedo hacer los ejercicios al mismo tiempo.',
    author: 'Camila F.',
    role: 'Analista de datos',
    platform: 'datacamp',
    lang: '🇧🇷',
  },
  {
    text: 'Llevo 3 meses estudiando Machine Learning en Coursera. Sin A3B hubiera abandonado. Ahora entiendo todo en español.',
    author: 'Ahmed K.',
    role: 'Ingeniero de IA',
    platform: 'coursera',
    lang: '🇲🇦',
  },
  {
    text: 'El soporte de edX es perfectísimo. Los subtítulos se detectan al instante y la voz en portugués suena muy natural.',
    author: 'Lucas M.',
    role: 'Estudiante universitario',
    platform: 'edx',
    lang: '🇵🇹',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-x-hidden" style={{ fontFamily: 'system-ui,sans-serif' }}>

      {/* ── Nav ───────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-[#080810]/85">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔊</span>
            <span className="font-black text-lg tracking-tight">
              A3B<span className="text-[#6366f1]"> Narrator</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/45">
            <a href="#platforms" className="hover:text-white transition-colors">Plataformas</a>
            <a href="#demo"      className="hover:text-white transition-colors">Demo</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Precios</Link>
            <Link href="/login"   className="hover:text-white transition-colors">Iniciar sesión</Link>
          </div>
          <Link href="/register" className="bg-[#6366f1] hover:bg-[#5558e8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:scale-105">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="pt-44 pb-24 px-6 text-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-30"
               style={{ background: 'radial-gradient(ellipse, #6366f120 0%, transparent 70%)' }} />
        </div>

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          v3.2 — 5 plataformas con soporte completo · Gratis
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
          Estudia en{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)' }}>
            tu idioma
          </span>
          <br />en cualquier plataforma
        </h1>

        <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
          Detecta subtítulos en inglés, los traduce y los narra en voz alta.
          Funciona en <strong className="text-white/75">Coursera, edX, Udemy, Udacity, DataCamp</strong> y más.
          En tiempo real. Sin API keys.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register"
            className="w-full sm:w-auto text-white font-bold px-9 py-4 rounded-xl transition-all hover:scale-105 text-lg shadow-lg"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.35)' }}>
            Descargar extensión →
          </Link>
          <a href="#demo"
            className="w-full sm:w-auto border border-white/10 hover:border-white/25 text-white/55 hover:text-white font-medium px-9 py-4 rounded-xl transition-all">
            Ver demo ↓
          </a>
        </div>

        {/* Browser pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[['🟡','Chrome'],['🔵','Edge'],['🦊','Firefox'],['📱','Kiwi Android'],['🌙','Firefox Nightly']].map(([icon,name]) => (
            <span key={name} className="flex items-center gap-1.5 bg-white/4 border border-white/8 rounded-full px-3 py-1 text-xs text-white/35">
              {icon} {name}
            </span>
          ))}
        </div>
      </section>

      {/* ── DEMO interactivo ──────────────────────── */}
      <section id="demo" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full px-4 py-1 text-xs text-[#a5b4fc] font-bold tracking-widest uppercase mb-4">
              Así funciona
            </div>
            <h2 className="text-4xl font-black mb-3">Ve el narrador en acción</h2>
            <p className="text-white/40">Simulación real de cómo la extensión detecta y narra subtítulos</p>
          </div>

          {/* Demo player mockup */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: '#0d0d18' }}>
            {/* Barra del browser */}
            <div className="bg-[#1a1a2e] px-4 py-3 flex items-center gap-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"/>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"/>
              </div>
              <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 text-center">
                coursera.org/learn/machine-learning
              </div>
              <div className="w-7 h-7 bg-[#6366f1] rounded-md flex items-center justify-center text-sm font-bold">🔊</div>
            </div>

            {/* Video area */}
            <div className="aspect-video relative flex items-center justify-center" style={{ background: '#050508' }}>
              {/* Fake video frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl opacity-10">🎬</div>
              </div>

              {/* Grid de píxeles simulando video */}
              <div className="absolute inset-0 opacity-5"
                   style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

              {/* Instructor simulado */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 w-48 h-36 rounded-xl border border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d18] flex items-center justify-center">
                <div className="text-5xl">👨‍🏫</div>
              </div>

              {/* Subtítulo EN original (arriba) */}
              <div className="absolute bottom-20 left-0 right-0 text-center">
                <div className="inline-block bg-black/70 text-white/50 text-sm px-5 py-2 rounded-lg font-medium">
                  "Neural networks learn by adjusting weights through backpropagation..."
                </div>
              </div>

              {/* Overlay A3B (abajo) — el punto clave */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-3 bg-black/85 border border-[#6366f1]/40 text-white px-6 py-3 rounded-xl backdrop-blur-sm shadow-lg"
                     style={{ boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
                  <span className="text-[#6366f1] text-lg animate-pulse">🔊</span>
                  <div className="text-left">
                    <div className="text-xs text-white/35 mb-0.5">A3B Narrator [coursera]</div>
                    <div className="text-sm font-semibold">"Las redes neuronales aprenden ajustando pesos mediante retropropagación..."</div>
                  </div>
                </div>
              </div>

              {/* Badge plataforma */}
              <div className="absolute top-3 right-3 bg-[#6366f1]/20 border border-[#6366f1]/30 rounded-lg px-3 py-1.5 text-xs font-bold text-[#a5b4fc]">
                ✓ Activo — Coursera
              </div>
            </div>

            {/* Panel inferior del popup */}
            <div className="bg-[#0f0f1c] border-t border-white/5 px-6 py-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-xs text-white/50">Narrando en tiempo real</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-white/30">Idioma:</span>
                <span className="bg-white/8 rounded px-2 py-0.5 text-xs font-semibold">🇪🇸 Español</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">Motor:</span>
                <span className="bg-emerald-400/10 text-emerald-400 rounded px-2 py-0.5 text-xs font-semibold">Google</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">Velocidad:</span>
                <span className="bg-white/8 rounded px-2 py-0.5 text-xs font-semibold">1.0×</span>
              </div>
            </div>
          </div>

          {/* Steps debajo del demo */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[
              { icon:'👁','step':'1','title':'Detecta','desc':'MutationObserver detecta cambios en los subtítulos CC' },
              { icon:'🌐','step':'2','title':'Traduce','desc':'Google Translate o DeepL según tu plan' },
              { icon:'🔊','step':'3','title':'Narra','desc':'Web Speech API con voz del sistema operativo' },
              { icon:'💾','step':'4','title':'Guarda','desc':'Historial y diccionario personal (PRO/Team)' },
            ].map(s => (
              <div key={s.step} className="bg-white/3 border border-white/7 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-[#6366f1] text-xs font-mono font-bold mb-1">{s.step}</div>
                <div className="font-bold text-sm mb-1">{s.title}</div>
                <div className="text-xs text-white/35 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATAFORMAS ───────────────────────────── */}
      <section id="platforms" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-1 text-xs text-emerald-400 font-bold tracking-widest uppercase mb-4">
              Compatibilidad
            </div>
            <h2 className="text-4xl font-black mb-4">Funciona donde estudias</h2>
            <p className="text-white/40 text-lg max-w-lg mx-auto">
              Una extensión. Sin configuración extra por plataforma.
            </p>
          </div>

          {/* Grid principal — Completo */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {PLATFORMS.filter(p => p.badge === 'Completo').map(p => (
              <div key={p.id}
                className="group bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-1 transition-all cursor-default flex flex-col items-center text-center gap-3">
                <PlatformLogo platform={p.id} size={48} />
                <div>
                  <div className="font-bold text-sm mb-0.5">{p.name}</div>
                  <div className="text-[10px] text-white/30">{p.url}</div>
                </div>
                <span className="mt-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  ✓ Soporte completo
                </span>
              </div>
            ))}
          </div>

          {/* Row inferior — Beta/Parcial */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {PLATFORMS.filter(p => p.badge !== 'Completo').map(p => (
              <div key={p.id} className="bg-white/2 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <PlatformLogo platform={p.id} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      p.badge === 'Beta'
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                        : 'bg-blue-400/10 text-blue-400 border-blue-400/20'
                    }`}>{p.badge}</span>
                  </div>
                  <div className="text-[11px] text-white/30 truncate">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon */}
          <div className="border border-dashed border-white/8 rounded-xl p-4 text-center">
            <span className="text-white/25 text-sm">
              🔜 Próximamente: Khan Academy · MIT OpenCourseWare · FutureLearn · Skillshare · Pluralsight
            </span>
          </div>
        </div>
      </section>

      {/* ── IDIOMAS ───────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14">
          <div className="md:w-2/5">
            <div className="text-[#6366f1] text-xs font-bold uppercase tracking-widest mb-3">10 idiomas</div>
            <h2 className="text-3xl font-black mb-4">Escucha en tu idioma nativo</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Detecta automáticamente el idioma del video y traduce al idioma que elijas.
              La extensión selecciona la mejor voz del sistema operativo.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span className="text-emerald-400">✓</span> Auto-detect del idioma origen
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
              <span className="text-emerald-400">✓</span> Selección automática de voz
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
              <span className="text-emerald-400">✓</span> DeepL en planes PRO (mayor calidad)
            </div>
          </div>
          <div className="md:w-3/5 grid grid-cols-5 gap-2.5">
            {LANGS.map(l => (
              <div key={l.code}
                className="bg-white/3 border border-white/7 rounded-xl py-3 px-2 text-center hover:border-[#6366f1]/35 hover:bg-[#6366f1]/5 transition-all cursor-default">
                <div className="text-xl mb-1">{l.flag}</div>
                <div className="text-[11px] text-white/50 font-medium">{l.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS en tiempo real ──────────────────── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: '5',    unit: '',   label: 'Plataformas completas', sub: '+3 en beta' },
              { value: '10',   unit: '',   label: 'Idiomas disponibles',   sub: 'EN→ES·PT·FR·DE·IT·JA...' },
              { value: '0',    unit: '€',  label: 'Setup requerido',       sub: 'Sin API keys, sin config' },
              { value: '100',  unit: '%',  label: 'Open Source',           sub: 'MIT License en GitHub' },
            ].map(s => (
              <div key={s.label} className="bg-white/2 border border-white/6 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black mb-1" style={{ color: '#6366f1' }}>
                  {s.value}<span className="text-2xl">{s.unit}</span>
                </div>
                <div className="font-semibold text-sm mb-1">{s.label}</div>
                <div className="text-xs text-white/25">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full px-4 py-1 text-xs text-[#a5b4fc] font-bold tracking-widest uppercase mb-4">
              Testimonios
            </div>
            <h2 className="text-4xl font-black mb-3">Lo que dicen los estudiantes</h2>
            <p className="text-white/40">Hispanohablantes que estudian en plataformas en inglés</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i}
                className="bg-white/3 border border-white/8 rounded-2xl p-7 hover:border-white/15 transition-colors">
                {/* Quote */}
                <div className="text-[#6366f1] text-4xl font-black leading-none mb-4 opacity-40">"</div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {t.text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center text-sm font-black text-[#6366f1]">
                      {t.author[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.lang} {t.author}</div>
                      <div className="text-xs text-white/35">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlatformLogo platform={t.platform} size={22} />
                    <span className="text-xs text-white/30 capitalize">{t.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Empieza gratis</h2>
          <p className="text-white/40 mb-16">Todas las plataformas disponibles en todos los planes</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name:'Free', price:'$0', period:'siempre',
                border:'border-white/10', bg:'bg-white/2',
                features:['Google Translate','Solo EN→ES','Todas las plataformas','Sin historial'],
                cta:'Empezar gratis', href:'/register',
                ctaStyle:'border border-white/12 text-white/60 hover:border-white/25',
              },
              {
                name:'Pro', price:'$4.99', period:'/mes',
                border:'border-[#6366f1]/60', bg:'bg-[#6366f1]/5',
                highlight:true,
                features:['DeepL — mayor calidad','10 idiomas destino','Historial 30 días','Diccionario personal','Sin límites'],
                cta:'Elegir Pro', href:'/pricing',
                ctaStyle:'bg-[#6366f1] text-white hover:bg-[#5558e8]',
              },
              {
                name:'Team', price:'$19.99', period:'/mes',
                border:'border-white/10', bg:'bg-white/2',
                features:['Todo lo de Pro','Usuarios ilimitados','Dashboard admin','API access','Soporte prioritario'],
                cta:'Elegir Team', href:'/pricing',
                ctaStyle:'border border-white/12 text-white/60 hover:border-white/25',
              },
            ].map(plan => (
              <div key={plan.name} className={`${plan.bg} border ${plan.border} rounded-2xl p-8 relative`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6366f1] text-[10px] font-black px-3 py-1 rounded-full tracking-wider">
                    MÁS POPULAR
                  </div>
                )}
                <div className="font-black text-xl mb-1">{plan.name}</div>
                <div className="text-4xl font-black mb-6">
                  {plan.price}<span className="text-sm font-normal text-white/35">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 text-sm text-white/55 text-left mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-400 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all hover:scale-105 ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">🔊</div>
          <h2 className="text-4xl font-black mb-4">
            Empieza a estudiar<br />en tu idioma hoy
          </h2>
          <p className="text-white/40 mb-10">
            30 segundos de instalación. Sin cuenta obligatoria. Sin API keys. Sin costo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-block text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 0 40px rgba(99,102,241,0.3)' }}>
              Descargar extensión gratis →
            </Link>
            <Link href="/pricing"
              className="inline-block border border-white/10 hover:border-white/25 text-white/55 hover:text-white font-medium px-10 py-4 rounded-xl transition-all">
              Ver planes PRO
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔊</span>
            <span className="font-black text-sm">A3B Narrator</span>
            <span className="text-white/20 text-xs">v3.2</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/30 text-sm">
            <a href="#platforms" className="hover:text-white/60 transition-colors">Plataformas</a>
            <a href="#demo" className="hover:text-white/60 transition-colors">Demo</a>
            <Link href="/pricing" className="hover:text-white/60 transition-colors">Precios</Link>
            <Link href="/login" className="hover:text-white/60 transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white/60 transition-colors">Registro</Link>
          </div>
          <div className="text-white/20 text-xs">© 2026 A3B Cloud — MIT License</div>
        </div>
      </footer>

    </main>
  )
}
