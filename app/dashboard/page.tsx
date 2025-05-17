"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Avatar } from "@mui/material"
import { PeopleAlt as PeopleIcon, AdminPanelSettings as RolesIcon, Business as BusinessIcon } from "@mui/icons-material"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import { useAuth } from "@/providers/auth-provider"
import LoadingScreen from "@/components/ui/loading-screen"

export default function Dashboard() {
  const intl = useIntl()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return null
  }

  const stats = [
    {
      title: "Total Usuarios",
      value: "124",
      icon: <PeopleIcon fontSize="large" color="primary" />,
      color: "#3b82f6",
    },
    {
      title: "Roles",
      value: "8",
      icon: <RolesIcon fontSize="large" color="secondary" />,
      color: "#10b981",
    },
    {
      title: "Departamentos",
      value: "24",
      icon: <BusinessIcon fontSize="large" style={{ color: "#f59e0b" }} />,
      color: "#f59e0b",
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title={`Bienvenido, ${user?.name || "Usuario"}!`} />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: stat.color + "20",
                  color: stat.color,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, height: "100%" }}>
            <CardHeader title="Actividad Reciente" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No hay actividad reciente para mostrar.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, height: "100%" }}>
            <CardHeader title="Acciones Rápidas" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No hay acciones rápidas disponibles.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
