import { redirect } from '@tanstack/react-router'
import { getCurrentUser } from '../services/auth'

// Bloquea si no hay usuario
export function requireAuth() {
  const user = getCurrentUser()
  if (!user) throw redirect({ to: '/login' })
}

// Bloquea si el rol del usuario NO está en la lista permitida
export function requireRole(roles: string[]) {
  const user = getCurrentUser()
  if (!user) throw redirect({ to: '/login' })
  const role = user.role?.name?.toUpperCase?.()
  const allowed = roles.map(r => r.toUpperCase())
  if (!role || !allowed.includes(role)) {
    throw redirect({ to: '/403' })
  }
}
