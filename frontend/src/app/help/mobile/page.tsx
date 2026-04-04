import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Android y móvil — Ayuda A3B Narrator' }

export default function MobileHelpPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link href="/help" className="hover:text-white/60">← Centro de Ayuda</Link>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">📱</span>
          <h1 className="text-2xl font-black">Android y móvil</h1>
        </div>
        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-3">Opción 1: Kiwi Browser (Recomendado)</h2>
            <p className="mb-3 text-emerald-400/80 text-xs font-semibold">✅ Mejor experiencia — soporta extensiones de Chrome completas</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Instala <strong className="text-white/80">Kiwi Browser</strong> desde Google Play Store</li>
              <li>Descarga el ZIP desde <a href="https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/latest" target="_blank" rel="noopener noreferrer" className="text-[#a5b4fc] hover:underline">GitHub Releases</a></li>
              <li>Abre <code className="bg-white/8 px-1.5 py-0.5 rounded text-white/70">kiwi://extensions</code></li>
              <li>Activa <strong className="text-white/80">Modo desarrollador</strong></li>
              <li>Toca <strong className="text-white/80">"Load extension (from .zip)"</strong></li>
              <li>Selecciona el ZIP descargado</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Opción 2: Firefox Nightly Android</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Instala <strong className="text-white/80">Firefox Nightly</strong> desde Play Store</li>
              <li>Crea cuenta en <a href="https://addons.mozilla.org" target="_blank" rel="noopener noreferrer" className="text-[#a5b4fc] hover:underline">addons.mozilla.org</a></li>
              <li>Crea una colección con la extensión A3B</li>
              <li>En Firefox: <strong className="text-white/80">Menú → Ajustes → Colección de extensiones</strong></li>
              <li>Ingresa tu ID de usuario AMO y nombre de colección</li>
              <li>Reinicia Firefox e instala desde la colección</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Opción 3: Bookmarklet (cualquier navegador)</h2>
            <p className="mb-3 text-white/40 text-xs">Para Chrome Android, Samsung Browser, Opera, etc.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Visita <Link href="/" className="text-[#a5b4fc] hover:underline">a3bhub.cloud</Link> desde tu navegador móvil</li>
              <li>Guarda la página como marcador/favorito</li>
              <li>Edita el marcador y reemplaza la URL con el código bookmarklet</li>
              <li>Cuando estés en un video de Coursera, abre el marcador para activar el narrador</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Problemas comunes en Android</h2>
            <div className="space-y-3">
              <details className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer list-none text-white/70">No hay voces en español disponibles</summary>
                <div className="px-4 pb-4 pt-1 text-white/45">Ve a Configuración del sistema → Idioma → Síntesis de texto → Motor de TTS de Google → Configuración → Idiomas instalados → Añadir Español.</div>
              </details>
              <details className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer list-none text-white/70">Kiwi no detecta la extensión</summary>
                <div className="px-4 pb-4 pt-1 text-white/45">Asegúrate de descargar el archivo .zip correcto (no el código fuente). El archivo correcto se llama a3b-narrator-vX.X.X.zip.</div>
              </details>
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
