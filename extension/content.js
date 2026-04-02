// ─── A3B Content Script v3.0 ─────────────
// Detecta subtítulos → traduce (backend/google) → TTS → guarda historial

const API = 'https://api.a3bhub.cloud'

// ─── Estado ───────────────────────────────
let active = false
let lastText = ''
let speaking = false
let settings = {
  voiceSpeed: 1, voiceVolume: 1, voicePitch: 1,
  voiceName: null, targetLang: 'es',
  showOverlay: true, translator: 'google',
}
let userPlan = 'free'
let isAuthenticated = false
let translateCache = {}

// ─── Selectores por plataforma ────────────
const SELECTORS = {
  coursera: [
    '.rc-SubtitleText', '[class*="SubtitleText"]', '[class*="subtitle-text"]',
    '[class*="subtitles-display"]', '.rc-VideoSubtitle', '[data-e2e="subtitle-text"]',
    '.vjs-text-track-cue', '.vjs-text-track-cue span', '.caption-text',
    '[class*="caption"]', '[class*="transcript-item-body"]',
    '.rc-TranscriptItem .rc-PhraseText',
  ],
  youtube: [
    '.ytp-caption-segment', '.captions-text', '.caption-window',
  ],
  udemy: [
    '[class*="captions--container"]', '[class*="CaptionDisplayArea"]',
  ],
  edx: ['.subtitles-menu li.current', '.subtitles span'],
  linkedin: ['.captions__caption-text', '[data-test-caption]'],
}

function getSelectors() {
  const host = location.hostname
  if (host.includes('coursera'))  return SELECTORS.coursera
  if (host.includes('youtube'))   return SELECTORS.youtube
  if (host.includes('udemy'))     return SELECTORS.udemy
  if (host.includes('edx'))       return SELECTORS.edx
  if (host.includes('linkedin'))  return SELECTORS.linkedin
  return SELECTORS.coursera
}

// ─── Traducción ───────────────────────────
async function translate(text) {
  const key = `${settings.targetLang}:${text}`
  if (translateCache[key]) return translateCache[key]

  let translated

  if (isAuthenticated && userPlan !== 'free') {
    // PRO/Team: backend (DeepL o Google con cache)
    try {
      const data = await sendToBackground('API_CALL', {
        path: '/api/translate',
        options: {
          method: 'POST',
          body: JSON.stringify({ text, source: 'en', target: settings.targetLang }),
        },
      })
      if (data?.translated) {
        translated = data.translated
      }
    } catch {}
  }

  if (!translated) {
    // Fallback: Google Translate público
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${settings.targetLang}&dt=t&q=${encodeURIComponent(text)}`
      const res = await fetch(url)
      const json = await res.json()
      translated = json[0].map((d) => d[0]).join('')
    } catch {
      translated = text
    }
  }

  translateCache[key] = translated

  // Guardar en historial si está autenticado y es PRO+
  if (isAuthenticated && (userPlan === 'pro' || userPlan === 'team')) {
    saveHistory(text, translated).catch(() => {})
  }

  return translated
}

// ─── Guardar historial ────────────────────
async function saveHistory(originalText, translatedText) {
  const platform = location.hostname.includes('coursera') ? 'coursera'
    : location.hostname.includes('youtube') ? 'youtube'
    : location.hostname.includes('udemy') ? 'udemy'
    : location.hostname.includes('edx') ? 'edx'
    : location.hostname.includes('linkedin') ? 'linkedin' : 'coursera'

  await sendToBackground('API_CALL', {
    path: '/api/history',
    options: {
      method: 'POST',
      body: JSON.stringify({
        originalText, translatedText,
        sourceLang: 'en', targetLang: settings.targetLang,
        platform, courseUrl: location.href,
      }),
    },
  })
}

// ─── TTS ──────────────────────────────────
function speak(text) {
  if (!text || speaking) return
  speechSynthesis.cancel()

  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = settings.targetLang
  utt.rate = settings.voiceSpeed
  utt.volume = settings.voiceVolume
  utt.pitch = settings.voicePitch

  if (settings.voiceName) {
    const v = speechSynthesis.getVoices().find(v => v.name === settings.voiceName)
    if (v) utt.voice = v
  }

  utt.onstart = () => { speaking = true }
  utt.onend = () => { speaking = false }
  utt.onerror = () => { speaking = false }

  speechSynthesis.speak(utt)
}

// ─── Overlay en pantalla ──────────────────
let overlayEl = null

function createOverlay() {
  if (overlayEl) return
  overlayEl = document.createElement('div')
  overlayEl.id = 'a3b-overlay'
  overlayEl.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    max-width: 680px; width: 90%; z-index: 2147483647;
    background: rgba(10,10,20,0.92); backdrop-filter: blur(12px);
    border: 1px solid rgba(99,102,241,0.3); border-radius: 14px;
    padding: 14px 18px; pointer-events: none;
    font-family: system-ui, sans-serif; transition: opacity 0.3s;
  `
  document.body.appendChild(overlayEl)
}

function updateOverlay(original, translated) {
  if (!settings.showOverlay) {
    if (overlayEl) overlayEl.style.opacity = '0'
    return
  }
  createOverlay()
  overlayEl.innerHTML = `
    <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-bottom:5px;font-family:monospace;letter-spacing:0.05em;">
      🔊 A3B Narrator · EN → ${settings.targetLang.toUpperCase()}
    </div>
    <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:6px;line-height:1.4;">${original}</div>
    <div style="font-size:16px;color:#ffffff;font-weight:600;line-height:1.4;">${translated}</div>
  `
  overlayEl.style.opacity = '1'
}

function hideOverlay() {
  if (overlayEl) overlayEl.style.opacity = '0'
}

// ─── Procesamiento de subtítulo ───────────
let debounceTimer = null

async function processSubtitle(text) {
  text = text.trim()
  if (!text || text === lastText || text.length < 3) return
  lastText = text

  const translated = await translate(text)
  speak(translated)
  updateOverlay(text, translated)
}

// ─── MutationObserver ─────────────────────
let observer = null

function startObserver() {
  if (observer) return
  const selectors = getSelectors()

  observer = new MutationObserver(() => {
    if (!active) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      for (const sel of selectors) {
        const el = document.querySelector(sel)
        if (el?.textContent?.trim()) {
          processSubtitle(el.textContent)
          break
        }
      }
    }, 180)
  })

  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
}

function stopObserver() {
  observer?.disconnect()
  observer = null
  speechSynthesis.cancel()
  hideOverlay()
  speaking = false
  lastText = ''
}

// ─── Helper: mensaje al background ────────
function sendToBackground(type, payload = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, ...payload }, resolve)
  })
}

// ─── Cargar configuración y auth ──────────
async function loadConfig() {
  const stored = await chrome.storage.local.get([
    'active', 'settings', 'user', 'accessToken'
  ])

  if (stored.settings) settings = { ...settings, ...stored.settings }
  if (stored.user) {
    isAuthenticated = true
    userPlan = stored.user.plan ?? 'free'
  }
  if (stored.active) {
    active = true
    startObserver()
  }
}

// ─── Message handler desde popup ──────────
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  switch (msg.type) {
    case 'TOGGLE':
      active = msg.value
      chrome.storage.local.set({ active })
      if (active) startObserver()
      else stopObserver()
      reply({ ok: true })
      break

    case 'STOP':
      speechSynthesis.cancel()
      hideOverlay()
      speaking = false
      reply({ ok: true })
      break

    case 'UPDATE_SETTINGS':
      settings = { ...settings, ...msg.settings }
      chrome.storage.local.set({ settings })
      reply({ ok: true })
      break

    case 'GET_STATUS':
      reply({ active, speaking, plan: userPlan, isAuthenticated })
      break

    case 'TEST_VOICE':
      speak(msg.text ?? `Hola, esta es una prueba de A3B Narrator en ${settings.targetLang}`)
      reply({ ok: true })
      break

    case 'AUTH_UPDATED':
      isAuthenticated = !!msg.user
      userPlan = msg.user?.plan ?? 'free'
      reply({ ok: true })
      break
  }
  return true
})

// ─── Init ─────────────────────────────────
loadConfig()
console.log('🔊 A3B Content Script v3.0 loaded')
