import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens, LoginPayload, RegisterPayload } from '@/types'
import { api, ApiError } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  clearError: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<AuthTokens>('/auth/login', payload)
          const { token, user } = response
          localStorage.setItem('elibrary_token', token)
          set({ user, token, isLoading: false })
        } catch (err) {
          const message = err instanceof ApiError
            ? err.message
            : 'Login failed. Please try again.'
          set({ error: message, isLoading: false })
          throw err
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<AuthTokens>('/auth/register', payload)
          const { token, user } = response
          localStorage.setItem('elibrary_token', token)
          set({ user, token, isLoading: false })
        } catch (err) {
          const message = err instanceof ApiError
            ? err.message
            : 'Registration failed. Please try again.'
          set({ error: message, isLoading: false })
          throw err
        }
      },

      logout: () => {
        localStorage.removeItem('elibrary_token')
        set({ user: null, token: null })
      },

      clearError: () => set({ error: null }),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'elibrary-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)