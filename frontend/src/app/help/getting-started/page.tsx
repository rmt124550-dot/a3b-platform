import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Primeros pasos — Ayuda A3B Narrator' }

export default function GettingStartedPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link href="/help" className="hover:text-white/60">← Centro de Ayuda</Link>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🚀</span>
          <h1 className="text-2xl font-black">Primeros pasos</h1>
        </div>
        <div className="space-y-10 text-sm text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-4">1. Instalar en Chrome o Edge</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Ve a <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="text-[#a5b4fc] hover:underline">Chrome Web Store</a> y busca <strong className="text-white/80">A3B Narrator</strong></li>
              <li>Haz clic en <strong className="text-white/80">"Añadir a Chrome"</strong> (o "Añadir a Edge")</li>
              <li>Confirma los permisos en el diálogo que aparece</li>
              <li>El ícono 🔊 aparecerá en la barra de extensiones del navegador</li>
            </ol>
            <div className="mt-4 bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-4">
              <p className="text-[#a5b4fc] text-xs font-semibold mb-1">💡 Tip</p>
              <p className="text-white/50 text-xs">Si no ves el ícono 🔊, haz clic en el ícono de puzzle 🧩 en la barra del navegador y fija la extensión.</p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-4">2. Instalar en Android (Kiwi Browser)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Instala <strong className="text-white/80">Kiwi Browser</strong> desde Google Play Store</li>
              <li>Descarga el archivo ZIP de A3B desde <a href="https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/latest" target="_blank" rel="noopener noreferrer" className="text-[#a5b4fc] hover:underline">GitHub Releases</a></li>
              <li>En Kiwi Browser, escribe <code className="bg-white/8 px-1.5 py-0.5 rounded text-white/70">kiwi://extensions</code> en la barra de dirección</li>
              <li>Activa <strong className="text-white/80">"Modo desarrollador"</strong></li>
              <li>Toca <strong className="text-white/80">"Load extension (from .zip)"</strong> y selecciona el ZIP descargado</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-4">3. Tu primera narración</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Ve a <strong className="text-white/80">coursera.org</strong> y abre cualquier curso con video</li>
              <li>Activa los subtítulos en inglés usando el botón <strong className="text-white/80">CC</strong> del reproductor</li>
              <li>Haz clic en el ícono 🔊 en la barra del navegador</li>
              <li>Pulsa <strong className="text-white/80">"Activar Narrador"</strong></li>
              <li>¡Listo! El narrador traducirá y leerá cada subtítulo en español</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-4">4. Crear una cuenta (opcional para Free)</h2>
            <p>El plan Free funciona sin cuenta en Coursera. Crear una cuenta te permite:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Sincronizar tu configuración entre dispositivos</li>
              <li>Guardar historial de frases traducidas (PRO)</li>
              <li>Activar el plan PRO con 7 días gratis</li>
            </ul>
            <div className="mt-4">
              <Link href="/register"
                className="inline-block bg-[#6366f1] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#5558e8] transition-all text-xs">
                Crear cuenta gratis →
              </Link>
            </div>
          </section>

        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex gap-3">
          <Link href="/help" className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg hover:border-white/25 hover:text-white/60 transition-all">← Volver a Ayuda</Link>
          <a href="mailto:hello@a3bhub.cloud" className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg hover:border-white/25 hover:text-white/60 transition-all">✉️ Contactar soporte</a>
        </div>
      </div>
    </main>
  )
}
