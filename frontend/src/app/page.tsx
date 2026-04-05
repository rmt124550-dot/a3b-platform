import type { Metadata } from 'next'
import Link from 'next/link'
import PlatformLogo   from '@/components/PlatformLogos'
import PricingSection from '@/components/PricingSection'
import MobileNav      from '@/components/MobileNav'

export const metadata: Metadata = {
  title: 'A3B Narrator — Aprende en Español en Coursera, YouTube, Udemy | 36 dias gratis',
  description: 'Extension Chrome que narra subtitulos de Coursera, YouTube, Udemy, edX, LinkedIn, Khan Academy y DataCamp en espanol. 36 dias gratis.',
}

const PLATFORMS = [
  { id:'coursera', name:'Coursera',      badge:'Trial', badgeColor:'emerald', desc:'Todos los cursos CC' },
  { id:'youtube',  name:'YouTube',       badge:'PRO',   badgeColor:'indigo',  desc:'Videos con subtitulos' },
  { id:'udemy',    name:'Udemy',         badge:'PRO',   badgeColor:'indigo',  desc:'Todos los cursos' },
  { id:'edx',      name:'edX',           badge:'PRO',   badgeColor:'indigo',  desc:'Open edX incluido' },
  { id:'linkedin', name:'LinkedIn',      badge:'PRO',   badgeColor:'indigo',  desc:'LinkedIn Learning' },
  { id:'khan',     name:'Khan Academy',  badge:'PRO',   badgeColor:'indigo',  desc:'Matematicas y ciencias' },
  { id:'datacamp', name:'DataCamp',      badge:'PRO',   badgeColor:'indigo',  desc:'Data Science y ML' },
]

const STEPS = [
  { icon:'1', emoji:'👁', title:'Detecta',  desc:'MutationObserver detecta subtítulos CC al instante' },
  { icon:'2', emoji:'🤖', title:'IA Traduce',desc:'Llama 3.1 con contexto del video y glosario técnico (PRO)' },
  { icon:'3', emoji:'🔊', title:'Narra',    desc:'Web Speech API — 10 idiomas con voz natural del sistema' },
  { icon:'4', emoji:'💾', title:'Guarda',   desc:'Historial + diccionario personal (PRO)' },
]

const LANGS = [
  { code:'es', flag:'🇪🇸', name:'Español'   },
  { code:'pt', flag:'🇧🇷', name:'Portugues'  },
  { code:'fr', flag:'🇫🇷', name:'Frances'    },
  { code:'de', flag:'🇩🇪', name:'Aleman'     },
  { code:'it', flag:'🇮🇹', name:'Italiano'   },
  { code:'ja', flag:'🇯🇵', name:'Japones'    },
  { code:'ko', flag:'🇰🇷', name:'Coreano'    },
  { code:'zh', flag:'🇨🇳', name:'Chino'      },
  { code:'ar', flag:'🇸🇦', name:'Arabe'      },
  { code:'ru', flag:'🇷🇺', name:'Ruso'       },
]

const TESTIMONIALS = [
  { text:'Estudio en Udemy y no hablo ingles bien. Con A3B puedo seguir todos los cursos tecnicos sin problema. Increible.', author:'Miguel R.', role:'Desarrollador web', platform:'udemy', flag:'🇨🇴' },
  { text:'Uso DataCamp para aprender Data Science. La extension narra perfectamente los videos y puedo hacer ejercicios al mismo tiempo.', author:'Camila F.', role:'Analista de datos', platform:'datacamp', flag:'🇧🇷' },
  { text:'Llevo 3 meses estudiando Machine Learning en Coursera. Sin A3B hubiera abandonado. Ahora entiendo todo en espanol.', author:'Ahmed K.', role:'Ingeniero de IA', platform:'coursera', flag:'🇲🇦' },
  { text:'El soporte de edX es perfectisimo. Los subtitulos se detectan al instante y la voz en portugues suena muy natural.', author:'Lucas M.', role:'Estudiante universitario', platform:'edx', flag:'🇵🇹' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white overflow-x-hidden" style={{fontFamily:'system-ui,sans-serif'}}>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-[#080810]/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl">🔊</span>
            <span className="font-black text-base sm:text-lg tracking-tight">
              A3B<span className="text-[#6366f1]"> Narrator</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-white/45">
            <a href="#platforms" className="hover:text-white transition-colors">Plataformas</a>
            <a href="#demo"      className="hover:text-white transition-colors">Demo</a>
            <Link href="/pricing"    className="hover:text-white transition-colors">Precios</Link>
            <Link href="/affiliates" className="hover:text-white transition-colors">Afiliados</Link>
            <Link href="/blog"       className="hover:text-white transition-colors">Blog</Link>
            <Link href="/login"      className="hover:text-white transition-colors">Iniciar sesion</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/register"
              className="bg-[#6366f1] hover:bg-[#5558e8] text-white text-xs sm:text-sm font-semibold
                         px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all hover:scale-105">
              Empezar gratis
            </Link>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 sm:pt-36 md:pt-44 pb-14 sm:pb-20 px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2
                          w-[300px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[400px] md:h-[500px]
                          rounded-full opacity-25"
               style={{background:'radial-gradient(ellipse, #6366f130 0%, transparent 70%)'}} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full
                        px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-white/60 mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          v2.5.0 — IA Llama 3.1 · 7 plataformas · 36 días gratis
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-[1.08]">
          Estudia en{' '}
          <span className="text-transparent bg-clip-text"
                style={{backgroundImage:'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)'}}>
            tu idioma
          </span>
          <br className="hidden sm:block" />
          {' '}en cualquier plataforma
        </h1>

        {/* Descripcion */}
        <p className="text-sm sm:text-base md:text-xl text-white/45 max-w-xl md:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Detecta subtitulos en ingles, los traduce y narra en voz alta.{' '}
          <strong className="text-white/70">36 días gratis — sin tarjeta.</strong>
          <span className="hidden sm:inline">
            {' '}Funciona en Coursera, YouTube, Udemy, edX, LinkedIn, Khan Academy y DataCamp.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 px-4 sm:px-0">
          <Link href="/register"
            className="w-full sm:w-auto text-white font-bold px-6 sm:px-9 py-4 rounded-xl
                       transition-all hover:scale-105 text-base sm:text-lg shadow-lg text-center"
            style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 0 40px rgba(99,102,241,0.35)'}}>
            🎁 Empezar 36 dias gratis →
          </Link>
          <a href="#demo"
            className="w-full sm:w-auto border border-white/10 hover:border-white/25
                       text-white/55 hover:text-white font-medium px-6 sm:px-9 py-4
                       rounded-xl transition-all text-sm sm:text-base text-center">
            Ver como funciona ↓
          </a>
        </div>

        {/* Navegadores — wrap en mobile */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[['🟡','Chrome'],['🔵','Edge'],['🦊','Firefox'],['📱','Kiwi Android'],['🌙','Firefox Nightly']].map(([icon,name]) => (
            <span key={name as string}
              className="flex items-center gap-1.5 bg-white/4 border border-white/8
                         rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs text-white/35">
              {icon} {name}
            </span>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-14">
            <div className="inline-block bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full
                            px-3 sm:px-4 py-1 text-xs text-[#a5b4fc] font-bold tracking-widest uppercase mb-3 sm:mb-4">
              Como funciona
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">Ve el narrador en accion</h2>
            <p className="text-white/40 text-sm sm:text-base">Simulacion real de como la extension detecta y narra subtitulos</p>
          </div>

          {/* Demo player */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-6 sm:mb-8"
               style={{background:'#0d0d18'}}>
            {/* Browser bar */}
            <div className="bg-[#1a1a2e] px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b border-white/5">
              <div className="flex gap-1.5 flex-shrink-0">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f57]"/>
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#febc2e]"/>
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#28c840]"/>
              </div>
              <div className="flex-1 bg-white/5 rounded-md px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-white/30 text-center truncate min-w-0">
                coursera.org/learn/machine-learning
              </div>
              <div className="w-6 sm:w-7 h-6 sm:h-7 bg-[#6366f1] rounded-md flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">🔊</div>
            </div>

            {/* Video area */}
            <div className="relative flex items-center justify-center bg-[#050508]"
                 style={{paddingTop:'52%'}}>
              <div className="absolute inset-0">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-5"
                     style={{backgroundImage:'linear-gradient(rgba(99,102,241,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.3) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
                {/* Instructor */}
                <div className="absolute left-[5%] sm:left-[8%] md:left-12 top-1/2 -translate-y-1/2
                                w-[20%] sm:w-[22%] md:w-48
                                aspect-[4/3] rounded-lg sm:rounded-xl
                                border border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d18]
                                flex items-center justify-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl">👨‍🏫</div>
                </div>
                {/* Subtitulo EN original */}
                <div className="absolute bottom-[25%] left-0 right-0 text-center px-2">
                  <div className="inline-block bg-black/70 text-white/50 text-[10px] sm:text-xs md:text-sm
                                  px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-medium max-w-xs sm:max-w-md truncate">
                    "Neural networks learn by adjusting weights..."
                  </div>
                </div>
                {/* Overlay A3B */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-0 sm:right-0 sm:text-center">
                  <div className="inline-flex items-center gap-2 sm:gap-3
                                  bg-black/85 border border-[#6366f1]/40
                                  text-white px-3 sm:px-6 py-2 sm:py-3
                                  rounded-lg sm:rounded-xl backdrop-blur-sm shadow-lg
                                  max-w-full overflow-hidden"
                       style={{boxShadow:'0 0 20px rgba(99,102,241,0.2)'}}>
                    <span className="text-[#6366f1] text-base sm:text-lg animate-pulse flex-shrink-0">🔊</span>
                    <div className="text-left min-w-0">
                      <div className="text-[9px] sm:text-xs text-white/35 mb-0.5">A3B Narrator [coursera]</div>
                      <div className="text-xs sm:text-sm font-semibold truncate">
                        "Las redes neuronales aprenden ajustando pesos..."
                      </div>
                    </div>
                  </div>
                </div>
                {/* Badge plataforma — hidden en muy pequenos */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3
                                bg-[#6366f1]/20 border border-[#6366f1]/30
                                rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5
                                text-[9px] sm:text-xs font-bold text-[#a5b4fc]">
                  Activo — Coursera
                </div>
              </div>
            </div>

            {/* Panel inferior */}
            <div className="bg-[#0f0f1c] border-t border-white/5 px-3 sm:px-6 py-2.5 sm:py-4
                            flex items-center gap-3 sm:gap-6 overflow-x-auto">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-[10px] sm:text-xs text-white/50 whitespace-nowrap">Narrando en tiempo real</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <span className="text-[10px] sm:text-xs text-white/30">Idioma:</span>
                <span className="bg-white/8 rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold">🇪🇸 ES</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] sm:text-xs text-white/30">Motor:</span>
                <span className="bg-emerald-400/10 text-emerald-400 rounded px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold">Google</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs text-white/30">Velocidad:</span>
                <span className="bg-white/8 rounded px-2 py-0.5 text-xs font-semibold">1.0x</span>
              </div>
            </div>
          </div>

          {/* Steps — 2x2 mobile, 4 en desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {STEPS.map(s => (
              <div key={s.icon} className="bg-white/3 border border-white/7 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl mb-2">{s.emoji}</div>
                <div className="text-[#6366f1] text-xs font-mono font-bold mb-1">PASO {s.icon}</div>
                <div className="font-bold text-xs sm:text-sm mb-1">{s.title}</div>
                <div className="text-[10px] sm:text-xs text-white/35 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── AI TRANSLATOR ───────────────────────────────── */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20
                            rounded-full px-3 sm:px-4 py-1 text-xs text-violet-300 font-bold
                            tracking-widest uppercase mb-3 sm:mb-4">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              POTENCIADO POR IA
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">
              Traducción con{' '}
              <span className="text-transparent bg-clip-text"
                    style={{backgroundImage:'linear-gradient(135deg,#8b5cf6,#6366f1)'}}>
                Inteligencia Artificial
              </span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto">
              No es solo traducción. Es comprensión del contexto educativo.
            </p>
          </div>

          {/* Comparativa Trial vs PRO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">

            {/* Trial — Google — borde NEUTRO, no verde (verde = positivo en UX) */}
            <div className="bg-white/2 border border-white/10 rounded-2xl p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-white/6
                                flex items-center justify-center text-lg sm:text-xl">
                  🌐
                </div>
                <div>
                  <div className="font-black text-sm sm:text-base text-white/80">Google Translate</div>
                  <div className="text-white/40 text-xs font-semibold">🆓 Incluido en Trial</div>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-2.5 text-sm mb-5">
                {[
                  { ok:true,  t:'Traducción al instante, sin servidor' },
                  { ok:true,  t:'Español y 9 idiomas más' },
                  { ok:true,  t:'Sin API keys ni configuración' },
                  { ok:false, t:'Sin contexto del video anterior' },
                  { ok:false, t:'Sin glosario técnico del curso' },
                  { ok:false, t:'Puede variar el mismo término' },
                ].map(({ok,t}) => (
                  <li key={t} className="flex gap-2.5 items-start">
                    <span className={`flex-shrink-0 text-sm font-bold mt-0.5 ${ok?'text-emerald-400':'text-white/20'}`}>
                      {ok ? '✓' : '✗'}
                    </span>
                    <span className={ok?'text-white/60':'text-white/30'}>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/4 border border-white/8 rounded-xl p-3 text-xs text-white/30 font-mono leading-relaxed">
                <span className="text-red-400/60">✗</span> "backpropagation" → "retropropagación" (frase 1)<br/>
                <span className="text-red-400/60">✗</span> "backpropagation" → "propagación hacia atrás" (frase 8)
              </div>
            </div>

            {/* PRO — Llama — borde indigo prominente */}
            <div className="bg-[#6366f1]/8 border border-[#6366f1]/50 rounded-2xl p-5 sm:p-7 relative
                            shadow-lg shadow-[#6366f1]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2
                              bg-[#6366f1] text-white text-[10px] font-black
                              px-4 py-1.5 rounded-full whitespace-nowrap">
                ⭐ PRO · Llama 3.1 8B
              </div>
              <div className="flex items-center gap-3 mb-4 sm:mb-5 mt-2">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/30
                                flex items-center justify-center text-lg sm:text-xl">
                  🤖
                </div>
                <div>
                  <div className="font-black text-sm sm:text-base">Llama 3.1 8B via Groq</div>
                  <div className="text-[#a5b4fc] text-xs font-bold">⚡ Latencia ~200ms</div>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-2.5 text-sm mb-5">
                {[
                  'Contexto de las últimas 5 frases del video',
                  'Glosario técnico extraído automáticamente',
                  'Mismo término siempre igual en toda la sesión',
                  'Código Python/JS no se traduce nunca',
                  'Fórmulas matemáticas legibles en voz alta',
                  '10 idiomas con calidad nativa',
                ].map(f => (
                  <li key={f} className="flex gap-2.5 items-start">
                    <span className="text-[#6366f1] flex-shrink-0 font-bold mt-0.5">✓</span>
                    <span className="text-white/75">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-3 text-xs text-[#a5b4fc] font-mono leading-relaxed">
                <span className="text-emerald-400">✓</span> "backpropagation" → "backpropagación"<br/>
                <span className="text-emerald-400">✓</span> "backpropagation" → "backpropagación" (siempre igual)
              </div>
            </div>
          </div>

          {/* Demo traducción en vivo */}
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/6 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs text-white/40 font-medium">Traducción en tiempo real</span>
              </div>
              <span className="text-white/20 text-xs hidden sm:block">·</span>
              <span className="text-xs text-white/30 hidden sm:block">Coursera — Machine Learning (Andrew Ng)</span>
              <span className="ml-auto text-[10px] bg-[#6366f1]/20 text-[#a5b4fc] border border-[#6366f1]/30 px-2 py-0.5 rounded-full font-bold">
                🤖 Llama 3.1
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {[
                {
                  en: 'The gradient descent algorithm minimizes the cost function.',
                  es: 'El algoritmo de descenso de gradiente minimiza la función de costo.',
                  ms: 178, ctx: 0, note: null, noteColor: null,
                },
                {
                  en: 'This process is called backpropagation.',
                  es: 'Este proceso se llama backpropagación.',
                  ms: 165, ctx: 1, note: null, noteColor: null,
                },
                {
                  en: 'In TensorFlow, use model.compile and model.fit.',
                  es: 'En TensorFlow, usa model.compile y model.fit.',
                  ms: 152, ctx: 2,
                  note: '🟢 Código preservado',
                  noteColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
                },
                {
                  en: 'Backpropagation computes partial derivatives efficiently.',
                  es: 'La backpropagación calcula derivadas parciales eficientemente.',
                  ms: 170, ctx: 3,
                  note: '📌 Glosario consistente',
                  noteColor: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
                },
              ].map((row, i) => (
                <div key={i} className={`px-4 sm:px-6 py-3 sm:py-4 ${i < 3 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges EN */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-white/25 text-[10px] font-mono">EN</span>
                        {row.ctx > 0 && (
                          <span className="text-[9px] bg-violet-500/15 text-violet-400
                                           border border-violet-500/25 px-1.5 py-0.5 rounded-full font-semibold">
                            +{row.ctx} contexto
                          </span>
                        )}
                        {row.note && (
                          <span className={`text-[9px] border px-1.5 py-0.5 rounded-full font-semibold ${row.noteColor}`}>
                            {row.note}
                          </span>
                        )}
                      </div>
                      <div className="text-white/45 text-xs sm:text-sm mb-2 leading-relaxed">{row.en}</div>
                      <div className="text-white/25 text-[10px] font-mono mb-1">🤖 ES (Llama 3.1)</div>
                      <div className="text-white/90 text-xs sm:text-sm font-semibold leading-relaxed">{row.es}</div>
                    </div>
                    {/* Latencia */}
                    <div className="flex-shrink-0 text-right ml-3">
                      <div className="text-[#a5b4fc] font-black text-sm">{row.ms}ms</div>
                      <div className="text-white/20 text-[10px]">latencia</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-6 py-3 bg-[#6366f1]/5 border-t border-[#6366f1]/15
                            flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-white/35">
                ⚡ Latencia media: <strong className="text-white/60">166ms</strong>
                &nbsp;·&nbsp; 🪙 Costo de esta sesión: <strong className="text-white/60">$0.0004</strong>
              </div>
              <Link href="/register?plan=pro"
                className="text-xs bg-[#6366f1] text-white font-bold px-4 py-2 rounded-lg
                           hover:bg-[#5558e8] transition-all">
                Probar con IA →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PLATAFORMAS */}
      <section id="platforms" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block bg-emerald-400/10 border border-emerald-400/20 rounded-full
                            px-3 sm:px-4 py-1 text-xs text-emerald-400 font-bold tracking-widest uppercase mb-3 sm:mb-4">
              Compatibilidad
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4">Funciona donde estudias</h2>
            <p className="text-white/40 text-sm sm:text-base sm:text-lg max-w-lg mx-auto">
              Una extension. Sin configuracion extra por plataforma.
            </p>
          </div>

          {/* Grid plataformas — 2 col mobile, 4 col md, 7 col ajustado */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-4">
            {PLATFORMS.map(p => (
              <div key={p.id}
                className="group bg-white/3 border border-white/8 rounded-xl sm:rounded-2xl p-3 sm:p-5
                           hover:border-white/20 hover:-translate-y-0.5 transition-all
                           flex flex-col items-center text-center gap-2 sm:gap-3">
                <PlatformLogo platform={p.id} size={36} />
                <div>
                  <div className="font-bold text-xs sm:text-sm mb-0.5">{p.name}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/30 hidden sm:block">{p.desc}</div>
                </div>
                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${
                  p.badge === 'Trial'
                    ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                    : 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/20'
                }`}>
                  {p.badge === 'Trial' ? '🆓 Trial' : '⭐ PRO'}
                </span>
              </div>
            ))}
          </div>

          {/* Coming soon */}
          <div className="border border-dashed border-white/8 rounded-xl p-3 sm:p-4 text-center">
            <span className="text-white/25 text-xs sm:text-sm">
              🔜 Proximamente: MIT OpenCourseWare · FutureLearn · Skillshare · Pluralsight
            </span>
          </div>
        </div>
      </section>

      {/* IDIOMAS */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8 sm:gap-10 md:gap-14">
          {/* Texto */}
          <div className="w-full md:w-2/5">
            <div className="text-[#6366f1] text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3">10 idiomas</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Escucha en tu idioma nativo</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-4 sm:mb-6">
              Detecta automaticamente el idioma del video y traduce al idioma que elijas.
              La extension selecciona la mejor voz del sistema operativo.
            </p>
            <div className="space-y-1.5 text-sm text-white/40">
              {['Auto-detect del idioma origen','Seleccion automatica de voz','DeepL en planes PRO (mayor calidad)'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-emerald-400 flex-shrink-0">✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          {/* Grid idiomas — 3 col mobile, 5 col md */}
          <div className="w-full md:w-3/5 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
            {LANGS.map(l => (
              <div key={l.code}
                className="bg-white/3 border border-white/7 rounded-xl py-2.5 sm:py-3 px-2
                           text-center hover:border-[#6366f1]/35 hover:bg-[#6366f1]/5 transition-all">
                <div className="text-lg sm:text-xl mb-1">{l.flag}</div>
                <div className="text-[10px] sm:text-[11px] text-white/50 font-medium">{l.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            {[
              { value:'7',   unit:'',  label:'Plataformas', sub:'7 idiomas de inicio' },
              { value:'10',  unit:'',  label:'Idiomas',     sub:'EN→ES·PT·FR·DE·IT...' },
              { value:'0',   unit:'€', label:'Setup',       sub:'Sin API keys' },
              { value:'100', unit:'%', label:'Open Source', sub:'MIT License' },
            ].map(s => (
              <div key={s.label} className="bg-white/2 border border-white/6 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-3xl sm:text-4xl font-black mb-1" style={{color:'#6366f1'}}>
                  {s.value}<span className="text-xl sm:text-2xl">{s.unit}</span>
                </div>
                <div className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{s.label}</div>
                <div className="text-[10px] sm:text-xs text-white/25">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full
                            px-3 sm:px-4 py-1 text-xs text-[#a5b4fc] font-bold tracking-widest uppercase mb-3 sm:mb-4">
              Testimonios
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">Lo que dicen los estudiantes</h2>
            <p className="text-white/40 text-sm sm:text-base">Hispanohablantes que estudian en plataformas en ingles</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-7 hover:border-white/15 transition-colors">
                <div className="text-[#6366f1] text-3xl sm:text-4xl font-black leading-none mb-3 sm:mb-4 opacity-40">"</div>
                <p className="text-white/70 text-sm leading-relaxed mb-5 sm:mb-6">{t.text}</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30
                                    flex items-center justify-center text-sm font-black text-[#6366f1] flex-shrink-0">
                      {t.author[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm truncate">{t.flag} {t.author}</div>
                      <div className="text-[10px] sm:text-xs text-white/35 truncate">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <PlatformLogo platform={t.platform} size={18} />
                    <span className="text-[10px] sm:text-xs text-white/30 capitalize hidden sm:block">{t.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-white/5">
        <PricingSection />
      </section>

      {/* AFILIADOS CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-6 sm:p-8
                          flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="text-4xl flex-shrink-0">💰</div>
            <div className="flex-1 text-center sm:text-left">
              <div className="font-black text-base sm:text-lg mb-1">¿Tienes audiencia educativa?</div>
              <div className="text-white/40 text-sm">Gana el 30% de comision por cada usuario PRO que refieras.</div>
            </div>
            <Link href="/affiliates"
              className="w-full sm:w-auto flex-shrink-0 bg-emerald-500 text-white font-black
                         px-5 sm:px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all text-sm text-center">
              Ver programa →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🔊</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">
            Empieza a estudiar<br />en tu idioma hoy
          </h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 sm:mb-10">
            30 segundos de instalacion. Sin API keys. Sin costo. 36 dias gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link href="/register"
              className="w-full sm:w-auto text-white font-bold px-8 sm:px-10 py-4 rounded-xl
                         text-base sm:text-lg transition-all hover:scale-105 text-center"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 0 40px rgba(99,102,241,0.3)'}}>
              🎁 Empezar 36 dias gratis →
            </Link>
            <Link href="/pricing"
              className="w-full sm:w-auto border border-white/10 hover:border-white/25
                         text-white/55 hover:text-white font-medium px-8 sm:px-10 py-4
                         rounded-xl transition-all text-sm sm:text-base text-center">
              Ver planes PRO
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔊</span>
              <span className="font-black text-sm">A3B Narrator</span>
              <span className="text-white/20 text-xs ml-1">by A3B Cloud</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-8 gap-y-2 text-white/30 text-sm">
              <a href="#platforms"      className="hover:text-white/60 transition-colors">Plataformas</a>
              <Link href="/blog"        className="hover:text-white/60 transition-colors">Blog</Link>
              <Link href="/pricing"     className="hover:text-white/60 transition-colors">Precios</Link>
              <Link href="/affiliates"  className="hover:text-white/60 transition-colors">Afiliados</Link>
              <Link href="/help"        className="hover:text-white/60 transition-colors">Ayuda</Link>
              <a href="mailto:hello@a3bhub.cloud" className="hover:text-white/60 transition-colors">Contacto</a>
            </div>
          </div>
          <div className="border-t border-white/5" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-white/20 text-xs">
            <div>© 2026 A3B Cloud. Todos los derechos reservados.</div>
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-1.5">
              <Link href="/privacy"   className="hover:text-white/50">Privacidad</Link>
              <Link href="/terms"     className="hover:text-white/50">Terminos</Link>
              <Link href="/help"      className="hover:text-white/50">Ayuda</Link>
              <Link href="/affiliates" className="hover:text-white/50">Afiliados</Link>
              <a href="https://github.com/rmt124550-dot/a3b-coursera-voice-narrator" target="_blank" rel="noopener noreferrer" className="hover:text-white/50">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
