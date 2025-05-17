"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/lib/api/users" // Importamos la función correcta

type User = {
  id: string
  email: string
  name: string
  role: {
    id: string
    name: string
  }
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  hasPermission: (requiredRole: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar token al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUserId = localStorage.getItem("userId")
    const storedUserRole = localStorage.getItem("userRole")

    if (storedToken && storedUserId) {
      try {
        // Verificar si el token ha expirado
        const decodedToken = jwtDecode(storedToken)
        const currentTime = Date.now() / 1000

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expirado
          handleLogout()
        } else {
          // Token válido
          setToken(storedToken)

          // Intentar reconstruir datos básicos del usuario desde localStorage
          // Esto es temporal hasta que se cargue el perfil completo
          const roleName = localStorage.getItem("userRole") || "user"
          const roleId = localStorage.getItem("userRoleId") || "unknown"
          const userName = localStorage.getItem("userName") || "User"
          const userEmail = localStorage.getItem("userEmail") || "user@example.com"

          setUser({
            id: storedUserId,
            name: userName,
            email: userEmail,
            role: {
              id: roleId,
              name: roleName,
            },
          })
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error)
        handleLogout()
      }
    } else {
      setIsLoading(false)
      // Redirigir a login si no es una ruta pública y no estamos ya en login
      if (!PUBLIC_ROUTES.includes(pathname) && pathname !== "/" && pathname !== "/login") {
        router.push("/login")
      }
    }
  }, [pathname, router])

  // Obtener perfil de usuario cuando hay token
  const { data: profile } = useQuery({
    queryKey: ["userProfile", localStorage.getItem("userId")],
    queryFn: () => {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        throw new Error("No user ID found in localStorage")
      }
      return getCurrentUser(userId)
    },
    enabled: !!token && !!localStorage.getItem("userId") && !PUBLIC_ROUTES.includes(pathname), // No cargar perfil en rutas públicas
    onSuccess: (data) => {
      if (data) {
        setUser(data)

        // Guardar datos del usuario en localStorage
        localStorage.setItem("userId", data.id)
        localStorage.setItem("userName", data.name)
        localStorage.setItem("userEmail", data.email)
        localStorage.setItem("userRole", data.role?.name || "user")
        localStorage.setItem("userRoleId", data.role?.id || "unknown")
      }
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Error fetching user profile:", error)
      // No cerrar sesión automáticamente en caso de error de perfil
      // para evitar ciclos de redirección
      setIsLoading(false)
    },
  })

  const handleLogin = (newToken: string, userData: User) => {
    // Validar que tenemos los datos mínimos necesarios
    if (!userData || !userData.id || !userData.email) {
      console.error("Invalid user data for login:", userData)
      return
    }

    localStorage.setItem("token", newToken)
    localStorage.setItem("userId", userData.id)
    localStorage.setItem("userName", userData.name || userData.email.split("@")[0])
    localStorage.setItem("userEmail", userData.email)
    localStorage.setItem("userRole", userData.role?.name || "user")
    localStorage.setItem("userRoleId", userData.role?.id || "unknown")

    setToken(newToken)
    setUser(userData)
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userRoleId")

    setToken(null)
    setUser(null)
    setIsLoading(false)

    // Solo redirigir si no estamos ya en una ruta pública
    if (!PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login")
    }
  }

  const hasPermission = (requiredRoles: string[]) => {
    if (!user) return false
    return requiredRoles.includes(user.role?.name || "")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
