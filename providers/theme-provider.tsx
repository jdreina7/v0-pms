"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeContextType = {
  mode: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Detectar preferencia del sistema
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setMode(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  // Tema inspirado en Fuse React
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#2196f3", // Azul más vibrante como en Fuse React
        light: "#64b5f6",
        dark: "#1976d2",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff4081", // Rosa como en Fuse React
        light: "#ff79b0",
        dark: "#c60055",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212", // Fondo más claro/oscuro
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
      error: {
        main: "#f44336",
      },
      warning: {
        main: "#ff9800",
      },
      info: {
        main: "#2196f3",
      },
      success: {
        main: "#4caf50",
      },
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif", // Fuse React usa Poppins
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 600,
        textTransform: "none", // Fuse React no transforma el texto de los botones
      },
    },
    shape: {
      borderRadius: 8, // Bordes más redondeados como en Fuse React
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)",
            },
          },
          contained: {
            boxShadow: "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: mode === "light" ? "0 2px 8px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.2)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: "none",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: mode === "light" ? "#f5f5f5" : "#333333",
          },
        },
      },
    },
  })

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
