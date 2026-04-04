import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — A3B Narrator',
  description: 'Cómo A3B Cloud recopila, usa y protege tus datos personales.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white text-sm mb-10 block">← Volver al inicio</Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔒</span>
          <h1 className="text-3xl font-black">Política de Privacidad</h1>
        </div>
        <p className="text-white/30 text-sm mb-10">Última actualización: Abril 2026 · A3B Cloud</p>

        <div className="space-y-8 text-white/60 leading-relaxed text-sm">

          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Quién somos</h2>
            <p>A3B Cloud opera el servicio A3B Narrator, una extensión de navegador y plataforma web accesibles en <a href="https://a3bhub.cloud" className="text-indigo-400 hover:underline">a3bhub.cloud</a>. Responsable del tratamiento: A3B Cloud · hello@a3bhub.cloud.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Datos que recopilamos</h2>
            <ul className="space-y-2 list-none">
              {[
                ['Cuenta', 'Nombre y dirección de email al registrarte.'],
                ['Configuración de voz', 'Velocidad, idioma, volumen y nombre de la voz seleccionada. Se sincroniza en la nube si tienes cuenta.'],
                ['Historial de traducciones', 'Solo en planes PRO y Team. Se almacena por 30 días y luego se elimina automáticamente.'],
                ['Datos de pago', 'Procesados íntegramente por Stripe. Nunca almacenamos números de tarjeta ni datos bancarios.'],
                ['Logs de uso', 'Acciones anónimas (activar narrador, plataforma usada) para mejorar el servicio. Sin identificación personal.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-2">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  <span><strong className="text-white/80">{title}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Cómo usamos los datos</h2>
            <p>Usamos tus datos exclusivamente para:</p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>Autenticarte y gestionar tu cuenta</li>
              <li>Sincronizar tu configuración de voz entre dispositivos</li>
              <li>Procesar pagos de suscripción a través de Stripe</li>
              <li>Enviarte emails transaccionales (bienvenida, factura, cancelación)</li>
              <li>Mejorar el rendimiento y detectar errores del servicio</li>
            </ul>
            <p className="mt-3 text-white/40">No vendemos, alquilamos ni compartimos tus datos con terceros para fines publicitarios.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Servicios de terceros</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-white/80">Google Translate</strong> — Plan Free. Los textos de subtítulos se envían a la API pública de Google.</li>
              <li><strong className="text-white/80">DeepL</strong> — Planes PRO y Team. Los textos se envían a DeepL para traducción de mayor calidad.</li>
              <li><strong className="text-white/80">Stripe</strong> — Procesamiento de pagos. Sujeto a la <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">política de Stripe</a>.</li>
              <li><strong className="text-white/80">Resend</strong> — Envío de emails transaccionales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Retención de datos</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>Datos de cuenta: mientras la cuenta esté activa.</li>
              <li>Historial de traducciones (PRO/Team): 30 días.</li>
              <li>Logs de uso: 90 días máximo.</li>
              <li>Datos de pago: según obligaciones legales y fiscales (generalmente 5 años).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Tus derechos</h2>
            <p>Tienes derecho a acceder, rectificar, exportar y eliminar tus datos. Para ejercer cualquiera de estos derechos escríbenos a <a href="mailto:hello@a3bhub.cloud" className="text-indigo-400 hover:underline">hello@a3bhub.cloud</a>.</p>
            <p className="mt-2">Puedes eliminar tu cuenta en cualquier momento desde <Link href="/dashboard/settings" className="text-indigo-400 hover:underline">Ajustes → Eliminar cuenta</Link>. Todos tus datos se borran en un plazo máximo de 30 días.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">7. Seguridad</h2>
            <p>Todas las comunicaciones usan HTTPS/TLS. Las contraseñas se hashean con bcrypt (coste 12). Los tokens de sesión usan JWT con expiración corta. Los datos se almacenan en servidores en la UE.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">8. Cookies</h2>
            <p>Usamos únicamente cookies técnicas necesarias para la autenticación (token JWT en localStorage). No usamos cookies de seguimiento ni publicidad.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">9. Cambios en esta política</h2>
            <p>Notificaremos cualquier cambio relevante por email a los usuarios registrados con al menos 15 días de antelación.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">10. Contacto</h2>
            <p>Para cualquier consulta sobre privacidad: <a href="mailto:hello@a3bhub.cloud" className="text-indigo-400 hover:underline">hello@a3bhub.cloud</a></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-6 text-xs text-white/25">
          <Link href="/terms" className="hover:text-white/50 transition-colors">Términos de Uso</Link>
          <Link href="/" className="hover:text-white/50 transition-colors">Inicio</Link>
          <a href="mailto:hello@a3bhub.cloud" className="hover:text-white/50 transition-colors">hello@a3bhub.cloud</a>
        </div>
      </div>
    </main>
  )
}
