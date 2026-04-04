'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  plan: 'free' | 'pro' | 'team'
  trialEndsAt?: string | null
  trialExpired?: boolean
  trialDaysLeft?: number | null
  isActive?: boolean
  role: string
  emailVerified?: boolean
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    {
      name: 'a3b-auth',
    }
  )
)
