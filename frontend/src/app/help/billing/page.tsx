import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Cuenta y Facturación — Ayuda A3B Narrator' }

export default function BillingHelpPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link href="/help" className="hover:text-white/60">← Centro de Ayuda</Link>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">💳</span>
          <h1 className="text-2xl font-black">Cuenta y Facturación</h1>
        </div>
        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-3">Planes disponibles</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { name: 'Free', price: '$0', desc: 'Coursera · Google Translate · Sin cuenta', color: 'border-white/10' },
                { name: 'PRO', price: '$4.99/mes', desc: 'Todas las plataformas · DeepL · 10 idiomas', color: 'border-[#6366f1]/40', highlight: true },
                { name: 'Team', price: '$19.99/mes', desc: 'Todo PRO · API · Dashboard admin', color: 'border-white/10' },
              ].map(p => (
                <div key={p.name} className={`bg-white/3 border ${p.color} rounded-xl p-4 ${p.highlight ? 'bg-[#6366f1]/5' : ''}`}>
                  <div className="font-bold mb-1">{p.name}</div>
                  <div className="text-[#a5b4fc] font-mono text-sm mb-2">{p.price}</div>
                  <div className="text-white/35 text-xs">{p.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Trial de 36 días gratis</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Los planes PRO y Team incluyen <strong className="text-white/80">36 días de prueba gratuita</strong></li>
              <li><strong className="text-white/80">No se requiere tarjeta de crédito</strong> para activar el trial</li>
              <li>Al terminar el trial, puedes agregar una tarjeta para continuar o vuelves al plan Free automáticamente</li>
              <li>Activa el trial en: <Link href="/register?plan=pro" className="text-[#a5b4fc] hover:underline">app.a3bhub.cloud/register?plan=pro</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Cómo cancelar</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Inicia sesión en <Link href="/dashboard/billing" className="text-[#a5b4fc] hover:underline">Dashboard → Facturación</Link></li>
              <li>Haz clic en <strong className="text-white/80">"Gestionar suscripción"</strong></li>
              <li>En el portal de Stripe, selecciona <strong className="text-white/80">"Cancelar plan"</strong></li>
              <li>Conservarás acceso PRO hasta el final del período pagado</li>
            </ol>
            <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-amber-200/60 text-xs">⚠️ No realizamos reembolsos por períodos parciales, salvo en casos excepcionales.</p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Facturas y recibos</h2>
            <p>Recibes automáticamente un recibo por email después de cada cobro. También puedes descargar facturas desde el portal de Stripe en <Link href="/dashboard/billing" className="text-[#a5b4fc] hover:underline">Dashboard → Facturación → Gestionar suscripción</Link>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Métodos de pago aceptados</h2>
            <p>Aceptamos tarjetas Visa, Mastercard, American Express y débito a través de <strong className="text-white/80">Stripe</strong> (plataforma de pago segura). No almacenamos datos de tarjetas en nuestros servidores.</p>
          </section>

        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex gap-3">
          <Link href="/help" className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg hover:border-white/25 hover:text-white/60 transition-all">← Volver a Ayuda</Link>
          <a href="mailto:hello@a3bhub.cloud?subject=Consulta de facturación" className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg hover:border-white/25 hover:text-white/60 transition-all">✉️ Consulta de pago</a>
        </div>
      </div>
    </main>
  )
}
