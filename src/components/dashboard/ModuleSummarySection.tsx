import { Globe, Users, UserCheck, DollarSign } from "lucide-react"
import { getCurrentUser } from "../../services/auth"
import { useModuleCounts } from "../../hooks/dashboard/useModuleCounts"
import { crc } from "../../utils/crcDateUtil"
import { ModuleCard } from "./moduleCard"
import type { FiscalYear } from "../../hooks/Budget/useFiscalYear"

interface ModuleSummarySectionProps {
  currentBalance?: number
  fiscalYear?: FiscalYear
}

export function ModuleSummarySection({ currentBalance = 0, fiscalYear }: ModuleSummarySectionProps) {
  const role = getCurrentUser()?.role?.name?.toUpperCase()
  const isAdmin = role === "ADMIN"

  // Obtener los contadores
  const counts = useModuleCounts()

  const modules = [
    // Solo mostrar para ADMIN
    ...(isAdmin
      ? [
          {
            title: "Contenido Público",
            description: "Editar Sitio Web",
            icon: Globe,
            primaryAction: "Editar",
            route: "/edition/principal",
          },
        ]
      : []),
    {
      title: "Personal Activo",
      description: "Gestión de Personal",
      subtitle: counts.personal.count,
      icon: Users,
      primaryAction: "Gestión",
      route: "/staff",
      isLoading: counts.personal.isLoading,
    },
    {
      title: "Asociados",
      description: "Gestión de Miembros",
      subtitle: counts.associates.count,
      icon: UserCheck,
      primaryAction: "Gestión",
      route: "/associates",
      isLoading: counts.associates.isLoading,
    },
    {
      title: "Voluntarios",
      description: "Gestión de Voluntarios",
      subtitle: counts.volunteers.count,
      icon: Users,
      primaryAction: "Gestión",
      route: "/volunteers",
      isLoading: counts.volunteers.isLoading,
    },
    {
      title: fiscalYear ? `Presupuesto ${fiscalYear.year}` : "Presupuesto",
      description: "Balance Actual",
      subtitle: crc(currentBalance),
      icon: DollarSign,
      primaryAction: "Gestión",
      route: "/budget",
    },
  ]

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {modules.map((module, index) => (
          <ModuleCard key={index} {...module} />
        ))}
      </div>
    </div>
  )
}
