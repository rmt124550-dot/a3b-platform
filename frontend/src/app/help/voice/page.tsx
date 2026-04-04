import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Configuración de voz — Ayuda A3B Narrator' }

export default function VoiceHelpPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link href="/help" className="hover:text-white/60">← Centro de Ayuda</Link>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🔊</span>
          <h1 className="text-2xl font-black">Configuración de voz</h1>
        </div>
        <div className="space-y-8 text-sm text-white/60 leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-3">Controles disponibles en el popup</h2>
            <div className="space-y-3">
              {[
                { ctrl: 'Velocidad', rng: '0.5× – 2.0×', desc: 'Controla la rapidez de la narración. 1.0× es la velocidad normal.' },
                { ctrl: 'Volumen',   rng: '0% – 100%',   desc: 'Ajusta el volumen de la voz independientemente del video.' },
                { ctrl: 'Tono',      rng: '0.5 – 2.0',   desc: 'Controla el tono de voz. Menos de 1 = más grave, más de 1 = más agudo.' },
                { ctrl: 'Voz',       rng: 'Lista',        desc: 'Selecciona entre las voces en español disponibles en tu sistema.' },
                { ctrl: 'Idioma',    rng: '10 idiomas',   desc: 'Solo en plan PRO. Cambia el idioma de traducción destino.' },
              ].map(r => (
                <div key={r.ctrl} className="flex gap-4 bg-white/3 border border-white/8 rounded-xl p-4">
                  <div className="w-24 flex-shrink-0">
                    <div className="font-semibold text-white/80 text-xs">{r.ctrl}</div>
                    <div className="text-[#a5b4fc] text-xs mt-0.5 font-mono">{r.rng}</div>
                  </div>
                  <div className="text-white/45 text-xs leading-relaxed">{r.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Mejorar la calidad de voz</h2>
            <div className="space-y-4">
              <div>
                <div className="text-white/80 font-semibold mb-1">🪟 Windows</div>
                <p>Instala voces de alta calidad: <strong className="text-white/70">Configuración → Hora e idioma → Idioma → Español → Opciones → Voz</strong>. Las mejores opciones son <strong>Microsoft Sabina</strong> o <strong>Microsoft Helena</strong>.</p>
              </div>
              <div>
                <div className="text-white/80 font-semibold mb-1">🍎 macOS</div>
                <p>Las voces de alta calidad ya vienen instaladas. Ve a <strong className="text-white/70">Preferencias del Sistema → Accesibilidad → Voz</strong> y descarga <strong>Mónica</strong> o <strong>Paulina</strong>.</p>
              </div>
              <div>
                <div className="text-white/80 font-semibold mb-1">🤖 Android</div>
                <p>Instala el motor de síntesis de voz de Google TTS y activa el idioma español: <strong className="text-white/70">Configuración → Administración general → Idioma → Síntesis de texto</strong>.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">Usar DeepL para mayor calidad (PRO)</h2>
            <p>En el plan PRO, puedes cambiar el motor de traducción de Google Translate a DeepL desde:</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li><Link href="/dashboard/settings" className="text-[#a5b4fc] hover:underline">Dashboard → Ajustes</Link></li>
              <li>Cambia <strong className="text-white/80">"Traductor"</strong> de Google a DeepL</li>
              <li>Guarda la configuración</li>
            </ol>
            <p className="mt-2 text-white/40 text-xs">DeepL ofrece traducción más natural y contextual que Google Translate, especialmente para textos técnicos y académicos.</p>
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
