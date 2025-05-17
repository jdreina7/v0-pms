import axiosInstance from "./axios"

export interface Role {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CreateRoleDto {
  name: string
  description: string
}

export interface UpdateRoleDto {
  name?: string
  description?: string
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    // La ruta correcta según la arquitectura es /roles
    const response = await axiosInstance.get("/roles")

    // Verificar que la respuesta sea un array
    if (Array.isArray(response.data)) {
      return response.data
    } else {
      console.error("La respuesta de getRoles no es un array:", response.data)
      return []
    }
  } catch (error) {
    console.error("Error en getRoles:", error)
    return []
  }
}

export const getRoleById = async (id: string): Promise<Role> => {
  // La ruta correcta para obtener un rol por ID es /roles/:id
  const response = await axiosInstance.get(`/roles/${id}`)
  return response.data
}

export const createRole = async (roleData: CreateRoleDto): Promise<Role> => {
  // La ruta correcta para crear un rol es /roles
  const response = await axiosInstance.post("/roles", roleData)
  return response.data
}

export const updateRole = async (id: string, roleData: UpdateRoleDto): Promise<Role> => {
  // La ruta correcta para actualizar un rol es /roles/:id
  const response = await axiosInstance.patch(`/roles/${id}`, roleData)
  return response.data
}

export const deleteRole = async (id: string): Promise<void> => {
  // La ruta correcta para eliminar un rol es /roles/:id
  await axiosInstance.delete(`/roles/${id}`)
}
