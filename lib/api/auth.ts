import axiosInstance from "./axios"

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user?: {
    id: string
    email: string
    name?: string
    role?: {
      id: string
      name: string
    }
  }
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // La ruta correcta según la arquitectura es simplemente /auth
    console.log("Sending login request to /auth")
    const response = await axiosInstance.post("/auth", credentials)
    console.log("Login response:", response.data)

    // Verificar la estructura de la respuesta
    if (!response.data) {
      throw new Error("Empty response from server")
    }

    // Imprimir la estructura completa para depuración
    console.log("Response structure:", JSON.stringify(response.data, null, 2))

    return response.data
  } catch (error) {
    console.error("Login error in API call:", error)
    throw error
  }
}

// Eliminamos la función getUserProfile incorrecta que usaba /auth/profile

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email })
  return response.data
}

export const resetPassword = async (token: string, password: string) => {
  const response = await axiosInstance.post("/auth/reset-password", { token, password })
  return response.data
}
