import {
  Globe,
  Users,
  FolderOpen,
  UserCheck,
  DollarSign,
  type LucideIcon,
} from "lucide-react"

export type PrincipalType = {
  title: string
  description: string
  icon: LucideIcon
  primaryAction: string
  secondaryAction: string
  color: string
  subtitle?: string
  route: string // ← agregado para navegación
}

export const JsonPrincipalType: PrincipalType[] = [
  {
    title: "Gestiona contenido visible para el público",
    description: "Editar Sitio Web Público",
    icon: Globe,
    primaryAction: "Editar",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/principal",
  },
  {
    title: "Cantidad de Voluntarios",
    description: "Gestión de Voluntarios",
    icon: Users,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/voluntarios",
  },
  {
    title: "Cantidad de Proyectos",
    description: "Gestión de Proyectos",
    icon: FolderOpen,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/servicios", // si quieres cambiar a 'proyectos', también debes cambiar el path en router
  },
  {
    title: "Cantidad Asociados",
    subtitle: "20",
    description: "Gestión de Miembros",
    icon: UserCheck,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/asociados",
  },
  {
    title: "Presupuesto Actual",
    subtitle: "$4000",
    description: "Gestión de Presupuesto",
    icon: DollarSign,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/faq", // ejemplo si usas esa página como presupuestos, si no, crea la ruta real
  },
  {
    title: "Cantidad de Personal",
    description: "Gestión de Personal",
    icon: Users,
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/staff",
  },
]

