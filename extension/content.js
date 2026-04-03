// ─── A3B Content Script v3.1 ─────────────────────────────────────────────────
// Soporta: Coursera, edX, Udemy, Udacity, DataCamp, LinkedIn Learning, YouTube
// Detecta subtítulos → traduce → TTS → guarda historial

const API = 'https://api.a3bhub.cloud'

// ─── Estado ───────────────────────────────────────────────────────────────────
let active          = false
let lastText        = ''
let speaking        = false
let translateCache  = {}
let settings = {
  voiceSpeed: 1, voiceVolume: 1, voicePitch: 1,
  voiceName: null, targetLang: 'es',
  showOverlay: true, translator: 'google',
}
let userPlan        = 'free'
let isAuthenticated = false

// ─── Selectores por plataforma ────────────────────────────────────────────────
const PLATFORMS = {

  coursera: {
    hosts:     ['coursera.org'],
    selectors: [
      '.rc-SubtitleText',
      '[class*="SubtitleText"]',
      '[class*="subtitle-text"]',
      '[class*="subtitles-display"]',
      '.rc-VideoSubtitle',
      '[data-e2e="subtitle-text"]',
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      '.caption-text',
      '[class*="caption"]',
      '[class*="transcript-item-body"]',
      '.rc-TranscriptItem .rc-PhraseText',
    ],
  },

  edx: {
    hosts:     ['edx.org', 'open.edx.org', 'courses.edx.org'],
    selectors: [
      // Video.js (edX open source) — selectores estables
      '.subtitles-menu li.current',
      '.subtitles .current',
      '.subtitles span',
      '.video-caption .subtitles',
      'div.closed-captions',
      'span.subtitle-content',
      '.transcript-list li.current',
      '.transcript-dialog li.current',
      // Nuevas versiones edX (MFE)
      '[class*="Transcript"] p.active',
      '[data-testid="video-caption"]',
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
    ],
  },

  udemy: {
    hosts:     ['udemy.com'],
    selectors: [
      // Udemy React player — data-purpose es el más estable
      '[data-purpose="captions-display"]',
      '[data-purpose="captions-display"] span',
      '[class*="captions--container"]',
      '[class*="CaptionDisplayArea"]',
      '[class*="CaptionDisplay"]',
      // Fallback Video.js
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      // Udemy Legacy
      '.js-caption-element',
      '.vjs-subtitles',
      'div[data-purpose="video-caption"]',
    ],
  },

  udacity: {
    hosts:     ['udacity.com', 'classroom.udacity.com'],
    selectors: [
      // Udacity transcript panel (más confiable que VTT)
      '.ud-transcript-cue--active',
      '[class*="transcript"] .active',
      '[class*="transcript-cue--active"]',
      '.classroom-video__transcript .active',
      '.video-transcript .active',
      // Video.js fallback
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      // Atoms (nano-degrees)
      '.ud-atom-video__transcript p.active',
      '[class*="atom-video"] .transcript-active',
    ],
  },

  datacamp: {
    hosts:     ['datacamp.com', 'campus.datacamp.com'],
    selectors: [
      // DataCamp player — Video.js customizado
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      '[class*="Subtitles"]',
      '[class*="subtitles"]',
      '[data-cy="subtitle-text"]',
      '.dc-subtitle',
      '.exercise-area [class*="subtitle"]',
      // DataCamp transcript panel
      '[class*="Transcript"] .active',
      '.transcript__text--active',
    ],
  },


  codecademy: {
    hosts:     ['codecademy.com', 'www.codecademy.com'],
    selectors: [
      // Brightcove Video Player (hereda de Video.js)
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      '.vjs-text-track-display .vjs-text-track-cue',
      // Brightcove específico
      '[class*="bc-player"] .vjs-text-track-cue',
      '.bc-player .vjs-text-track-cue',
      // Transcript panel
      '[class*="Transcript"] p.active',
      '[class*="transcript"] .active',
      // Subtítulos VTT
      '.vjs-subtitles .vjs-text-track-cue',
      '[class*="caption"]',
    ],
    note: 'Brightcove player. Solo aplica en lecciones con video (cursos Pro).',
  },

  linkedin: {
    hosts:     ['linkedin.com', 'linkedinlearning.com'],
    selectors: [
      '.captions__caption-text',
      '[data-test-caption]',
      '.captions-text-container .active',
      '[class*="caption-text"]',
      '.video-caption-track span',
      '.tl-timed-text-caption',
    ],
  },

  youtube: {
    hosts:     ['youtube.com', 'youtu.be'],
    selectors: [
      '.ytp-caption-segment',
      '.captions-text',
      '.caption-window',
      '[class*="ytp-caption"]',
    ],
  },

  // Generic Video.js — fallback para plataformas desconocidas
  generic: {
    hosts:     [],
    selectors: [
      '.vjs-text-track-cue',
      '.vjs-text-track-cue span',
      '[class*="caption"]',
      '[class*="subtitle"]',
      '[class*="transcript"]',
    ],
  },
}

// ─── Detectar plataforma actual ───────────────────────────────────────────────
function detectPlatform() {
  const host = location.hostname.replace('www.', '')
  for (const [name, config] of Object.entries(PLATFORMS)) {
    if (name === 'generic') continue
    if (config.hosts.some(h => host.includes(h))) {
      return { name, selectors: config.selectors }
    }
  }
  return { name: 'generic', selectors: PLATFORMS.generic.selectors }
}

let CURRENT_PLATFORM = detectPlatform()
console.log(`[A3B] Plataforma detectada: ${CURRENT_PLATFORM.name}`)

// ─── Seleccionar subtítulo activo ─────────────────────────────────────────────
function getSubtitleText() {
  for (const selector of CURRENT_PLATFORM.selectors) {
    try {
      const el = document.querySelector(selector)
      if (el) {
        const text = el.innerText?.trim() || el.textContent?.trim()
        if (text && text.length > 2) return text
      }
    } catch {}
  }
  return null
}

// ─── Traducción ───────────────────────────────────────────────────────────────
async function translate(text) {
  const key = `${settings.targetLang}:${text}`
  if (translateCache[key]) return translateCache[key]

  let translated = null

  // PRO/Team: backend (DeepL o Google con caché persistente)
  if (isAuthenticated && userPlan !== 'free') {
    try {
      const data = await sendToBackground('API_CALL', {
        path: '/api/translate',
        options: {
          method: 'POST',
          body: JSON.stringify({
            text,
            from: 'en',
            to: settings.targetLang,
          }),
        },
      })
      if (data?.translated) translated = data.translated
    } catch {}
  }

  // Fallback: Google Translate público (plan free)
  if (!translated) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${settings.targetLang}&dt=t&q=${encodeURIComponent(text)}`
      const res  = await fetch(url)
      const json = await res.json()
      translated = json[0].map(d => d[0]).join('')
    } catch {
      translated = text
    }
  }

  translateCache[key] = translated
  return translated
}

// ─── TTS ──────────────────────────────────────────────────────────────────────
function speak(text) {
  if (!text || speaking) return

  speechSynthesis.cancel()
  speaking = true

  const utt = new SpeechSynthesisUtterance(text)
  utt.lang   = settings.targetLang === 'es' ? 'es-ES' : settings.targetLang
  utt.rate   = settings.voiceSpeed
  utt.volume = settings.voiceVolume
  utt.pitch  = settings.voicePitch

  if (settings.voiceName) {
    const voices = speechSynthesis.getVoices()
    const voice  = voices.find(v => v.name === settings.voiceName)
    if (voice) utt.voice = voice
  }

  utt.onend   = () => { speaking = false }
  utt.onerror = () => { speaking = false }

  speechSynthesis.speak(utt)
}

// ─── Overlay en pantalla ──────────────────────────────────────────────────────
let overlayEl = null

function showOverlay(original, translated) {
  if (!settings.showOverlay) return

  if (!overlayEl) {
    overlayEl = document.createElement('div')
    overlayEl.id = 'a3b-overlay'
    overlayEl.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.82); color: #fff; padding: 10px 20px;
      border-radius: 8px; font-size: 15px; max-width: 700px; text-align: center;
      z-index: 999999; pointer-events: none; backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.12); font-family: system-ui, sans-serif;
      line-height: 1.5;
    `
    document.body.appendChild(overlayEl)
  }

  overlayEl.innerHTML = `
    <div style="opacity:0.65;font-size:12px;margin-bottom:2px">${original}</div>
    <div style="font-weight:600">${translated}</div>
    <span style="position:absolute;top:6px;right:10px;font-size:10px;opacity:0.5">
      A3B [${CURRENT_PLATFORM.name}]
    </span>
  `
}

function hideOverlay() {
  if (overlayEl) overlayEl.innerHTML = ''
}

// ─── MutationObserver ─────────────────────────────────────────────────────────
let debounceTimer = null

function onSubtitleChange() {
  if (!active) return

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const text = getSubtitleText()
    if (!text || text === lastText) return
    lastText = text

    const translated = await translate(text)
    if (!translated) return

    speak(translated)
    showOverlay(text, translated)

    // Guardar en historial (solo PRO/Team)
    if (isAuthenticated && userPlan !== 'free') {
      sendToBackground('API_CALL', {
        path: '/api/history',
        options: {
          method: 'POST',
          body: JSON.stringify({
            original:   text,
            translated,
            platform:   CURRENT_PLATFORM.name,
            sourceLang: 'en',
            targetLang: settings.targetLang,
            videoUrl:   location.href,
          }),
        },
      }).catch(() => {})
    }
  }, 180)
}

const observer = new MutationObserver(onSubtitleChange)

function startObserver() {
  observer.observe(document.body, {
    childList: true, subtree: true, characterData: true,
  })
}

// ─── Comunicación con background ─────────────────────────────────────────────
function sendToBackground(type, data) {
  return new Promise((resolve, reject) => {
    const runtime = typeof browser !== 'undefined' ? browser : chrome
    runtime.runtime.sendMessage({ type, ...data }, (response) => {
      if (response?.error) reject(response.error)
      else resolve(response)
    })
  })
}

// ─── Mensajes desde popup ─────────────────────────────────────────────────────
const runtime = typeof browser !== 'undefined' ? browser : chrome

runtime.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {

    case 'ACTIVATE':
      active   = true
      settings = { ...settings, ...msg.settings }
      userPlan        = msg.userPlan || 'free'
      isAuthenticated = msg.isAuthenticated || false
      startObserver()
      sendResponse({ ok: true, platform: CURRENT_PLATFORM.name })
      break

    case 'DEACTIVATE':
      active = false
      speaking = false
      speechSynthesis.cancel()
      hideOverlay()
      sendResponse({ ok: true })
      break

    case 'STOP':
      speaking = false
      speechSynthesis.cancel()
      sendResponse({ ok: true })
      break

    case 'UPDATE_SETTINGS':
      settings = { ...settings, ...msg.settings }
      sendResponse({ ok: true })
      break

    case 'GET_STATUS':
      sendResponse({
        active,
        platform: CURRENT_PLATFORM.name,
        userPlan,
        isAuthenticated,
        lastText,
      })
      break

    case 'TEST_SUBTITLE':
      const text = getSubtitleText()
      sendResponse({ found: !!text, text: text || null, platform: CURRENT_PLATFORM.name })
      break
  }
  return true
})

// ─── Init ─────────────────────────────────────────────────────────────────────
console.log(`[A3B v3.1] Cargado en ${CURRENT_PLATFORM.name} | ${location.hostname}`)
