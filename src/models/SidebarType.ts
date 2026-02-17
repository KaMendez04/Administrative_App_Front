import { Book, Briefcase, DollarSign, FileText, Home, User, Users, Image, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { AppRole } from "@/auth/guards"

export type SidebarItem = {
  title: string
  href: string
  icon: LucideIcon
  roles?: AppRole[] 
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Inicio",
    href: "/Principal",
    icon: Home,
    roles: ["ADMIN", "JUNTA"],
  },
  {
    title: "Voluntariado",
    href: "/volunteers",
    icon: Users,
    roles: ["ADMIN", "JUNTA"],
  },
  {
    title: "Asociados",
    href: "/associates",
    icon: Briefcase,
    roles: ["ADMIN", "JUNTA"],
  },
  {
    title: "Presupuesto",
    href: "/budget",
    icon: DollarSign,
    roles: ["ADMIN", "JUNTA"], 
  },
  {
    title: "Manuales",
    href: "/manuals",
    icon: Book,
    roles: ["ADMIN", "JUNTA"],
  },
  {
    title: "Informativa",
    href: "/edition/principal",
    icon: FileText,
    roles: ["ADMIN"],
  },
  {
    title: "Personal",
    href: "/staff",
    icon: User,
    roles: ["ADMIN", "JUNTA"],
  },
  {
    title: "Media",
    href: "/media",
    icon: Image,
    roles: ["ADMIN", "JUNTA"],
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN", "JUNTA"],
  },
]
