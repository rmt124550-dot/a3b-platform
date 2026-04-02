// ─── A3B Background Service Worker v3.0 ──
const API = 'https://api.a3bhub.cloud'

// ─── Token refresh automático ─────────────
async function refreshAccessToken() {
  const { refreshToken } = await chrome.storage.local.get('refreshToken')
  if (!refreshToken) return null

  try {
    const res = await fetch(`${API}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) {
      await chrome.storage.local.remove(['accessToken', 'refreshToken', 'user'])
      return null
    }
    const data = await res.json()
    await chrome.storage.local.set({ accessToken: data.accessToken })
    return data.accessToken
  } catch {
    return null
  }
}

// ─── API call con auto-refresh ────────────
async function apiCall(path, options = {}) {
  let { accessToken } = await chrome.storage.local.get('accessToken')

  const doFetch = (token) =>
    fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

  let res = await doFetch(accessToken)

  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (!newToken) return { error: 'unauthenticated' }
    res = await doFetch(newToken)
  }

  if (!res.ok) return { error: `HTTP ${res.status}` }
  return res.json()
}

// ─── Message handler ──────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === 'API_CALL') {
    apiCall(msg.path, msg.options)
      .then(reply)
      .catch((e) => reply({ error: e.message }))
    return true // async
  }

  if (msg.type === 'GET_AUTH') {
    chrome.storage.local.get(['user', 'accessToken']).then(reply)
    return true
  }

  if (msg.type === 'LOGOUT') {
    chrome.storage.local.remove(['accessToken', 'refreshToken', 'user']).then(() => reply({ ok: true }))
    return true
  }
})

// ─── Alarm: renovar token cada 10 min ────
chrome.alarms.create('refreshToken', { periodInMinutes: 10 })
chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === 'refreshToken') refreshAccessToken()
})

console.log('🔊 A3B Background v3.0 ready')
