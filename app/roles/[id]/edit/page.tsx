"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { enqueueSnackbar } from "notistack"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import LoadingScreen from "@/components/ui/loading-screen"
import { getRoleById, updateRole } from "@/lib/api/roles"

// Esquema de validación
const updateRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
})

type UpdateRoleFormData = z.infer<typeof updateRoleSchema>

export default function EditRolePage({ params }: { params: { id: string } }) {
  const intl = useIntl()
  const router = useRouter()
  const queryClient = useQueryClient()
  const roleId = params.id

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Consulta para obtener el rol
  const {
    data: role,
    isLoading: isLoadingRole,
    error: roleError,
  } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRoleById(roleId),
  })

  // Actualizar formulario cuando se carga el rol
  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description,
      })
    }
  }, [role, reset])

  // Mutación para actualizar rol
  const updateRoleMutation = useMutation({
    mutationFn: (data: UpdateRoleFormData) => updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["role", roleId] })
      enqueueSnackbar(intl.formatMessage({ id: "roles.updateSuccess" }), { variant: "success" })
      router.push("/roles")
    },
    onError: (error) => {
      console.error("Error updating role:", error)
      enqueueSnackbar(intl.formatMessage({ id: "roles.updateError" }), { variant: "error" })
    },
  })

  const onSubmit = (data: UpdateRoleFormData) => {
    updateRoleMutation.mutate(data)
  }

  if (isLoadingRole) {
    return <LoadingScreen />
  }

  if (roleError) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <p>Error loading role: {String(roleError)}</p>
          <Button variant="contained" onClick={() => router.push("/roles")}>
            {intl.formatMessage({ id: "common.back" })}
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={intl.formatMessage({ id: "roles.edit" })}
        breadcrumbs={[
          {
            label: intl.formatMessage({ id: "roles.title" }),
            href: "/roles",
          },
          {
            label: intl.formatMessage({ id: "roles.edit" }),
          },
        ]}
      />

      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={intl.formatMessage({ id: "roles.name" })}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={intl.formatMessage({ id: "roles.description" })}
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={() => router.push("/roles")}>
                    {intl.formatMessage({ id: "common.cancel" })}
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={updateRoleMutation.isPending}>
                    {intl.formatMessage({ id: "common.save" })}
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
