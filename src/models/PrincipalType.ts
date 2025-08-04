import { Globe, Users, FolderOpen, UserCheck, DollarSign, type LucideIcon } from "lucide-react"

export type PrincipalType = {
  title: string
  description: string
  icon: LucideIcon
  primaryAction: string
  secondaryAction: string
  color: string
  subtitle?: string
}

export const JsonPrincipalType: PrincipalType[] = [
  {
    title: "Gestiona contenido visible para el público",
    description: "Editar Sitio Web Público",
    icon: Globe,
    primaryAction: "Editar",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
  },
  {
    title: "Cantidad de Voluntarios",
    description: "Gestión de Voluntarios",
    icon: Users,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
  },
  {
    title: "Cantidad de Proyectos",
    description: "Gestión de Proyectos",
    icon: FolderOpen,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
  },
  {
    title: "Cantidad Asociados",
    subtitle: "20",
    description: "Gestión de Miembros",
    icon: UserCheck,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
  },
  {
    title: "Presupuesto Actual",
    subtitle: "$4000",
    description: "Gestión de Presupuesto",
    icon: DollarSign,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
  },
  {
    title: "Cantidad de Personal",
    description: "Gestión de Personal",
    icon: Users,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
  },
]
