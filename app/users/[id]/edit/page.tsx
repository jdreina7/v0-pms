"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { enqueueSnackbar } from "notistack"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import LoadingScreen from "@/components/ui/loading-screen"
import { getUserById, updateUser } from "@/lib/api/users"
import { getRoles } from "@/lib/api/roles"

// Esquema de validación
const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  isActive: z.boolean(),
})

type UpdateUserFormData = z.infer<typeof updateUserSchema>

export default function EditUserPage({ params }: { params: { id: string } }) {
  const intl = useIntl()
  const router = useRouter()
  const queryClient = useQueryClient()
  const userId = params.id

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
      isActive: true,
    },
  })

  // Consulta para obtener el usuario
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  })

  // Consulta para obtener roles
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  })

  // Actualizar formulario cuando se carga el usuario
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        roleId: user.role.id,
        isActive: user.isActive,
      })
    }
  }, [user, reset])

  // Mutación para actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserFormData) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
      enqueueSnackbar(intl.formatMessage({ id: "users.updateSuccess" }), { variant: "success" })
      router.push("/users")
    },
    onError: (error) => {
      console.error("Error updating user:", error)
      enqueueSnackbar(intl.formatMessage({ id: "users.updateError" }), { variant: "error" })
    },
  })

  const onSubmit = (data: UpdateUserFormData) => {
    // Si la contraseña está vacía, la eliminamos para no actualizarla
    if (!data.password) {
      const { password, ...restData } = data
      updateUserMutation.mutate(restData as UpdateUserFormData)
    } else {
      updateUserMutation.mutate(data)
    }
  }

  if (isLoadingUser) {
    return <LoadingScreen />
  }

  if (userError) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <p>Error loading user: {String(userError)}</p>
          <Button variant="contained" onClick={() => router.push("/users")}>
            {intl.formatMessage({ id: "common.back" })}
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={intl.formatMessage({ id: "users.edit" })}
        breadcrumbs={[
          {
            label: intl.formatMessage({ id: "users.title" }),
            href: "/users",
          },
          {
            label: intl.formatMessage({ id: "users.edit" }),
          },
        ]}
      />

      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={intl.formatMessage({ id: "users.name" })}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={intl.formatMessage({ id: "users.email" })}
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Password (leave empty to keep current)"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.roleId}>
                      <InputLabel id="role-select-label">{intl.formatMessage({ id: "users.role" })}</InputLabel>
                      <Select {...field} labelId="role-select-label" label={intl.formatMessage({ id: "users.role" })}>
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.roleId && <FormHelperText>{errors.roleId.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                      label={intl.formatMessage({ id: "users.active" })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={() => router.push("/users")}>
                    {intl.formatMessage({ id: "common.cancel" })}
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={updateUserMutation.isPending}>
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
