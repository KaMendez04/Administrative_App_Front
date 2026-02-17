import type { User } from "@/models/LoginType";

export type AppRole = "ADMIN" | "JUNTA";

export function getRoleName(user?: User | null): AppRole | null {
  const name = user?.role?.name;
  if (name === "ADMIN" || name === "JUNTA") return name;
  return null;
}

export function canEdit(user?: User | null) {
  return getRoleName(user) === "ADMIN";
}

export function canViewInternal(user?: User | null) {
  const r = getRoleName(user);
  return r === "ADMIN" || r === "JUNTA";
}

export function canExport(user?: User | null) {
  const r = getRoleName(user);
  return r === "ADMIN" || r === "JUNTA";
}

export function canAccess(user: User | null | undefined, allowedRoles?: AppRole[]) {
  // si no hay user => no ve nada
  const role = getRoleName(user)
  if (!role) return false

  // si el item no define roles => por defecto lo mostramos a cualquier logueado
  if (!allowedRoles || allowedRoles.length === 0) return true

  return allowedRoles.includes(role)
}


export function isAdmin(user: User | null) {
  return getRoleName(user) === "ADMIN"
}

export function isJunta(user: User | null) {
  return getRoleName(user) === "JUNTA"
}
