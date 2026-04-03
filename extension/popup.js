// ─── A3B Popup v3.1 ──────────────────────────────────────────────────────────
const runtime = typeof browser !== 'undefined' ? browser : chrome

// ─── Estado ───────────────────────────────────────────────────────────────────
let active   = false
let platform = 'generic'
let settings = {}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id)

function setStatus(msg, type = 'info') {
  const bar = $('status-bar')
  const txt = $('status-text')
  bar.className = `status ${type}`
  txt.textContent = msg
}

function highlightPlatform(name) {
  document.querySelectorAll('.platform-badge').forEach(el => el.classList.remove('detected'))
  const el = $(`pb-${name}`)
  if (el) el.classList.add('detected')
  $('platform-badge').textContent = name.toUpperCase()
}

// ─── Cargar settings guardados ────────────────────────────────────────────────
async function loadSettings() {
  return new Promise(resolve => {
    runtime.storage.local.get(['settings','userToken','userPlan','userEmail'], data => {
      settings = data.settings || {
        voiceSpeed: 1, voiceVolume: 1, voicePitch: 1,
        voiceName: null, targetLang: 'es', showOverlay: true,
      }
      resolve(data)
    })
  })
}

function saveSettings() {
  runtime.storage.local.set({ settings })
}

// ─── Sincronizar controles con settings ──────────────────────────────────────
function syncControls() {
  $('speed').value   = settings.voiceSpeed
  $('volume').value  = settings.voiceVolume
  $('pitch').value   = settings.voicePitch
  $('lang-select').value = settings.targetLang || 'es'
  $('overlay-toggle').checked = settings.showOverlay !== false
  $('speed-val').textContent  = parseFloat(settings.voiceSpeed).toFixed(1) + '×'
  $('volume-val').textContent = Math.round(settings.voiceVolume * 100) + '%'
  $('pitch-val').textContent  = parseFloat(settings.voicePitch).toFixed(1)
}

// ─── Cargar voces del sistema ─────────────────────────────────────────────────
function loadVoices() {
  const voices  = speechSynthesis.getVoices()
  const sel     = $('voice-select')
  const langMap = { es:['es','spanish'], pt:['pt','portuguese'], fr:['fr','french'],
                    de:['de','german'], it:['it','italian'], ja:['ja','japanese'],
                    ko:['ko','korean'], zh:['zh','chinese'], ar:['ar','arabic'], ru:['ru','russian'] }
  const patterns = langMap[settings.targetLang] || ['es','spanish']

  const filtered = voices.filter(v =>
    patterns.some(p => v.lang.toLowerCase().startsWith(p) || v.name.toLowerCase().includes(p))
  )

  sel.innerHTML = '<option value="">— Sistema default —</option>' +
    filtered.map(v => `<option value="${v.name}" ${v.name===settings.voiceName?'selected':''}>${v.name}</option>`).join('') +
    (filtered.length === 0 ? voices.slice(0,10).map(v => `<option value="${v.name}">${v.name}</option>`).join('') : '')
}

speechSynthesis.onvoiceschanged = loadVoices

// ─── Comunicación con content script ─────────────────────────────────────────
async function sendToContent(msg) {
  const [tab] = await runtime.tabs.query({ active: true, currentWindow: true })
  if (!tab) return null
  return new Promise(resolve => {
    runtime.tabs.sendMessage(tab.id, msg, resp => {
      if (runtime.lastError) resolve(null)
      else resolve(resp)
    })
  })
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  const data = await loadSettings()
  syncControls()
  loadVoices()

  // Mostrar info de usuario si hay sesión
  if (data.userEmail) {
    $('auth-section').style.display = 'none'
    $('user-section').style.display = 'block'
    $('user-email').textContent = data.userEmail
    const plan = data.userPlan || 'free'
    const planEl = $('user-plan')
    planEl.textContent = plan.toUpperCase()
    planEl.className = `plan plan-${plan}`
  }

  // Estado actual del content script
  const status = await sendToContent({ type: 'GET_STATUS' })
  if (status) {
    active   = status.active
    platform = status.platform || 'generic'
    highlightPlatform(platform)
    updateToggle()
    setStatus(
      active
        ? `Narrando en ${platform} → ${settings.targetLang.toUpperCase()}`
        : `Listo en ${platform}. Activa los subtítulos CC y presiona Activar.`,
      active ? 'ok' : 'info'
    )
  } else {
    setStatus('Abre un video con subtítulos en inglés (CC)', 'warn')
  }
}

function updateToggle() {
  const btn = $('toggle-btn')
  if (active) {
    btn.textContent = '⏹ Desactivar Narrador'
    btn.className   = 'main-btn on'
  } else {
    btn.textContent = '▶ Activar Narrador'
    btn.className   = 'main-btn off'
  }
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab,.tab-content').forEach(el => el.classList.remove('active'))
    tab.classList.add('active')
    $(`tab-${tab.dataset.tab}`).classList.add('active')
  })
})

// Toggle narrador
$('toggle-btn').addEventListener('click', async () => {
  if (!active) {
    const data = await loadSettings()
    const resp = await sendToContent({
      type:            'ACTIVATE',
      settings,
      userPlan:        data.userPlan || 'free',
      isAuthenticated: !!data.userToken,
    })
    if (resp?.ok) {
      active   = true
      platform = resp.platform || platform
      highlightPlatform(platform)
      setStatus(`Narrando en ${platform} → ${settings.targetLang.toUpperCase()}`, 'ok')
    } else {
      setStatus('No se pudo activar. ¿Estás en un video con subtítulos?', 'warn')
    }
  } else {
    await sendToContent({ type: 'DEACTIVATE' })
    active = false
    setStatus('Narrador desactivado', 'info')
  }
  updateToggle()
})

// Detener narración
$('stop-btn').addEventListener('click', () => sendToContent({ type: 'STOP' }))

// Detectar subtítulo activo
$('test-btn').addEventListener('click', async () => {
  const resp = await sendToContent({ type: 'TEST_SUBTITLE' })
  if (resp?.found) {
    setStatus(`✓ Subtítulo detectado [${resp.platform}]: "${resp.text.slice(0,40)}..."`, 'ok')
  } else {
    setStatus('No se encontraron subtítulos. Activa CC en el video.', 'warn')
  }
})

// Idioma destino
$('lang-select').addEventListener('change', e => {
  settings.targetLang = e.target.value
  saveSettings()
  loadVoices()
  sendToContent({ type: 'UPDATE_SETTINGS', settings })
})

// Overlay toggle
$('overlay-toggle').addEventListener('change', e => {
  settings.showOverlay = e.target.checked
  saveSettings()
  sendToContent({ type: 'UPDATE_SETTINGS', settings })
})

// Sliders de voz
const sliders = {
  speed:  { key:'voiceSpeed',  valId:'speed-val',  fmt: v => parseFloat(v).toFixed(1)+'×' },
  volume: { key:'voiceVolume', valId:'volume-val', fmt: v => Math.round(v*100)+'%' },
  pitch:  { key:'voicePitch',  valId:'pitch-val',  fmt: v => parseFloat(v).toFixed(1) },
}
Object.entries(sliders).forEach(([id, {key, valId, fmt}]) => {
  $(id).addEventListener('input', e => {
    const val = parseFloat(e.target.value)
    settings[key] = val
    $(valId).textContent = fmt(val)
    saveSettings()
    sendToContent({ type: 'UPDATE_SETTINGS', settings })
  })
})

// Selector de voz
$('voice-select').addEventListener('change', e => {
  settings.voiceName = e.target.value || null
  saveSettings()
  sendToContent({ type: 'UPDATE_SETTINGS', settings })
})

// Probar voz
$('test-voice-btn') && $('test-voice-btn').addEventListener('click', () => {
  const voices = speechSynthesis.getVoices()
  const utt    = new SpeechSynthesisUtterance('Hola, soy tu narrador A3B.')
  utt.lang     = settings.targetLang + '-' + settings.targetLang.toUpperCase()
  utt.rate     = settings.voiceSpeed
  utt.volume   = settings.voiceVolume
  if (settings.voiceName) {
    const v = voices.find(v => v.name === settings.voiceName)
    if (v) utt.voice = v
  }
  speechSynthesis.cancel()
  speechSynthesis.speak(utt)
})

// Botón probar voz (ID correcto)
$('test-voice') && $('test-voice').addEventListener('click', () => {
  const utt = new SpeechSynthesisUtterance('Narrador A3B activado en ' + platform)
  utt.lang   = settings.targetLang === 'es' ? 'es-ES' : settings.targetLang
  utt.rate   = settings.voiceSpeed
  utt.volume = settings.voiceVolume
  speechSynthesis.cancel()
  speechSynthesis.speak(utt)
})

// Logout
$('logout-btn') && $('logout-btn').addEventListener('click', () => {
  runtime.storage.local.remove(['userToken','userPlan','userEmail'], () => {
    $('auth-section').style.display = 'block'
    $('user-section').style.display = 'none'
  })
})

// ─── Arrancar ────────────────────────────────────────────────────────────────
init()
