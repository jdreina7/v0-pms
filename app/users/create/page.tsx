"use client"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { enqueueSnackbar } from "notistack"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PageHeader from "@/components/ui/page-header"
import { createUser } from "@/lib/api/users"
import { getRoles } from "@/lib/api/roles"

// Esquema de validación
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

export default function CreateUserPage() {
  const intl = useIntl()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
    },
  })

  // Consulta para obtener roles
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  })

  // Mutación para crear usuario
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      enqueueSnackbar(intl.formatMessage({ id: "users.createSuccess" }), { variant: "success" })
      router.push("/users")
    },
    onError: (error) => {
      console.error("Error creating user:", error)
      enqueueSnackbar(intl.formatMessage({ id: "users.createError" }), { variant: "error" })
    },
  })

  const onSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate(data)
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={intl.formatMessage({ id: "users.add" })}
        breadcrumbs={[
          {
            label: intl.formatMessage({ id: "users.title" }),
            href: "/users",
          },
          {
            label: intl.formatMessage({ id: "users.add" }),
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
                      label="Password"
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
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={() => router.push("/users")}>
                    {intl.formatMessage({ id: "common.cancel" })}
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={createUserMutation.isPending}>
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
