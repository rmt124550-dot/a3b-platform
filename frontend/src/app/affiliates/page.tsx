import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Programa de Afiliados — A3B Narrator',
  description: 'Gana un 30% de comisión por cada usuario PRO que refieras. Sin límite de ganancias.',
}

const STEPS = [
  { n: '01', icon: '📝', title: 'Regístrate gratis', desc: 'Crea tu cuenta en A3B y únete al programa de afiliados desde tu dashboard. Sin costos ni requisitos mínimos.' },
  { n: '02', icon: '🔗', title: 'Comparte tu enlace', desc: 'Obtén tu link único de afiliado. Compártelo en YouTube, blog, redes sociales, email o donde tu audiencia te siga.' },
  { n: '03', icon: '💸', title: 'Gana el 30%', desc: 'Recibes el 30% de cada pago durante los primeros 12 meses del cliente referido. Pagos mensuales vía PayPal o transferencia.' },
]

const EXAMPLES = [
  { followers: '1,000', conversion: '2%', referrals: 20,  monthly: '$30',  annual: '$360' },
  { followers: '10,000',conversion: '2%', referrals: 200, monthly: '$300', annual: '$3,600' },
  { followers: '50,000',conversion: '2%', referrals: 1000,monthly: '$1,500',annual: '$18,000' },
]

export default function AffiliatesPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white">

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="px-6 py-20 text-center border-b border-white/5">
        <Link href="/" className="text-white/30 hover:text-white/60 text-sm mb-6 block">← Volver al inicio</Link>
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          💰 PROGRAMA DE AFILIADOS
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Gana el <span className="text-emerald-400">30% de comisión</span><br />
          por cada referido
        </h1>
        <p className="text-white/40 text-base max-w-lg mx-auto mb-8">
          Comparte A3B Narrator con tu audiencia y recibe el 30% de cada suscripción PRO o Team durante los primeros 12 meses. Sin límite de ganancias.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register?affiliate=1"
            className="inline-block bg-emerald-500 text-white font-black px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all text-sm">
            🚀 Unirme al programa gratis
          </Link>
          <a href="#calculator"
            className="inline-block border border-white/12 text-white/60 font-bold px-8 py-4 rounded-xl hover:border-white/25 hover:text-white transition-all text-sm">
            Calcular mis ganancias →
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {[
            { n: '30%', label: 'Comisión por referido' },
            { n: '12 meses', label: 'Duración de la comisión' },
            { n: '$0', label: 'Costo de entrada' },
            { n: '7 días', label: 'Ciclo de pago' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-emerald-400">{s.n}</div>
              <div className="text-white/35 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ── Cómo funciona ──────────────────────────────────── */}
        <h2 className="text-2xl font-black text-center mb-10">Cómo funciona</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {STEPS.map(step => (
            <div key={step.n} className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-white/20 font-mono text-xs">{step.n}</span>
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Calculadora ────────────────────────────────────── */}
        <div id="calculator" className="mb-20">
          <h2 className="text-2xl font-black text-center mb-3">Calcula tus ganancias</h2>
          <p className="text-white/40 text-sm text-center mb-8">Con una tasa de conversión del 2% (promedio conservador)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left py-3 px-4 text-white/40 font-normal">Tu audiencia</th>
                  <th className="text-left py-3 px-4 text-white/40 font-normal">Conversión 2%</th>
                  <th className="text-left py-3 px-4 text-white/40 font-normal">Referidos PRO</th>
                  <th className="text-left py-3 px-4 text-white/40 font-normal">Comisión/mes</th>
                  <th className="text-left py-3 px-4 text-emerald-400 font-bold">Comisión/año</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((ex, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i===1 ? 'bg-emerald-500/5' : ''}`}>
                    <td className="py-3 px-4 font-semibold">{ex.followers}</td>
                    <td className="py-3 px-4 text-white/50">{ex.conversion}</td>
                    <td className="py-3 px-4 text-white/70">{ex.referrals} usuarios</td>
                    <td className="py-3 px-4 text-white/70">{ex.monthly}</td>
                    <td className={`py-3 px-4 font-black ${i===1 ? 'text-emerald-400' : 'text-white'}`}>{ex.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/20 text-xs text-center mt-3">
            * Basado en plan PRO mensual $4.99. Con plan anual y Team, las comisiones son mayores.
          </p>
        </div>

        {/* ── Ideal para ──────────────────────────────────────── */}
        <h2 className="text-2xl font-black text-center mb-8">Ideal para</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-20">
          {[
            { icon: '📺', title: 'YouTubers de educación', desc: 'Canales sobre programación, data science, idiomas, MBA, certificaciones.' },
            { icon: '✍️', title: 'Bloggers y creadores', desc: 'Blogs sobre estudio, productividad, tecnología, aprendizaje online.' },
            { icon: '📱', title: 'Influencers en LinkedIn', desc: 'Profesionales que comparten recursos de capacitación y desarrollo.' },
            { icon: '🎓', title: 'Docentes y tutores', desc: 'Profesores que recomiendan herramientas a sus estudiantes de inglés.' },
            { icon: '💬', title: 'Comunidades y Discord', desc: 'Admins de grupos de estudio, bootcamps, comunidades de learners.' },
            { icon: '📧', title: 'Newsletters', desc: 'Curators de contenido educativo con audiencia hispanohablante.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 bg-white/3 border border-white/8 rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-white/40 text-xs">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Comisiones detalladas ───────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-16">
          <h2 className="font-black text-lg mb-6">Estructura de comisiones</h2>
          <div className="space-y-4">
            {[
              { plan: 'PRO Mensual', price: '$4.99/mes', commission: '$1.50/mes', period: '12 meses' },
              { plan: 'PRO Anual',   price: '$39.99/año', commission: '$12.00/referido', period: 'Pago único' },
              { plan: 'Team Mensual',price: '$19.99/mes', commission: '$6.00/mes', period: '12 meses' },
              { plan: 'Team Anual',  price: '$199.99/año',commission: '$60.00/referido',period: 'Pago único' },
            ].map(row => (
              <div key={row.plan} className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-semibold text-sm">{row.plan}</div>
                  <div className="text-white/35 text-xs">{row.price} · Duración: {row.period}</div>
                </div>
                <div className="text-emerald-400 font-black text-sm">{row.commission}</div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-4">
            Pagos procesados mensualmente vía PayPal o transferencia bancaria internacional (mínimo $50 acumulado).
          </p>
        </div>

        {/* ── CTA final ───────────────────────────────────────── */}
        <div className="text-center bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-10">
          <div className="text-4xl mb-4">💰</div>
          <h2 className="text-2xl font-black mb-3">¿Listo para empezar?</h2>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
            Únete gratis hoy. Tu primer referido puede generar comisiones esta misma semana.
          </p>
          <Link href="/register?affiliate=1"
            className="inline-block bg-emerald-500 text-white font-black px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all text-sm mb-4">
            🚀 Crear mi cuenta de afiliado
          </Link>
          <p className="text-white/25 text-xs">
            ¿Preguntas? <a href="mailto:hello@a3bhub.cloud" className="underline hover:text-white/50">hello@a3bhub.cloud</a>
          </p>
        </div>

        <div className="text-center mt-10 text-white/20 text-xs flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-white/40">Privacidad</Link>
          <Link href="/terms" className="hover:text-white/40">Términos</Link>
          <Link href="/help" className="hover:text-white/40">Ayuda</Link>
        </div>
      </div>
    </main>
  )
}
