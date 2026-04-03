import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — A3B Narrator',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white text-sm mb-10 block">← Volver</Link>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🔒</span>
          <h1 className="text-3xl font-black">Política de Privacidad</h1>
        </div>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/60 leading-relaxed">
          <p className="text-white/80">Última actualización: Abril 2026</p>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">Datos que recopilamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white/80">Email y nombre</strong> — para crear tu cuenta</li>
              <li><strong className="text-white/80">Configuración de voz</strong> — velocidad, idioma, volumen</li>
              <li><strong className="text-white/80">Historial de traducciones</strong> — solo en planes PRO/Team, almacenado por 30 días</li>
              <li><strong className="text-white/80">Datos de pago</strong> — procesados por Stripe, no almacenamos tarjetas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">Cómo usamos los datos</h2>
            <p>Usamos tus datos únicamente para proveer el servicio: autenticación, personalización de la voz y narración. No vendemos ni compartimos datos con terceros para publicidad.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">Traducción</h2>
            <p>En el plan Free usamos la API pública de Google Translate. En planes PRO/Team usamos DeepL. Los textos se envían a estos servicios para su traducción según sus propias políticas de privacidad.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">Tus derechos</h2>
            <p>Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento escribiendo a <a href="mailto:hello@a3bhub.cloud" className="text-indigo-400">hello@a3bhub.cloud</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">Seguridad</h2>
            <p>Usamos HTTPS en todas las comunicaciones, contraseñas hasheadas con bcrypt y tokens JWT con expiración corta. Los datos se almacenan en servidores seguros.</p>
          </section>
        </div>
        <div className="mt-12 flex gap-4 text-sm text-white/30">
          <Link href="/terms" className="hover:text-white/60">Términos de Uso</Link>
          <Link href="/" className="hover:text-white/60">Inicio</Link>
        </div>
      </div>
    </main>
  )
}
