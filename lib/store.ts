import { create } from "zustand"
import { persist } from "zustand/middleware"

// Definir tipos para el estado de autenticación
interface User {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (userData: User, token: string) => void
  logout: () => void
}

// Crear store con Zustand
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Store para manejar UI global
interface UIState {
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
