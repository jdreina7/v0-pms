"use client"

import type React from "react"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material"
import { Menu as MenuIcon, Dashboard, People, Settings, Logout } from "@mui/icons-material"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles"
import Link from "next/link"

const drawerWidth = 240

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#10b981",
    },
  },
})

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Usuarios", icon: <People />, path: "/usuarios" },
    { text: "Configuración", icon: <Settings />, path: "/configuracion" },
  ]

  return (
    <MuiThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mi Aplicación
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {menuItems.map((item) => (
                <Link href={item.path} key={item.text} passHref>
                  <ListItem button component="a" onClick={handleDrawerToggle}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              ))}
              <ListItem button>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </MuiThemeProvider>
  )
}
