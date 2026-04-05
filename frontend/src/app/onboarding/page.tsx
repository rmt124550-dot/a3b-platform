'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { api } from '@/lib/api'

const STEPS = [
  { id:'welcome',   icon:'🎉', title:'¡Bienvenido a A3B!' },
  { id:'install',   icon:'⬇️', title:'Instala la extensión' },
  { id:'platform',  icon:'🎓', title:'Abre un curso' },
  { id:'activate',  icon:'🔊', title:'Activa el narrador' },
  { id:'refer',     icon:'🎁', title:'Invita amigos' },
]

export default function OnboardingPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { user }     = useAuthStore()
  const [step,       setStep]      = useState(0)
  const [referralLink,setReferralLink]= useState('')
  const [copied,     setCopied]    = useState(false)

  useEffect(() => {
    api.get('/api/referrals/my-link').then(r => setReferralLink(r.data.link)).catch(() => {})
  }, [])

  function copy() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id}
              onClick={() => i < step && setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === step   ? 'w-8 bg-[#6366f1]' :
                i < step     ? 'w-4 bg-[#6366f1]/40 cursor-pointer' :
                               'w-4 bg-white/10'
              }`} />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
          <div className="text-4xl mb-4 text-center">{current.icon}</div>
          <h2 className="text-xl font-black text-center mb-6">{current.title}</h2>

          {/* Paso 0: Bienvenida */}
          {step === 0 && (
            <div className="space-y-4 text-sm text-white/55">
              <p>Hola{user?.name ? ` ${user.name.split(' ')[0]}` : ''}! Tienes <strong className="text-emerald-400">36 días gratis</strong> para explorar A3B Narrator.</p>
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                <p className="font-bold text-emerald-400 mb-2">✅ Tu cuenta incluye:</p>
                <ul className="space-y-1 text-white/60 text-xs">
                  <li>• Narración en Coursera (gratis)</li>
                  <li>• Google Translate automático</li>
                  <li>• 10 idiomas de destino</li>
                  <li>• Overlay de subtítulos</li>
                </ul>
              </div>
            </div>
          )}

          {/* Paso 1: Instalar */}
          {step === 1 && (
            <div className="space-y-4 text-sm text-white/55">
              <p>Descarga e instala la extensión en tu navegador:</p>
              <div className="space-y-2">
                {[
                  { label:'Chrome / Edge / Kiwi', href:'https://github.com/rmt124550-dot/a3b-coursera-voice-narrator/releases/download/v2.5.0/a3b-narrator-v2.5.1-chrome.zip', icon:'⬇️' },
                  { label:'Firefox (AMO)', href:'https://addons.mozilla.org', icon:'🦊' },
                ].map(btn => (
                  <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl
                               px-4 py-3 hover:border-white/25 hover:bg-white/8 transition-all">
                    <span>{btn.icon}</span>
                    <span className="text-white/70 font-medium text-sm">{btn.label}</span>
                    <span className="ml-auto text-white/30 text-xs">Descargar →</span>
                  </a>
                ))}
              </div>
              <p className="text-white/30 text-xs">
                Chrome: Extensions → Cargar descomprimida → selecciona la carpeta del ZIP.
              </p>
            </div>
          )}

          {/* Paso 2: Plataforma */}
          {step === 2 && (
            <div className="space-y-4 text-sm text-white/55">
              <p>Ve a cualquier video en Coursera u otra plataforma compatible:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['🎓','Coursera','coursera.org','Trial'],
                  ['▶️','YouTube','youtube.com','PRO'],
                  ['📚','Udemy','udemy.com','PRO'],
                  ['🏛️','edX','edx.org','PRO'],
                ].map(([icon,name,url,plan]) => (
                  <a key={name as string} href={`https://${url}`} target="_blank" rel="noopener noreferrer"
                    className="bg-white/3 border border-white/8 rounded-xl p-3 hover:border-white/15 transition-all">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="font-semibold text-xs text-white/70">{name}</div>
                    <div className={`text-[10px] mt-0.5 ${plan==='Trial'?'text-emerald-400':'text-[#a5b4fc]'}`}>{plan}</div>
                  </a>
                ))}
              </div>
              <p className="text-white/30 text-xs">
                Activa los subtítulos en inglés (CC) en el reproductor del video.
              </p>
            </div>
          )}

          {/* Paso 3: Activar */}
          {step === 3 && (
            <div className="space-y-4 text-sm text-white/55">
              <p>Con la extensión instalada y un video abierto:</p>
              <div className="space-y-3">
                {[
                  { n:'1', t:'Haz clic en el icono 🔊 en la barra del navegador' },
                  { n:'2', t:'Presiona "Activar Narrador" en el popup' },
                  { n:'3', t:'El audio comenzará en ~200ms cuando aparezca el próximo subtítulo' },
                ].map(s => (
                  <div key={s.n} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30
                                     flex items-center justify-center text-xs font-bold text-[#6366f1] flex-shrink-0">
                      {s.n}
                    </span>
                    <span className="text-sm">{s.t}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-3 text-xs text-[#a5b4fc]">
                💡 Tip: Ajusta la velocidad (1.0×) y voz en Ajustes del popup para mejor experiencia.
              </div>
            </div>
          )}

          {/* Paso 4: Referidos */}
          {step === 4 && (
            <div className="space-y-4 text-sm text-white/55">
              <p>Invita amigos y <strong className="text-white/80">ambos ganan +7 días</strong> de trial gratis. Sin límite.</p>
              <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                <div className="text-xs text-white/40 mb-2">Tu link de invitación:</div>
                <div className="flex gap-2">
                  <code className="flex-1 min-w-0 text-[10px] text-[#a5b4fc] bg-black/30
                                   border border-white/8 rounded-lg px-3 py-2 truncate">
                    {referralLink || 'Cargando...'}
                  </code>
                  <button onClick={copy}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                             : 'bg-white/6 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}>
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
              </div>
              <p className="text-white/30 text-xs">
                También puedes compartirlo desde Dashboard → Referidos.
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-5">
          {step > 0 && (
            <button onClick={() => setStep(s => s-1)}
              className="border border-white/10 text-white/50 font-medium px-5 py-3
                         rounded-xl hover:border-white/25 transition-all text-sm">
              ← Atrás
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(s => s+1)}
              className="flex-1 bg-[#6366f1] text-white font-black py-3 rounded-xl
                         hover:bg-[#5558e8] transition-all text-sm">
              Continuar →
            </button>
          ) : (
            <button onClick={() => router.push('/dashboard')}
              className="flex-1 bg-emerald-500 text-white font-black py-3 rounded-xl
                         hover:bg-emerald-400 transition-all text-sm">
              🚀 Ir al dashboard →
            </button>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
          <button onClick={() => router.push('/dashboard')} className="hover:text-white/40">
            Saltar →
          </button>
        </p>
      </div>
    </div>
  )
}
