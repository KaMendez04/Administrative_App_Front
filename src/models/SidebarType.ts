import { Book, Briefcase, DollarSign, FileText, Home, User, Users  } from "lucide-react"
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
    href: "/edition/principal",
    icon: FileText,
  },
  {
    title: "Voluntariado",
    href: "/volunteers",
    icon: Users,
  },
  {
    title: "Asociados",
    href: "/associates",
    icon: Briefcase,
  },
  {
    title: "Presupuesto",
    href: "/budget",
    icon: DollarSign,
  },
  {
    title: "Personal",
    href: "/staff",
    icon: User,
  },
  {
    title: "Manuales",
    href: "/manuals",
    icon: Book,
  },

]
 {/*
    title: "Historial",
    href: "/historial",
    icon: History,*/
  }