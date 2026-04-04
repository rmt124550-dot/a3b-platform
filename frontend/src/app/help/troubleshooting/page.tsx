import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Solución de problemas — Ayuda A3B Narrator' }

const ISSUES = [
  {
    q: '🔇 No escucho ningún audio',
    steps: [
      'Verifica que el volumen del sistema no está silenciado',
      'Asegúrate de que los subtítulos en inglés están activados en el video (botón CC)',
      'Comprueba que el narrador está ACTIVADO en el popup de la extensión',
      'En Windows: instala voces de español en Configuración → Hora e idioma → Idioma → Español',
      'En Mac: ve a Preferencias del Sistema → Accesibilidad → Contenido hablado',
      'Haz clic en "Probar voz" en el popup para verificar que el sistema de voz funciona',
    ]
  },
  {
    q: '📝 Los subtítulos no se detectan',
    steps: [
      'Asegúrate de que los subtítulos están VISIBLES en el video (botón CC activado)',
      'En Coursera: busca el botón CC en la parte inferior del reproductor',
      'Recarga la página y vuelve a activar el narrador',
      'Si el problema persiste, la plataforma pudo haber actualizado su interfaz — escríbenos a hello@a3bhub.cloud',
    ]
  },
  {
    q: '🔌 La extensión no aparece o no carga',
    steps: [
      'Ve a chrome://extensions (o edge://extensions) y verifica que A3B Narrator está habilitado',
      'Desactiva y vuelve a activar la extensión',
      'Reinstala la extensión desde Chrome Web Store',
      'Si usas un bloqueador de anuncios, añade api.a3bhub.cloud a la lista blanca',
    ]
  },
  {
    q: '▶️ No funciona en YouTube',
    steps: [
      'YouTube requiere el plan PRO. En el plan Free solo está disponible Coursera',
      'Activa el trial de 7 días gratis desde app.a3bhub.cloud/register?plan=pro',
      'Asegúrate de que el video tiene subtítulos CC disponibles (no todos los videos los tienen)',
      'Los subtítulos autogenerados de YouTube también funcionan',
    ]
  },
  {
    q: '🌐 Error de conexión o traducción',
    steps: [
      'Verifica tu conexión a internet',
      'La traducción requiere internet (Google Translate o DeepL)',
      'Si estás en una red corporativa, puede que el firewall bloquee translate.googleapis.com',
      'Intenta con una red diferente o VPN',
    ]
  },
  {
    q: '📱 No funciona en Kiwi Browser Android',
    steps: [
      'Verifica que Kiwi Browser está actualizado a la versión más reciente',
      'Asegúrate de haber instalado el paquete de idioma Español en Configuración → Idiomas del sistema',
      'Recarga el ZIP de la extensión desde kiwi://extensions',
      'Algunos videos de Coursera en móvil no muestran subtítulos — usa la versión de escritorio web',
    ]
  },
]

export default function TroubleshootingPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link href="/help" className="hover:text-white/60">← Centro de Ayuda</Link>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🔧</span>
          <h1 className="text-2xl font-black">Solución de problemas</h1>
        </div>
        <div className="space-y-4">
          {ISSUES.map((issue, i) => (
            <details key={i} className="group bg-white/3 border border-white/8 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-white/3">
                <span className="font-medium text-sm">{issue.q}</span>
                <span className="text-white/30 group-open:rotate-180 transition-transform text-xs flex-shrink-0 ml-2">▼</span>
              </summary>
              <div className="px-5 pb-5 pt-1">
                <ol className="list-decimal pl-4 space-y-2">
                  {issue.steps.map(s => (
                    <li key={s} className="text-white/50 text-sm">{s}</li>
                  ))}
                </ol>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
          <p className="text-white/50 text-sm mb-4">¿Sigues teniendo problemas? Nuestro equipo te ayuda.</p>
          <a href="mailto:hello@a3bhub.cloud?subject=Problema técnico con A3B Narrator"
            className="inline-block bg-[#6366f1] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            ✉️ Contactar soporte
          </a>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/help" className="text-xs text-white/30 border border-white/10 px-4 py-2 rounded-lg hover:border-white/25 hover:text-white/60 transition-all">← Volver a Ayuda</Link>
        </div>
      </div>
    </main>
  )
}
