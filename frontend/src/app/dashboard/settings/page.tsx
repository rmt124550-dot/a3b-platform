'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface Settings {
  voiceSpeed: number; voiceVolume: number; voicePitch: number
  voiceName: string | null; targetLang: string
  showOverlay: boolean; translator: 'google' | 'deepl'
}

const LANGS = [
  { code: 'es', name: '🇪🇸 Español' }, { code: 'pt', name: '🇧🇷 Portugués' },
  { code: 'fr', name: '🇫🇷 Francés' },  { code: 'de', name: '🇩🇪 Alemán' },
  { code: 'it', name: '🇮🇹 Italiano' },  { code: 'ja', name: '🇯🇵 Japonés' },
  { code: 'ko', name: '🇰🇷 Coreano' },  { code: 'zh', name: '🇨🇳 Chino' },
  { code: 'ar', name: '🇸🇦 Árabe' },    { code: 'ru', name: '🇷🇺 Ruso' },
]

function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format: (v: number) => string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-white/45 uppercase tracking-wider">{label}</label>
        <span className="font-mono text-sm text-indigo">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #6366f1 ${((value-min)/(max-min))*100}%, rgba(255,255,255,0.1) 0)` }}
      />
      <div className="flex justify-between text-[10px] text-white/20 mt-1 font-mono">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState<Settings>({
    voiceSpeed: 1, voiceVolume: 1, voicePitch: 1,
    voiceName: null, targetLang: 'es',
    showOverlay: true, translator: 'google',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    api.get('/api/user/settings').then(({ data }) => {
      setSettings(data.settings)
    }).catch(() => {}).finally(() => setLoading(false))

    // Load browser voices
    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices() ?? []
      const spanish = v.filter(v => v.lang.startsWith(settings.targetLang))
      setVoices(spanish.length ? spanish : v.slice(0, 10))
    }
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
  }, [])

  async function save() {
    setSaving(true)
    try {
      await api.patch('/api/user/settings', settings)
      toast.success('Configuración guardada')
    } catch { toast.error('Error al guardar') }
    finally { setSaving(false) }
  }

  function testVoice() {
    if (!window.speechSynthesis) return toast.error('Tu navegador no soporta TTS')
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance('Esta es una prueba de voz de A3B Narrator')
    u.lang = settings.targetLang
    u.rate = settings.voiceSpeed
    u.volume = settings.voiceVolume
    u.pitch = settings.voicePitch
    if (settings.voiceName) {
      const v = voices.find(v => v.name === settings.voiceName)
      if (v) u.voice = v
    }
    window.speechSynthesis.speak(u)
  }

  const update = (key: keyof Settings, val: any) => setSettings(s => ({ ...s, [key]: val }))

  if (loading) return <div className="p-4 md:p-8 text-white/30 text-sm">Cargando...</div>

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="mb-8 animate-fadeup">
        <h1 className="font-serif text-3xl mb-1">Configuración</h1>
        <p className="text-sm text-white/40">Personaliza tu experiencia de narración</p>
      </div>

      <div className="space-y-5 animate-fadeup delay-100">
        {/* Voz */}
        <div className="card p-6">
          <h2 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Control de voz</h2>
          <div className="space-y-6">
            <Slider label="Velocidad" value={settings.voiceSpeed} min={0.5} max={2} step={0.1}
              onChange={(v) => update('voiceSpeed', v)} format={(v) => `${v.toFixed(1)}×`} />
            <Slider label="Volumen" value={settings.voiceVolume} min={0} max={1} step={0.05}
              onChange={(v) => update('voiceVolume', v)} format={(v) => `${Math.round(v*100)}%`} />
            <Slider label="Tono" value={settings.voicePitch} min={0.5} max={2} step={0.1}
              onChange={(v) => update('voicePitch', v)} format={(v) => v.toFixed(1)} />
          </div>
        </div>

        {/* Idioma y motor */}
        <div className="card p-6">
          <h2 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Traducción</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/45 uppercase tracking-wider mb-2">Idioma destino</label>
              <select
                value={settings.targetLang}
                onChange={(e) => update('targetLang', e.target.value)}
                disabled={user?.plan === 'free'}
                className="input text-sm"
              >
                {LANGS.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
              {user?.plan === 'free' && (
                <p className="text-xs text-white/30 mt-1.5">Múltiples idiomas requieren plan PRO</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/45 uppercase tracking-wider mb-2">Motor de traducción</label>
              <div className="grid grid-cols-2 gap-2">
                {(['google', 'deepl'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update('translator', t)}
                    disabled={t === 'deepl' && user?.plan === 'free'}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      settings.translator === t
                        ? 'border-indigo bg-indigo/10 text-indigo'
                        : 'border-white/8 text-white/40 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {t === 'google' ? '🌐 Google Translate' : '⚡ DeepL PRO'}
                    {t === 'deepl' && user?.plan === 'free' && <span className="block text-[10px] text-white/25 mt-0.5">Requiere PRO</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="card p-6">
          <h2 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Pantalla</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium">Mostrar subtítulos en pantalla</div>
              <div className="text-xs text-white/35 mt-0.5">Overlay flotante con texto original y traducción</div>
            </div>
            <button
              onClick={() => update('showOverlay', !settings.showOverlay)}
              className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${
                settings.showOverlay ? 'bg-indigo' : 'bg-white/10'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                settings.showOverlay ? 'left-5' : 'left-0.5'
              }`} />
            </button>
          </label>
        </div>

        {/* Voz del sistema */}
        {voices.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Voz del sistema</h2>
            <select
              value={settings.voiceName ?? ''}
              onChange={(e) => update('voiceName', e.target.value || null)}
              className="input text-sm mb-4"
            >
              <option value="">Automática (recomendado)</option>
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
            <button onClick={testVoice} className="btn-ghost text-sm px-4">
              🔊 Probar voz
            </button>
          </div>
        )}

        {/* Save */}
        <button onClick={save} disabled={saving} className="btn-primary w-full h-11 text-sm">
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  )
}
