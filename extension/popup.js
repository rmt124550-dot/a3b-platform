// ─── A3B Popup v3.0 ──────────────────────
const API = 'https://api.a3bhub.cloud'

let user = null
let settings = {
  voiceSpeed: 1, voiceVolume: 1, voicePitch: 1,
  voiceName: null, targetLang: 'es',
  showOverlay: true, translator: 'google',
}
let isActive = false

// ─── Init ─────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadState()
  renderAuth()
  renderAccount()
  setupTabs()
  setupControls()
  loadVoices()
  applySettings()
  updateToggleUI()
})

// ─── Load state from storage ──────────────
async function loadState() {
  const data = await chrome.storage.local.get(['user', 'settings', 'active', 'accessToken'])
  user = data.user ?? null
  if (data.settings) settings = { ...settings, ...data.settings }
  isActive = data.active ?? false
}

// ─── Render auth section in Narrator tab ──
function renderAuth() {
  const el = document.getElementById('authSection')
  const badge = document.getElementById('planBadge')

  if (user) {
    const initial = (user.name?.[0] ?? user.email[0]).toUpperCase()
    el.className = 'auth-section logged-in'
    el.innerHTML = `
      <div class="user-row">
        <div class="avatar">${initial}</div>
        <div class="user-info">
          <div class="user-name">${user.name ?? 'Usuario'}</div>
          <div class="user-email">${user.email}</div>
        </div>
        <button class="btn-logout" id="logoutBtn">Salir</button>
      </div>
    `
    document.getElementById('logoutBtn').addEventListener('click', logout)
    badge.textContent = user.plan.toUpperCase()
    badge.className = `plan-badge plan-${user.plan}`
  } else {
    el.className = 'auth-section'
    el.innerHTML = `
      <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;">
        Inicia sesión para guardar historial y usar DeepL
      </div>
      <div class="login-form" id="loginForm">
        <div>
          <label>Email</label>
          <input type="email" id="emailInput" placeholder="tu@email.com" autocomplete="email">
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" id="passInput" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button class="btn-primary" id="loginBtn" style="margin-bottom:0">Iniciar sesión</button>
        <div style="text-align:center;margin-top:4px">
          <a href="https://a3bhub.cloud/register" target="_blank"
            style="font-size:11px;color:#6366f1;text-decoration:none;">
            Crear cuenta gratis →
          </a>
        </div>
      </div>
    `
    document.getElementById('loginBtn').addEventListener('click', login)
    document.getElementById('passInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') login()
    })
  }
}

// ─── Render account tab ───────────────────
function renderAccount() {
  const el = document.getElementById('accountContent')
  if (!user) {
    el.innerHTML = `
      <div style="text-align:center;padding:24px 0;">
        <div style="font-size:24px;margin-bottom:8px;opacity:0.2">◈</div>
        <p style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:16px;">
          Inicia sesión para gestionar tu cuenta
        </p>
        <a href="https://a3bhub.cloud/login" target="_blank">
          <button class="btn-primary" style="width:auto;padding:8px 20px">Iniciar sesión →</button>
        </a>
      </div>
    `
    return
  }

  const planFeatures = {
    free:  ['Google TTS', 'EN → ES', 'Coursera'],
    pro:   ['DeepL', '10 idiomas', 'Historial 30d', 'Diccionario'],
    team:  ['Todo PRO', 'API', 'SRT Export', 'Admin'],
  }
  const features = planFeatures[user.plan] ?? planFeatures.free

  el.innerHTML = `
    <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:14px;margin-bottom:12px;">
      <div style="font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.06em;font-weight:700;margin-bottom:8px;">Plan actual</div>
      <div style="font-size:22px;font-weight:800;margin-bottom:8px;text-transform:capitalize;">${user.plan}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">
        ${features.map(f => `<span style="font-size:10px;background:rgba(52,211,153,0.12);color:#6ee7b7;padding:2px 7px;border-radius:5px;">✓ ${f}</span>`).join('')}
      </div>
    </div>
    ${user.plan === 'free' ? `
      <a href="https://a3bhub.cloud/pricing" target="_blank">
        <button class="btn-primary">Actualizar a PRO — $4.99/mes →</button>
      </a>
    ` : `
      <a href="https://a3bhub.cloud/dashboard/billing" target="_blank">
        <button class="btn-ghost">Gestionar suscripción</button>
      </a>
    `}
    <a href="https://a3bhub.cloud/dashboard" target="_blank">
      <button class="btn-ghost" style="margin-bottom:0">Abrir dashboard →</button>
    </a>
  `
}

// ─── Login ────────────────────────────────
async function login() {
  const email = document.getElementById('emailInput').value.trim()
  const pass  = document.getElementById('passInput').value
  const btn   = document.getElementById('loginBtn')
  if (!email || !pass) return

  btn.disabled = true
  btn.innerHTML = '<span class="spinner"></span>'

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    })
    if (!res.ok) {
      const err = await res.json()
      showError(err.error ?? 'Credenciales incorrectas')
      return
    }
    const data = await res.json()
    user = data.user

    await chrome.storage.local.set({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })

    // Notify content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'AUTH_UPDATED', user: data.user }).catch(() => {})
    }

    renderAuth()
    renderAccount()
    showSuccess('¡Sesión iniciada!')
  } catch {
    showError('Error de conexión')
  } finally {
    btn.disabled = false
    btn.textContent = 'Iniciar sesión'
  }
}

// ─── Logout ───────────────────────────────
async function logout() {
  const { accessToken, refreshToken } = await chrome.storage.local.get(['accessToken', 'refreshToken'])

  if (accessToken) {
    fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {})
  }

  await chrome.storage.local.remove(['user', 'accessToken', 'refreshToken'])
  user = null

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'AUTH_UPDATED', user: null }).catch(() => {})
  }

  renderAuth()
  renderAccount()
}

// ─── Toggle narrator ──────────────────────
async function toggleNarrator() {
  isActive = !isActive
  await chrome.storage.local.set({ active: isActive })

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE', value: isActive }).catch(() => {})
  }
  updateToggleUI()
}

function updateToggleUI() {
  const btn  = document.getElementById('toggleBtn')
  const dot  = document.getElementById('statusDot')
  const lbl  = document.getElementById('statusLabel')
  const sub  = document.getElementById('statusSub')
  const stop = document.getElementById('stopBtn')

  btn.className = isActive ? 'toggle-switch on' : 'toggle-switch'
  dot.className = isActive ? 'status-dot active' : 'status-dot'
  lbl.textContent = isActive ? 'Narrador activo' : 'Narrador desactivado'
  sub.textContent = isActive ? 'Escuchando subtítulos en tiempo real...' : 'Activa los subtítulos CC en el video'
  stop.style.display = isActive ? 'block' : 'none'
}

// ─── Setup tabs ───────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'))
      tab.classList.add('active')
      document.getElementById(`pane-${tab.dataset.tab}`).classList.add('active')
    })
  })
}

// ─── Setup controls ───────────────────────
function setupControls() {
  document.getElementById('toggleBtn').addEventListener('click', toggleNarrator)

  document.getElementById('stopBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: 'STOP' }).catch(() => {})
  })

  // Sliders
  const sliders = [
    { id: 'speed',  key: 'voiceSpeed',  valId: 'speedVal',  fmt: v => `${parseFloat(v).toFixed(1)}×` },
    { id: 'volume', key: 'voiceVolume', valId: 'volumeVal', fmt: v => `${Math.round(v * 100)}%` },
    { id: 'pitch',  key: 'voicePitch',  valId: 'pitchVal',  fmt: v => parseFloat(v).toFixed(1) },
  ]
  sliders.forEach(({ id, key, valId, fmt }) => {
    const el = document.getElementById(id)
    el.addEventListener('input', () => {
      settings[key] = parseFloat(el.value)
      document.getElementById(valId).textContent = fmt(el.value)
    })
  })

  // Language selector — gate for free users
  const langSelect = document.getElementById('langSelect')
  const langGate   = document.getElementById('langGate')
  langSelect.addEventListener('change', () => {
    if (!user || user.plan === 'free') {
      langSelect.value = 'es'
      langGate.style.display = 'block'
      return
    }
    langGate.style.display = 'none'
    settings.targetLang = langSelect.value
  })

  document.getElementById('testVoiceBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'TEST_VOICE' }).catch(() => {})
    }
  })

  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings)
}

// ─── Load voices ──────────────────────────
function loadVoices() {
  const sel = document.getElementById('voiceSelect')
  const populate = () => {
    const voices = speechSynthesis.getVoices()
    sel.innerHTML = '<option value="">Automática</option>'
    voices
      .filter(v => v.lang.startsWith(settings.targetLang))
      .forEach(v => {
        const opt = document.createElement('option')
        opt.value = v.name
        opt.textContent = `${v.name} (${v.lang})`
        if (v.name === settings.voiceName) opt.selected = true
        sel.appendChild(opt)
      })
  }
  populate()
  speechSynthesis.addEventListener('voiceschanged', populate)
  sel.addEventListener('change', () => { settings.voiceName = sel.value || null })
}

// ─── Apply settings to UI ─────────────────
function applySettings() {
  document.getElementById('speed').value  = settings.voiceSpeed
  document.getElementById('volume').value = settings.voiceVolume
  document.getElementById('pitch').value  = settings.voicePitch
  document.getElementById('speedVal').textContent  = `${settings.voiceSpeed.toFixed(1)}×`
  document.getElementById('volumeVal').textContent = `${Math.round(settings.voiceVolume * 100)}%`
  document.getElementById('pitchVal').textContent  = settings.voicePitch.toFixed(1)
  document.getElementById('langSelect').value = settings.targetLang
}

// ─── Save settings ────────────────────────
async function saveSettings() {
  await chrome.storage.local.set({ settings })

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_SETTINGS', settings }).catch(() => {})
  }

  // Sync con backend si está autenticado
  if (user) {
    const { accessToken } = await chrome.storage.local.get('accessToken')
    if (accessToken) {
      fetch(`${API}/api/user/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          voiceSpeed: settings.voiceSpeed,
          voiceVolume: settings.voiceVolume,
          voicePitch: settings.voicePitch,
          voiceName: settings.voiceName,
          targetLang: settings.targetLang,
        }),
      }).catch(() => {})
    }
  }

  showSuccess('Ajustes guardados')
}

// ─── Feedback ─────────────────────────────
function showSuccess(msg) { flash(msg, '#34d399') }
function showError(msg)   { flash(msg, '#f87171') }

function flash(msg, color) {
  const el = document.createElement('div')
  el.textContent = msg
  el.style.cssText = `
    position: fixed; bottom: 44px; left: 50%; transform: translateX(-50%);
    background: ${color}22; border: 1px solid ${color}44;
    color: ${color}; font-size: 12px; font-weight: 600;
    padding: 6px 14px; border-radius: 8px; z-index: 999;
    white-space: nowrap; animation: fadeUp 0.3s ease;
  `
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 2500)
}
