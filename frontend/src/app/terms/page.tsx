import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Uso — A3B Narrator',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white/40 hover:text-white text-sm mb-10 block">← Volver</Link>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🔊</span>
          <h1 className="text-3xl font-black">Términos de Uso</h1>
        </div>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/60 leading-relaxed">
          <p className="text-white/80">Última actualización: Abril 2026</p>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">1. Aceptación</h2>
            <p>Al usar A3B Narrator aceptas estos términos. Si no estás de acuerdo, no uses el servicio.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">2. Descripción del servicio</h2>
            <p>A3B Narrator es una extensión de navegador que detecta subtítulos en plataformas educativas, los traduce automáticamente y los narra en voz alta usando síntesis de voz del navegador.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">3. Uso permitido</h2>
            <p>El servicio es para uso personal y educativo. No está permitido el uso comercial sin autorización, la ingeniería inversa del código, ni el uso que viole los términos de las plataformas de terceros.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">4. Planes y pagos</h2>
            <p>Los planes PRO y Team se cobran mensualmente via Stripe. Puedes cancelar en cualquier momento desde tu dashboard. El plan Free está disponible sin costo por tiempo indefinido.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">5. Limitación de responsabilidad</h2>
            <p>A3B Cloud no se responsabiliza por cambios en las plataformas de terceros que puedan afectar el funcionamiento de la extensión. Las traducciones son automáticas y pueden contener errores.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-2">6. Contacto</h2>
            <p>Para consultas escríbenos a: <a href="mailto:hello@a3bhub.cloud" className="text-indigo-400">hello@a3bhub.cloud</a></p>
          </section>
        </div>
        <div className="mt-12 flex gap-4 text-sm text-white/30">
          <Link href="/privacy" className="hover:text-white/60">Política de Privacidad</Link>
          <Link href="/" className="hover:text-white/60">Inicio</Link>
        </div>
      </div>
    </main>
  )
}
