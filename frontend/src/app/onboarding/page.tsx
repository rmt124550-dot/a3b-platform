'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'

const STEPS = [
  {
    n: 1, icon: '⬇️', title: 'Instala la extensión',
    desc: 'Descarga A3B Narrator para tu navegador. Funciona en Chrome, Edge, Firefox y Kiwi Browser.',
    action: {
      label: 'Descargar extensión →',
      href: 'https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/tag/v2.5.0',
      external: true,
    },
    tip: 'Después de instalar, verás el ícono 🔊 en la barra del navegador.',
  },
  {
    n: 2, icon: '🎓', title: 'Abre un curso en Coursera',
    desc: 'Navega a coursera.org, abre cualquier curso con video y activa los subtítulos en inglés (botón CC).',
    action: {
      label: 'Ir a Coursera →',
      href: 'https://coursera.org',
      external: true,
    },
    tip: 'Asegúrate de que los subtítulos estén activados — el narrador los detecta automáticamente.',
  },
  {
    n: 3, icon: '🔊', title: 'Activa el narrador',
    desc: 'Haz clic en el ícono 🔊 de A3B en la barra del navegador y presiona "Activar Narrador". ¡Listo!',
    action: null,
    tip: 'Puedes ajustar velocidad, volumen, tono y voz desde el popup.',
  },
]

export default function OnboardingPage() {
  const router      = useRouter()
  const { user }    = useAuthStore()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  function next() {
    if (isLast) { setDone(true) }
    else { setStep(s => s + 1) }
  }

  if (done) return (
    <main className="min-h-screen bg-surface grain flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-3xl font-black mb-3">¡Ya estás listo!</h1>
        <p className="text-white/45 text-sm mb-8">
          Tienes <strong className="text-emerald-400">36 días gratis</strong> para explorar todas las plataformas.
          Sin tarjeta. Sin límites.
        </p>
        <div className="space-y-3">
          <Link href="/dashboard"
            className="block w-full bg-[#6366f1] text-white font-black py-4 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            Ir al dashboard →
          </Link>
          <a href="https://coursera.org" target="_blank" rel="noopener noreferrer"
            className="block w-full border border-white/12 text-white/60 font-bold py-4 rounded-xl hover:border-white/25 hover:text-white transition-all text-sm">
            Abrir Coursera y probar ahora →
          </a>
        </div>
        <p className="text-white/25 text-xs mt-6">
          ¿Preguntas? <a href="/help" className="underline hover:text-white/50">Centro de ayuda</a>
        </p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-surface grain flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            🎁 36 días gratis activados
          </div>
          <h1 className="text-2xl font-black mb-2">
            Hola{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Configura tu narrador
          </h1>
          <p className="text-white/40 text-sm">3 pasos rápidos y estarás narrando en español</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-all ${
                i < step  ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-[#6366f1] text-white' :
                             'bg-white/8 text-white/30'
              }`}>
                {i < step ? '✓' : s.n}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 transition-all ${i < step ? 'bg-emerald-500' : 'bg-white/8'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-4">
          <div className="text-5xl mb-4">{current.icon}</div>
          <div className="text-white/30 text-xs font-bold uppercase tracking-wider mb-1">
            Paso {current.n} de {STEPS.length}
          </div>
          <h2 className="text-xl font-black mb-3">{current.title}</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6">{current.desc}</p>

          {/* Tip */}
          <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl px-4 py-3 mb-6">
            <p className="text-[#a5b4fc] text-xs">
              <span className="font-bold">💡 Tip: </span>{current.tip}
            </p>
          </div>

          {/* Action button */}
          {current.action && (
            <a href={current.action.href}
              target={current.action.external ? "_blank" : "_self"}
              rel={current.action.external ? "noopener noreferrer" : ""}
              className="block w-full border border-[#6366f1]/40 text-[#a5b4fc] font-bold py-3 rounded-xl hover:bg-[#6366f1]/10 transition-all text-sm text-center mb-4">
              {current.action.label}
            </a>
          )}

          <button onClick={next}
            className="w-full bg-[#6366f1] text-white font-black py-3.5 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            {isLast ? '🎉 ¡Listo! Ver mi dashboard' : 'Siguiente →'}
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => router.push('/dashboard')}
            className="text-white/25 text-xs hover:text-white/50 transition-colors">
            Omitir y ir al dashboard →
          </button>
        </div>
      </div>
    </main>
  )
}
