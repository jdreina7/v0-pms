"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Box, useMediaQuery, useTheme as useMuiTheme } from "@mui/material"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { useAuth } from "@/providers/auth-provider"
import LoadingScreen from "../ui/loading-screen"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))

  // Verificar autenticación
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Cerrar sidebar automáticamente en móvil
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return null // La redirección se maneja en el useEffect
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          marginLeft: {
            xs: 0,
            md: sidebarOpen ? "280px" : 0,
          },
          width: {
            xs: "100%",
            md: sidebarOpen ? "calc(100% - 280px)" : "100%",
          },
        }}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            backgroundColor: (theme) => (theme.palette.mode === "light" ? "#f8fafc" : "#111827"),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
