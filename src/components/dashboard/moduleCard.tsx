import { useNavigate } from "@tanstack/react-router"
import type { ModuleCardProps } from "../../models/PrincipalType"

export function ModuleCard({
  title,
  description,
  subtitle,
  icon: IconComponent,
  route,
  primaryAction,
  isLoading = false,
}: ModuleCardProps) {
  const navigate = useNavigate()

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
      {/* Icono arriba-derecha más pequeño */}
      <div className="absolute top-3 right-3">
        <IconComponent className="h-6 w-6 text-gray-500" />
      </div>

      {/* Contenido compacto */}
      <div className="flex-1 mb-3 pr-3">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        
        {subtitle !== undefined && (
          <div className="text-2xl font-bold text-gray-800">
            {isLoading ? (
              <span className="text-gray-400">...</span>
            ) : (
              subtitle
            )}
          </div>
        )}
      </div>

      {/* Botón compacto */}
      <div className="flex justify-end">
        <button
          className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 shadow-sm"
          onClick={() => navigate({ to: route })}
        >
          {primaryAction}
        </button>
      </div>
    </div>
  )
}