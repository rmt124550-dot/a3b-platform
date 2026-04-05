import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Programa de Afiliados — A3B Narrator',
  description: 'Gana el 30% de comisión por cada usuario PRO que refieras. Sin límite de ganancias.',
}

const STEPS = [
  { n:'01', icon:'📝', title:'Regístrate gratis', desc:'Crea tu cuenta y únete al programa desde tu dashboard. Sin costos.' },
  { n:'02', icon:'🔗', title:'Comparte tu enlace', desc:'Obtén tu link único. Compártelo en YouTube, blog, redes sociales o email.' },
  { n:'03', icon:'💸', title:'Gana el 30%', desc:'Recibes el 30% de cada pago durante los primeros 12 meses del referido.' },
]

const EXAMPLES = [
  { followers:'1,000',  conversion:'2%', referrals:20,   monthly:'$30',    annual:'$360' },
  { followers:'10,000', conversion:'2%', referrals:200,  monthly:'$300',   annual:'$3,600' },
  { followers:'50,000', conversion:'2%', referrals:1000, monthly:'$1,500', annual:'$18,000' },
]

export default function AffiliatesPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white">

      {/* ── Hero ─────────────────────────────── */}
      <div className="px-4 sm:px-6 py-14 sm:py-20 text-center border-b border-white/5">
        <Link href="/" className="text-white/30 hover:text-white/60 text-sm mb-5 sm:mb-6 block">
          ← Volver al inicio
        </Link>
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          💰 PROGRAMA DE AFILIADOS
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
          Gana el <span className="text-emerald-400">30%</span><br className="sm:hidden" /> de comisión
        </h1>
        <p className="text-white/40 text-sm sm:text-base mb-8 max-w-lg mx-auto px-2">
          Comparte A3B Narrator con tu audiencia y recibe el 30% de cada suscripción PRO durante los primeros 12 meses.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0 mb-10 sm:mb-12">
          <Link href="/register?affiliate=1"
            className="bg-emerald-500 text-white font-black px-6 sm:px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all text-sm">
            🚀 Unirme al programa gratis
          </Link>
          <a href="#calculator"
            className="border border-white/12 text-white/60 font-bold px-6 sm:px-8 py-4 rounded-xl hover:border-white/25 hover:text-white transition-all text-sm">
            Calcular mis ganancias →
          </a>
        </div>

        {/* Stats — 2 columnas en mobile, 4 en desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-xl sm:max-w-2xl mx-auto px-4">
          {[
            { n:'30%',      label:'Comisión' },
            { n:'12 meses', label:'Duración' },
            { n:'$0',       label:'Costo de entrada' },
            { n:'Mensual',  label:'Ciclo de pago' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{s.n}</div>
              <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* ── Cómo funciona ─────────────────── */}
        <h2 className="text-xl sm:text-2xl font-black text-center mb-8 sm:mb-10">Cómo funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {STEPS.map(step => (
            <div key={step.n} className="bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-white/20 font-mono text-xs">{step.n}</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base mb-2">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Calculadora ───────────────────── */}
        <div id="calculator" className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-2 sm:mb-3">Calcula tus ganancias</h2>
          <p className="text-white/40 text-sm text-center mb-6 sm:mb-8">Tasa de conversión conservadora del 2%</p>

          {/* Tabla responsive — scroll en mobile */}
          <div className="overflow-x-auto rounded-2xl border border-white/8 -mx-1">
            <table className="w-full text-sm min-w-[380px]">
              <thead>
                <tr className="border-b border-white/8 bg-white/2">
                  <th className="text-left py-3 px-4 text-white/40 font-normal text-xs sm:text-sm">Audiencia</th>
                  <th className="text-left py-3 px-4 text-white/40 font-normal text-xs sm:text-sm hidden sm:table-cell">Conv.</th>
                  <th className="text-left py-3 px-4 text-white/40 font-normal text-xs sm:text-sm">Referidos</th>
                  <th className="text-left py-3 px-4 text-white/40 font-normal text-xs sm:text-sm">Mes</th>
                  <th className="text-left py-3 px-4 text-emerald-400 font-bold text-xs sm:text-sm">Año</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((ex, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i===1 ? 'bg-emerald-500/5' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-xs sm:text-sm">{ex.followers}</td>
                    <td className="py-3 px-4 text-white/50 text-xs sm:text-sm hidden sm:table-cell">{ex.conversion}</td>
                    <td className="py-3 px-4 text-white/70 text-xs sm:text-sm">{ex.referrals}</td>
                    <td className="py-3 px-4 text-white/70 text-xs sm:text-sm">{ex.monthly}</td>
                    <td className={`py-3 px-4 font-black text-sm sm:text-base ${i===1 ? 'text-emerald-400' : 'text-white'}`}>{ex.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/20 text-xs text-center mt-3">* Plan PRO mensual $4.99. Con planes anuales y Team, las comisiones son mayores.</p>
        </div>

        {/* ── Ideal para ────────────────────── */}
        <h2 className="text-xl sm:text-2xl font-black text-center mb-6 sm:mb-8">Ideal para</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-16 sm:mb-20">
          {[
            { icon:'📺', title:'YouTubers de educación', desc:'Canales sobre programación, data science, idiomas, MBA.' },
            { icon:'✍️', title:'Bloggers y creadores',   desc:'Blogs sobre productividad, tecnología, aprendizaje online.' },
            { icon:'📱', title:'Influencers en LinkedIn', desc:'Profesionales que comparten recursos de capacitación.' },
            { icon:'🎓', title:'Docentes y tutores',     desc:'Profesores que recomiendan herramientas a sus estudiantes.' },
            { icon:'💬', title:'Comunidades y Discord',  desc:'Admins de grupos de estudio y bootcamps.' },
            { icon:'📧', title:'Newsletters',            desc:'Curators de contenido educativo hispanohablante.' },
          ].map(item => (
            <div key={item.title} className="flex gap-3 sm:gap-4 bg-white/3 border border-white/8 rounded-xl p-4">
              <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-white/40 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Comisiones ────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-8 mb-12 sm:mb-16">
          <h2 className="font-black text-base sm:text-lg mb-5 sm:mb-6">Estructura de comisiones</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              { plan:'PRO Mensual',   price:'$4.99/mes',   commission:'$1.50/mes',        period:'12 meses' },
              { plan:'PRO Anual',     price:'$39.99/año',  commission:'$12.00/referido',  period:'Pago único' },
              { plan:'Team Mensual',  price:'$19.99/mes',  commission:'$6.00/mes',        period:'12 meses' },
              { plan:'Team Anual',    price:'$199.99/año', commission:'$60.00/referido',  period:'Pago único' },
            ].map(row => (
              <div key={row.plan} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-semibold text-sm">{row.plan}</div>
                  <div className="text-white/35 text-xs">{row.price} · {row.period}</div>
                </div>
                <div className="text-emerald-400 font-black text-sm sm:text-base">{row.commission}</div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-4">Pagos mensuales vía PayPal o transferencia (mínimo $50 acumulado).</p>
        </div>

        {/* ── CTA Final ─────────────────────── */}
        <div className="text-center bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-8 sm:p-10">
          <div className="text-4xl mb-4">💰</div>
          <h2 className="text-xl sm:text-2xl font-black mb-3">¿Listo para empezar?</h2>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">Únete gratis. Tu primer referido puede generar comisiones esta misma semana.</p>
          <Link href="/register?affiliate=1"
            className="inline-block bg-emerald-500 text-white font-black px-6 sm:px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all text-sm mb-4">
            🚀 Crear mi cuenta de afiliado
          </Link>
          <p className="text-white/25 text-xs">
            ¿Preguntas? <a href="mailto:hello@a3bhub.cloud" className="underline hover:text-white/50">hello@a3bhub.cloud</a>
          </p>
        </div>

        <div className="text-center mt-8 sm:mt-10 text-white/20 text-xs flex justify-center gap-4 flex-wrap">
          <Link href="/privacy" className="hover:text-white/40">Privacidad</Link>
          <Link href="/terms"   className="hover:text-white/40">Términos</Link>
          <Link href="/help"    className="hover:text-white/40">Ayuda</Link>
        </div>
      </div>
    </main>
  )
}
