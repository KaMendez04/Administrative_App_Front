import { Book, Briefcase, DollarSign, FileText, Home, User, Users, History } from "lucide-react"
import type { LucideIcon } from "lucide-react" 

export type SidebarItem = {
  title: string
  href: string
  icon: LucideIcon 
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Informativa",
    href: "/informativa",
    icon: FileText,
  },
  {
    title: "Voluntariado",
    href: "/voluntariado",
    icon: Users,
  },
  {
    title: "Asociados",
    href: "/asociados",
    icon: Briefcase,
  },
  {
    title: "Presupuesto",
    href: "/presupuesto",
    icon: DollarSign,
  },
  {
    title: "Personal",
    href: "/personal",
    icon: User,
  },
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: Users,
  },
  {
    title: "Manuales",
    href: "/manuales",
    icon: Book,
  },
  {
    title: "Historial",
    href: "/historial",
    icon: History,
  },
]
