import axiosInstance from "./axios"

export interface User {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  roleId: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  roleId?: string
  isActive?: boolean
}

export const getUsers = async (): Promise<User[]> => {
  try {
    // La ruta correcta según la arquitectura es /users
    const response = await axiosInstance.get("/users")

    // Verificar que la respuesta sea un array
    if (Array.isArray(response.data)) {
      return response.data
    } else {
      console.error("La respuesta de getUsers no es un array:", response.data)
      return []
    }
  } catch (error) {
    console.error("Error en getUsers:", error)
    return []
  }
}

export const getUserById = async (id: string): Promise<User> => {
  // La ruta correcta para obtener un usuario por ID es /users/:id
  const response = await axiosInstance.get(`/users/${id}`)
  return response.data
}

// Función para obtener el perfil del usuario actual
export const getCurrentUser = async (userId: string): Promise<User> => {
  if (!userId) {
    throw new Error("User ID is required to get current user")
  }
  return getUserById(userId)
}

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  // La ruta correcta para crear un usuario es /users
  const response = await axiosInstance.post("/users", userData)
  return response.data
}

export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
  // La ruta correcta para actualizar un usuario es /users/:id
  const response = await axiosInstance.patch(`/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id: string): Promise<void> => {
  // La ruta correcta para eliminar un usuario es /users/:id
  await axiosInstance.delete(`/users/${id}`)
}
