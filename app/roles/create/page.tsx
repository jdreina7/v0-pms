"use client"

import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { enqueueSnackbar } from "notistack"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import { createRole } from "@/lib/api/roles"

// Esquema de validación
const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
})

type CreateRoleFormData = z.infer<typeof createRoleSchema>

export default function CreateRolePage() {
  const intl = useIntl()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Mutación para crear rol
  const createRoleMutation = useMutation({
    mutationFn: (data: CreateRoleFormData) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      enqueueSnackbar(intl.formatMessage({ id: "roles.createSuccess" }), { variant: "success" })
      router.push("/roles")
    },
    onError: (error) => {
      console.error("Error creating role:", error)
      enqueueSnackbar(intl.formatMessage({ id: "roles.createError" }), { variant: "error" })
    },
  })

  const onSubmit = (data: CreateRoleFormData) => {
    createRoleMutation.mutate(data)
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={intl.formatMessage({ id: "roles.add" })}
        breadcrumbs={[
          {
            label: intl.formatMessage({ id: "roles.title" }),
            href: "/roles",
          },
          {
            label: intl.formatMessage({ id: "roles.add" }),
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
                  <LoadingButton type="submit" variant="contained" loading={createRoleMutation.isPending}>
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
