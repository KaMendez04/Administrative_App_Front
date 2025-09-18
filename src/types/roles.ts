export type RoleCode = "ADMIN" | "JUNTA"

export type NavItem = {
    to: string
    label: string
    exact?: boolean
    allowedRoles: RoleCode[] // <- control de visibilidad
}