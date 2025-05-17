"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIntl } from "react-intl"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Group as UsersIcon,
  AdminPanelSettings as RolesIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material"
import { useTheme } from "@/providers/theme-provider"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const intl = useIntl()
  const pathname = usePathname()
  const { mode } = useTheme()

  // Verificar si una ruta está activa
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Menú de navegación - Mostrando solo Users y Roles como se solicitó
  const menuItems = [
    {
      title: "Panel de Control",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "Usuarios",
      path: "/users",
      icon: <UsersIcon />,
    },
    {
      title: "Roles",
      path: "/roles",
      icon: <RolesIcon />,
    },
  ]

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Centrar el logo y título
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            component="img"
            src={
              mode === "dark"
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1w-mlUOjgdOR0QJvweN3KIeqqyq5PIpwW.png"
                : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-2Ba7IEeUrO6FLDs2xaw8VaUNNEN6Gq.png"
            }
            alt="Logo"
            sx={{ height: 40, mr: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            PMS
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <Link href={item.path} passHref style={{ width: "100%", textDecoration: "none", color: "inherit" }}>
              <ListItemButton
                sx={{
                  borderRadius: 1,
                  backgroundColor: isActive(item.path) ? "primary.main" : "transparent",
                  color: isActive(item.path) ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive(item.path) ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? "primary.contrastText" : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          © 2023 PMS
        </Typography>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Sidebar móvil (drawer) */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar escritorio (permanente) */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) => (theme.palette.mode === "light" ? "0px 2px 4px rgba(0, 0, 0, 0.05)" : "none"),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
