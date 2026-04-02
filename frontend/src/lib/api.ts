import axios from 'axios'
import { useAuthStore } from './auth-store'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  timeout: 15000,
})

// ── Request: attach token ─────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: auto-refresh on 401 ─────────
let refreshing: Promise<string> | null = null

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original._retry) throw error

    original._retry = true
    const { refreshToken, setAccessToken, logout } = useAuthStore.getState()
    if (!refreshToken) { logout(); throw error }

    try {
      if (!refreshing) {
        refreshing = api
          .post('/api/auth/refresh', { refreshToken })
          .then((r) => {
            setAccessToken(r.data.accessToken)
            return r.data.accessToken
          })
          .finally(() => { refreshing = null })
      }
      const newToken = await refreshing
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch {
      logout()
      window.location.href = '/login'
      throw error
    }
  }
)
