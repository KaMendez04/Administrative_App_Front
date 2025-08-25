import { useNavigate } from "@tanstack/react-router"
import { JsonPrincipalType } from "../models/PrincipalType"
import { getCurrentUser } from "../services/auth"

export default function Principal() {
  const modules = JsonPrincipalType
  const navigate = useNavigate()

  // Rol actual
  const role = getCurrentUser()?.role?.name?.toUpperCase()
  const isAdmin = role === "ADMIN"

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const IconComponent = module.icon

            // Oculta “Gestión de contenido público” para JUNTA
            if (!isAdmin && typeof module.route === "string" && module.route.startsWith("/edition/principal")) {
              return null
            }

            return (
              <div
                key={index}
                className="relative bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Ícono con badge suave (paleta Cámara) */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF9F5] ring-1 ring-gray-200 shadow-sm flex items-center justify-center">
                    <IconComponent className={`h-7 w-7 ${module.iconColor}`} aria-hidden />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 mb-4 pr-16">
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                  {module.subtitle && (
                    <div className="text-2xl font-bold text-gray-800 mt-2">{module.subtitle}</div>
                  )}
                </div>

                {/* Botón neutro */}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-md text-sm font-medium transition"
                    onClick={() => navigate({ to: module.route as any })}
                    aria-label={module.primaryAction}
                  >
                    {module.primaryAction}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
