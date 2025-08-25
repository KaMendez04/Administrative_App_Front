import {
  Globe2,
  Handshake,
  UserRoundCheck,
  PiggyBank,
  UserCog,
  Book,
  type LucideIcon,
} from "lucide-react"

export type PrincipalType = {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  primaryAction: string
  secondaryAction: string
  color: string
  subtitle?: string
  route: string
}

export const JsonPrincipalType: PrincipalType[] = [
  {
    title: "Gestiona contenido visible para el público",
    description: "Editar Sitio Web Público",
    icon: Globe2,                       // más “sólido” que Globe
    iconColor: "text-[#708C3E]",        // verde seco
    primaryAction: "Editar",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/principal",
  },
  {
    title: "Cantidad de Voluntarios",
    description: "Gestión de Voluntarios",
    icon: Handshake,                    // más expresivo para voluntariado
    iconColor: "text-[#A3853D]",        // dorado claro
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/voluntarios",
  },
  {
    title: "Cantidad Asociados",
    subtitle: "20",
    description: "Gestión de Miembros",
    icon: UserRoundCheck,               // variante más “realista” del check
    iconColor: "text-[#475C1D]",        // verde más oscuro
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/asociados",
  },
  {
    title: "Presupuesto Actual",
    subtitle: "$4000",
    description: "Gestión de Presupuesto",
    icon: PiggyBank,                    // más ilustrativo que DollarSign
    iconColor: "text-[#A3853D]",        // dorado claro
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/faq",              // ajusta a tu ruta real si aplica
  },
  {
    title: "Cantidad de Personal",
    description: "Gestión de Personal",
    icon: UserCog,                      // engranaje = gestión
    iconColor: "text-[#708C3E]",        // verde seco
    primaryAction: "Gestión",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/staff",
  },
  {
    title: "Capacitación de Manuales",
    description: "Manuales",
    icon: Book,                         // más clásico que BookOpen
    iconColor: "text-[#475C1D]",        // verde oscuro
    primaryAction: "Visualizar",
    secondaryAction: "Configurar",
    color: "bg-white border-gray-200",
    route: "/edition/manuales",
  },
]
