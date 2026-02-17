export type CreateUserPayload = {
  username: string
  email: string
  password: string
  roleId: number
}

export type UpdateUserPayload = {
  username?: string
}

export type AdminSetPasswordPayload = { password: string }