export type UserRole = {
  id: number
  name: string // "ADMIN" | "JUNTA"
}

export type User = {
  id: number
  username: string
  email: string
  isActive: boolean
  role: UserRole
}
