"use client"

import { useState } from "react"
import { useIntl } from "react-intl"
import { useQuery } from "@tanstack/react-query"
import { Button, Chip, IconButton, Tooltip } from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import DataTable from "@/components/ui/data-table"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { getUsers, deleteUser } from "@/lib/api/users"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { enqueueSnackbar } from "notistack"

export default function UsersPage() {
  const intl = useIntl()
  const router = useRouter()
  const { hasPermission } = useAuth()
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // Consulta para obtener usuarios
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  // Asegurarse de que users siempre sea un array
  const users = Array.isArray(usersData) ? usersData : []

  // Mutación para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      enqueueSnackbar("Usuario eliminado con éxito", { variant: "success" })
    },
    onError: () => {
      enqueueSnackbar("Error al eliminar el usuario", { variant: "error" })
    },
  })

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      render: (row: any) => row.name,
    },
    {
      id: "email",
      label: "Email",
      render: (row: any) => row.email,
    },
    {
      id: "role",
      label: "Rol",
      render: (row: any) => (
        <Chip
          label={row.role?.name || "N/A"}
          color={row.role?.name === "superadmin" ? "error" : row.role?.name === "admin" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    {
      id: "status",
      label: "Estado",
      render: (row: any) => (
        <Chip label={row.isActive ? "Activo" : "Inactivo"} color={row.isActive ? "success" : "default"} size="small" />
      ),
    },
    {
      id: "actions",
      label: "Acciones",
      align: "right" as const,
      render: (row: any) => (
        <>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => router.push(`/users/${row.id}/edit`)}
              disabled={!hasPermission(["superadmin", "admin"])}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(row.id)}
              disabled={!hasPermission(["superadmin"])}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Gestión de Usuarios"
        breadcrumbs={[{ label: "Usuarios" }]}
        action={
          hasPermission(["superadmin", "admin"]) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push("/users/create")}>
              Nuevo Usuario
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ? String(error) : null}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteMutation.isPending}
      />
    </DashboardLayout>
  )
}
