"use client"

import { useState } from "react"
import { useIntl } from "react-intl"
import { useQuery } from "@tanstack/react-query"
import { Button, IconButton, Tooltip } from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import DataTable from "@/components/ui/data-table"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { getRoles, deleteRole } from "@/lib/api/roles"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { enqueueSnackbar } from "notistack"
import { format } from "date-fns"

export default function RolesPage() {
  const intl = useIntl()
  const router = useRouter()
  const { hasPermission } = useAuth()
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)

  // Consulta para obtener roles
  const {
    data: rolesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  })

  // Asegurarse de que roles siempre sea un array
  const roles = Array.isArray(rolesData) ? rolesData : []

  // Mutación para eliminar rol
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      enqueueSnackbar(intl.formatMessage({ id: "roles.deleteSuccess" }), { variant: "success" })
    },
    onError: () => {
      enqueueSnackbar(intl.formatMessage({ id: "roles.deleteError" }), { variant: "error" })
    },
  })

  const handleDeleteClick = (id: string) => {
    setRoleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete)
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const columns = [
    {
      id: "name",
      label: intl.formatMessage({ id: "roles.name" }),
      render: (row: any) => row.name,
    },
    {
      id: "description",
      label: intl.formatMessage({ id: "roles.description" }),
      render: (row: any) => row.description,
    },
    {
      id: "createdAt",
      label: intl.formatMessage({ id: "roles.createdAt" }),
      render: (row: any) => {
        try {
          return format(new Date(row.createdAt), "dd/MM/yyyy")
        } catch (e) {
          return "N/A"
        }
      },
    },
    {
      id: "actions",
      label: intl.formatMessage({ id: "common.actions" }),
      align: "right" as const,
      render: (row: any) => (
        <>
          <Tooltip title={intl.formatMessage({ id: "common.edit" })}>
            <IconButton
              size="small"
              onClick={() => router.push(`/roles/${row.id}/edit`)}
              disabled={!hasPermission(["superadmin"])}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "common.delete" })}>
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
        title={intl.formatMessage({ id: "roles.management" })}
        breadcrumbs={[{ label: intl.formatMessage({ id: "roles.title" }) }]}
        action={
          hasPermission(["superadmin"]) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push("/roles/create")}>
              {intl.formatMessage({ id: "roles.add" })}
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={roles}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        error={error ? String(error) : null}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title={intl.formatMessage({ id: "roles.delete" })}
        message={intl.formatMessage({ id: "roles.deleteConfirm" })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteMutation.isPending}
      />
    </DashboardLayout>
  )
}
