import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Centro de Ayuda — A3B Narrator',
  description: 'Guías, preguntas frecuentes y soporte para A3B Narrator.',
}

const CATEGORIES = [
  {
    icon: '🚀',
    title: 'Primeros pasos',
    desc: 'Instala y configura la extensión en minutos',
    href: '/help/getting-started',
    articles: ['Instalar en Chrome', 'Instalar en Edge', 'Instalar en Kiwi (Android)', 'Primera narración'],
  },
  {
    icon: '🎓',
    title: 'Plataformas',
    desc: 'Guías específicas para cada plataforma',
    href: '/help/platforms',
    articles: ['Coursera (gratis)', 'YouTube (PRO)', 'Udemy (PRO)', 'edX (PRO)', 'LinkedIn Learning (PRO)'],
  },
  {
    icon: '🔊',
    title: 'Configuración de voz',
    desc: 'Ajusta la velocidad, idioma y voz del narrador',
    href: '/help/voice',
    articles: ['Cambiar idioma', 'Ajustar velocidad', 'Elegir voz', 'Usar DeepL (PRO)'],
  },
  {
    icon: '💳',
    title: 'Cuenta y facturación',
    desc: 'Planes, pagos, trial y cancelación',
    href: '/help/billing',
    articles: ['Prueba 7 días gratis', 'Actualizar a PRO', 'Cancelar suscripción', 'Facturas y recibos'],
  },
  {
    icon: '🔧',
    title: 'Solución de problemas',
    desc: 'La extensión no narra, subtítulos no detectados...',
    href: '/help/troubleshooting',
    articles: ['No escucho audio', 'Subtítulos no detectados', 'Extensión no carga', 'Error en YouTube'],
  },
  {
    icon: '📱',
    title: 'Android y móvil',
    desc: 'Uso en Kiwi Browser y Firefox Android',
    href: '/help/mobile',
    articles: ['Kiwi Browser', 'Firefox Nightly', 'Bookmarklet universal', 'Problemas en Android'],
  },
]

const POPULAR_FAQS = [
  {
    q: '¿Cómo instalo A3B Narrator en Chrome?',
    a: 'Ve a chrome.google.com/webstore y busca "A3B Narrator". Haz clic en "Añadir a Chrome". El ícono 🔊 aparecerá en la barra del navegador. Luego abre cualquier video de Coursera con subtítulos en inglés activados y pulsa "Activar Narrador".',
  },
  {
    q: '¿Por qué no escucho audio en YouTube?',
    a: 'YouTube requiere el plan PRO. Con el plan Free puedes usar Coursera de forma completa y gratuita. Para YouTube, Udemy, edX y LinkedIn Learning, activa una prueba gratuita de 7 días sin necesidad de tarjeta de crédito.',
  },
  {
    q: '¿Los subtítulos tienen que estar activados en el video?',
    a: 'Sí. A3B Narrator detecta los subtítulos que muestra el reproductor del video. Activa los subtítulos en inglés usando el botón CC (closed captions) del reproductor antes de activar el narrador.',
  },
  {
    q: '¿Puedo cancelar el plan PRO en cualquier momento?',
    a: 'Sí. Puedes cancelar desde Dashboard → Facturación en cualquier momento. Seguirás teniendo acceso PRO hasta el final del período pagado y luego pasarás automáticamente al plan Free.',
  },
  {
    q: '¿La prueba de 7 días requiere tarjeta de crédito?',
    a: 'No. Puedes activar el trial de 7 días sin ingresar ningún método de pago. Si quieres continuar después de los 7 días, se te pedirá una tarjeta. Si no la agregas, vuelves automáticamente al plan Free.',
  },
  {
    q: '¿Qué idiomas puedes traducir y narrar?',
    a: 'Con el plan Free, la traducción es al español (ES). Con el plan PRO y DeepL, puedes elegir entre 10 idiomas: español, portugués, francés, alemán, italiano, japonés, coreano, chino, árabe y ruso.',
  },
  {
    q: '¿Funciona en Android?',
    a: 'Sí. Instala Kiwi Browser desde Play Store (acepta extensiones de Chrome). Descarga el ZIP de A3B desde la sección de Releases en GitHub y cárgalo en Kiwi. También funciona en Firefox Nightly vía colección AMO.',
  },
  {
    q: '¿A3B Narrator funciona sin conexión a internet?',
    a: 'La narración en sí funciona con la síntesis de voz nativa del navegador (sin internet). Pero la traducción necesita internet para llamar a Google Translate (Free) o DeepL (PRO). La sincronización de configuración en la nube también requiere internet.',
  },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-6 py-12 text-center">
        <Link href="/" className="text-white/30 hover:text-white/60 text-sm mb-6 block">
          ← Volver al inicio
        </Link>
        <div className="text-4xl mb-4">🎧</div>
        <h1 className="text-3xl font-black mb-3">Centro de Ayuda</h1>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          Todo lo que necesitas saber sobre A3B Narrator
        </p>

        {/* Buscador (decorativo — funcionalidad futura) */}
        <div className="mt-6 max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Buscar en el centro de ayuda..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#6366f1]/50"
            readOnly
          />
          <span className="absolute left-3 top-3.5 text-white/25 text-sm">🔍</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Categorías ──────────────────────────────────────── */}
        <h2 className="text-lg font-bold mb-6 text-white/70">Explorar por tema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href}
              className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5 transition-all group">
              <div className="text-2xl mb-3">{cat.icon}</div>
              <div className="font-bold text-sm mb-1 group-hover:text-[#a5b4fc]">{cat.title}</div>
              <div className="text-white/40 text-xs mb-4">{cat.desc}</div>
              <ul className="space-y-1">
                {cat.articles.map(a => (
                  <li key={a} className="text-xs text-white/30 flex items-center gap-1.5">
                    <span className="text-[#6366f1]/60">›</span> {a}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        {/* ── FAQs ────────────────────────────────────────────── */}
        <h2 className="text-lg font-bold mb-6 text-white/70">Preguntas frecuentes</h2>
        <div className="space-y-3 mb-16">
          {POPULAR_FAQS.map((faq, i) => (
            <details key={i}
              className="group bg-white/3 border border-white/8 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-white/3 transition-colors">
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <span className="text-white/30 flex-shrink-0 group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <div className="px-5 pb-4 pt-1">
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* ── Contacto ────────────────────────────────────────── */}
        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-4">💬</div>
          <h3 className="font-bold text-lg mb-2">¿No encontraste lo que buscas?</h3>
          <p className="text-white/40 text-sm mb-6">
            Nuestro equipo responde en menos de 24 horas (días hábiles).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:hello@a3bhub.cloud"
              className="inline-flex items-center gap-2 bg-[#6366f1] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
              ✉️ Enviar email
            </a>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 border border-white/10 text-white/60 font-bold px-6 py-3 rounded-xl hover:border-white/25 hover:text-white transition-all text-sm">
              ◈ Ir al dashboard
            </Link>
          </div>
          <p className="text-white/20 text-xs mt-4">hello@a3bhub.cloud</p>
        </div>

      </div>

      {/* ── Footer minimal ───────────────────────────────────── */}
      <div className="border-t border-white/5 py-6 text-center text-white/20 text-xs">
        <Link href="/" className="hover:text-white/40">A3B Cloud</Link>
        {' · '}
        <Link href="/privacy" className="hover:text-white/40">Privacidad</Link>
        {' · '}
        <Link href="/terms" className="hover:text-white/40">Términos</Link>
      </div>
    </main>
  )
}
