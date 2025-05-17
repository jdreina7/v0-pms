import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
const API_SEGMENT = process.env.NEXT_PUBLIC_API_URL_SEGMENT || "/api/v1"

const BASE_URL = `${API_URL}${API_SEGMENT}`

console.log("API Base URL:", BASE_URL) // Log para depuración

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    // Mejorar el log para mostrar la URL completa
    const fullUrl = `${config.baseURL}${config.url}`
    console.log(`API Request: ${config.method?.toUpperCase()} ${fullUrl}`)

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        // Verificar si el token ha expirado
        try {
          const decodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token expirado, limpiar y redirigir a login
            localStorage.removeItem("token")
            localStorage.removeItem("userId")
            localStorage.removeItem("userRole")
            window.location.href = "/login"
            return Promise.reject("Token expired")
          }

          config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
          console.error("Error al decodificar el token:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          localStorage.removeItem("userRole")
        }
      }
    }
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => {
    // Mejorar el log para mostrar la URL completa
    const fullUrl = `${response.config.baseURL}${response.config.url}`
    console.log(`API Response: ${response.status} ${fullUrl}`)
    return response
  },
  (error) => {
    if (error.response) {
      // Mejorar el log para mostrar la URL completa
      const fullUrl = `${error.response.config.baseURL}${error.response.config.url}`
      console.error(`API Error: ${error.response.status} ${fullUrl}`)
      console.error("Error data:", error.response.data)

      if (error.response.status === 401) {
        // Error de autenticación
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          localStorage.removeItem("userEmail")
          localStorage.removeItem("userName")
          localStorage.removeItem("userRole")
          localStorage.removeItem("userRoleId")
          window.location.href = "/login"
        }
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("No response received:", error.request)
    } else {
      // Error al configurar la petición
      console.error("Request setup error:", error.message)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
