import { create } from 'zustand'
// import { authAPI } from '@/lib/api' // TODO: Implement auth API

interface User {
  id: number
  email: string
  tier: string
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual auth API call
      // const data = await authAPI.login(email, password)
      // localStorage.setItem('token', data.access_token)
      // set({ token: data.access_token })
      
      // Mock implementation for now
      console.warn('Auth not implemented yet')
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual auth API call
      // await authAPI.register(email, password)
      
      // Mock implementation for now
      console.warn('Auth not implemented yet')
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isAuthenticated: false })
      return
    }

    try {
      // TODO: Implement actual auth API call
      // const user = await authAPI.getMe()
      // set({ user, token, isAuthenticated: true })
      
      // Mock implementation for now
      set({ isAuthenticated: false })
    } catch (error) {
      localStorage.removeItem('token')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
