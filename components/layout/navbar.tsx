"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  InputBase,
  Divider,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Language as TranslateIcon,
  AccountCircle,
  Settings,
  Logout,
} from "@mui/icons-material"
import { alpha, styled } from "@mui/material/styles"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import { useI18n } from "@/providers/i18n-provider"

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}))

interface NavbarProps {
  onToggleSidebar: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const intl = useIntl()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const { locale, setLocale } = useI18n()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget)
  }

  const handleCloseLangMenu = () => {
    setAnchorElLang(null)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    logout()
  }

  const handleChangeLanguage = (lang: "en" | "es") => {
    setLocale(lang)
    handleCloseLangMenu()
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === "light" ? "#ffffff" : "#1f2937"),
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={onToggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600 }}>
          People Management System
        </Typography>

        <Search sx={{ display: { xs: "none", md: "flex" } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Buscar..." inputProps={{ "aria-label": "search" }} />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Botón de tema */}
          <Tooltip title={mode === "dark" ? "Modo Claro" : "Modo Oscuro"}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Botón de idioma */}
          <Tooltip title="Cambiar Idioma">
            <IconButton color="inherit" onClick={handleOpenLangMenu}>
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElLang}
            open={Boolean(anchorElLang)}
            onClose={handleCloseLangMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleChangeLanguage("en")} selected={locale === "en"}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleChangeLanguage("es")} selected={locale === "es"}>
              Español
            </MenuItem>
          </Menu>

          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Menú de usuario */}
          <Tooltip title="Configuración de cuenta">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
              <Avatar alt={user?.name || "User"} src="/avatar.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="caption" color="primary" fontWeight={500}>
                {user?.role.name}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => router.push("/profile")}>
              <AccountCircle sx={{ mr: 2 }} /> Perfil
            </MenuItem>
            <MenuItem onClick={() => router.push("/settings")}>
              <Settings sx={{ mr: 2 }} /> Configuración
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} /> Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
