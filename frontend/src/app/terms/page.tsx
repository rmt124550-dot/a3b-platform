import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Uso — A3B Narrator',
  description: 'Términos y condiciones de uso del servicio A3B Narrator.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white text-sm mb-10 block">← Volver al inicio</Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📋</span>
          <h1 className="text-3xl font-black">Términos de Uso</h1>
        </div>
        <p className="text-white/30 text-sm mb-10">Última actualización: Abril 2026 · A3B Cloud</p>

        <div className="space-y-8 text-white/60 leading-relaxed text-sm">

          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Aceptación de los términos</h2>
            <p>Al acceder o usar A3B Narrator (la "Extensión" o el "Servicio") aceptas estos Términos de Uso en su totalidad. Si no estás de acuerdo con alguna parte, no uses el Servicio. A3B Cloud se reserva el derecho de modificar estos términos en cualquier momento, notificando a los usuarios con al menos 15 días de antelación.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Descripción del servicio</h2>
            <p>A3B Narrator es una extensión de navegador que detecta subtítulos en plataformas educativas de vídeo (Coursera, YouTube, Udemy, edX, LinkedIn Learning y otras), los traduce automáticamente al idioma de tu elección y los narra en voz alta usando la síntesis de voz nativa del navegador.</p>
            <p className="mt-2">El servicio incluye:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-white/80">Plan Free:</strong> Coursera, Google Translate, narración en español, sin cuenta obligatoria.</li>
              <li><strong className="text-white/80">Plan PRO ($4.99/mes):</strong> Todas las plataformas, DeepL, 10 idiomas, historial y diccionario. Trial de 7 días sin tarjeta.</li>
              <li><strong className="text-white/80">Plan Team ($19.99/mes):</strong> Todo lo de PRO más gestión de usuarios, API y soporte prioritario. Trial de 7 días sin tarjeta.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Registro y cuenta</h2>
            <p>Para acceder a funciones PRO o Team debes crear una cuenta con email y contraseña. Eres responsable de mantener la confidencialidad de tus credenciales. Notifícanos inmediatamente si sospechas acceso no autorizado a tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Periodo de prueba y facturación</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Los planes PRO y Team incluyen un periodo de prueba de <strong className="text-white/80">7 días gratuitos sin tarjeta de crédito</strong>.</li>
              <li>Al finalizar el periodo de prueba sin añadir método de pago, tu cuenta pasa automáticamente al plan Free.</li>
              <li>Si añades método de pago, Stripe cobrará al finalizar el trial.</li>
              <li>La facturación es mensual. Puedes cancelar en cualquier momento desde tu dashboard sin penalización.</li>
              <li>No realizamos reembolsos por periodos parciales, salvo obligación legal o a discreción de A3B Cloud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Uso permitido</h2>
            <p>El Servicio está destinado a uso personal y educativo. Queda expresamente prohibido:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Usar el Servicio de forma comercial sin autorización escrita de A3B Cloud.</li>
              <li>Realizar ingeniería inversa, descompilar o modificar el código del Servicio.</li>
              <li>Redistribuir, vender o sublicenciar el acceso al Servicio.</li>
              <li>Usar el Servicio de manera que viole los términos de uso de las plataformas de terceros (Coursera, YouTube, etc.).</li>
              <li>Sobrecargar, atacar o intentar vulnerar la infraestructura del Servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Propiedad intelectual</h2>
            <p>El código fuente de la extensión de navegador está disponible bajo licencia <a href="https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">MIT en GitHub</a>.</p>
            <p className="mt-2">El backend, la plataforma web, la marca A3B Narrator y todos los activos asociados son propiedad exclusiva de A3B Cloud y están protegidos por derechos de autor. Todos los derechos reservados.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">7. Disponibilidad del servicio</h2>
            <p>Nos esforzamos por mantener el Servicio disponible 24/7, pero no garantizamos disponibilidad ininterrumpida. Podemos realizar mantenimientos programados con aviso previo. Las actualizaciones de las plataformas de terceros pueden afectar temporalmente el funcionamiento de la extensión.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">8. Limitación de responsabilidad</h2>
            <p>El Servicio se proporciona "tal cual". A3B Cloud no garantiza la exactitud de las traducciones automáticas. No nos responsabilizamos por:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Cambios en las plataformas de terceros que afecten la detección de subtítulos.</li>
              <li>Errores en traducciones automáticas.</li>
              <li>Pérdida de datos derivada de uso incorrecto del Servicio.</li>
              <li>Daños indirectos o consecuentes derivados del uso del Servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">9. Cancelación y terminación</h2>
            <p>Puedes cancelar tu suscripción en cualquier momento desde <Link href="/dashboard/billing" className="text-indigo-400 hover:underline">Dashboard → Facturación</Link>. Al cancelar, conservas acceso hasta el fin del periodo pagado, luego pasas a Free.</p>
            <p className="mt-2">A3B Cloud puede suspender o terminar tu cuenta si violas estos Términos, con o sin previo aviso dependiendo de la gravedad.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">10. Ley aplicable</h2>
            <p>Estos Términos se rigen por la legislación española y la normativa de la Unión Europea aplicable. Para cualquier disputa, las partes se someten a la jurisdicción de los tribunales de Lima, Perú.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">11. Contacto</h2>
            <p>Para cualquier consulta sobre estos Términos: <a href="mailto:hello@a3bhub.cloud" className="text-indigo-400 hover:underline">hello@a3bhub.cloud</a></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-6 text-xs text-white/25">
          <Link href="/privacy" className="hover:text-white/50 transition-colors">Política de Privacidad</Link>
          <Link href="/" className="hover:text-white/50 transition-colors">Inicio</Link>
          <a href="mailto:hello@a3bhub.cloud" className="hover:text-white/50 transition-colors">hello@a3bhub.cloud</a>
        </div>
      </div>
    </main>
  )
}
