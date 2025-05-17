"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import { useMutation } from "@tanstack/react-query"
import { useSnackbar } from "notistack"
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { login } from "@/lib/api/auth"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"

export default function LoginPage() {
  const intl = useIntl()
  const router = useRouter()
  const auth = useAuth()
  const { mode } = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login success:", data) // Log para depuración

      // Verificar que tenemos un token de acceso
      if (!data.access_token) {
        setError("Invalid response from server: missing access token")
        return
      }

      try {
        // Crear un objeto de usuario con valores predeterminados si faltan datos
        const userData = {
          id: data.user?.id || "unknown",
          email: data.user?.email || credentials.email,
          name: data.user?.name || credentials.email.split("@")[0], // Usar parte del email como nombre si falta
          role: {
            id: data.user?.role?.id || "unknown",
            name: data.user?.role?.name || "user",
          },
        }

        // Guardar datos del usuario y token
        auth.login(data.access_token, userData)

        enqueueSnackbar("Login successful", { variant: "success" })
        router.push("/dashboard")
      } catch (err) {
        console.error("Error processing login response:", err)
        setError("Error processing login response")
      }
    },
    onError: (error: any) => {
      console.error("Login error details:", error) // Log detallado del error

      let errorMessage = "Login failed"

      if (error.response) {
        console.error("Error response:", error.response.status, error.response.data)
        errorMessage = error.response.data?.message || "Authentication failed"
      } else if (error.request) {
        console.error("Error request:", error.request)
        errorMessage = "No response from server. Please check your connection."
      } else {
        console.error("Error message:", error.message)
        errorMessage = error.message || "An unexpected error occurred"
      }

      setError(errorMessage)
      enqueueSnackbar(errorMessage, { variant: "error" })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    // Limpiar mensaje de error al cambiar los datos
    if (error) setError(null)
  }

  // Función de submit modificada para garantizar que no recargue la página
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault()

    console.log("Submitting login to: /auth") // Log específico para la URL de login
    console.log("Credentials:", { ...credentials, password: "***" }) // Log para depuración (sin mostrar la contraseña real)

    // Verificar que tenemos credenciales antes de enviar
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required")
      return
    }

    // Usar la mutación para hacer el login
    loginMutation.mutate(credentials)
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => (theme.palette.mode === "light" ? "#f8fafc" : "#111827"),
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "90%",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box
            component="img"
            src={mode === "dark" ? "/images/logo1w.png" : "/images/logo1.png"}
            alt="Logo"
            sx={{ height: 60, mb: 2 }}
          />
          <Typography variant="h5" component="h1" fontWeight="bold" textAlign="center">
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
            PMS - People Management System
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulario con onSubmit correctamente tipado y manejado */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
            disabled={loginMutation.isPending}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            disabled={loginMutation.isPending}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loginMutation.isPending}
              />
            }
            label="Recordarme"
          />

          {/* Botón de tipo submit dentro del formulario */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              <Button variant="text" size="small">
                ¿Olvidaste tu contraseña?
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
