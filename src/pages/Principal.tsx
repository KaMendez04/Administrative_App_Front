import { useNavigate } from "@tanstack/react-router"
import { JsonPrincipalType } from "../models/PrincipalType"

export default function Principal() {
  const modules = JsonPrincipalType
    const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <div
                key={index}
                className="relative bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full shadow-sm"
              >
                {/* Icon in top-right corner */}
                <div className="absolute top-4 right-4">
                  <IconComponent className="h-5 w-5 text-gray-500" />
                </div>

                {/* Module Content */}
                <div className="flex-1 mb-4 pr-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{module.title}</h3>
                  <p className="text-base text-gray-700 mb-2">{module.description}</p>
                  {module.subtitle && <div className="text-2xl font-bold text-gray-800">{module.subtitle}</div>}
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6">
                  {" "}
                  {/* Adjusted to justify-end for single button alignment */}
                   <button
                    className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white px-6 py-2 rounded-md text-sm font-medium duration-200 shadow-md"
                    onClick={() => navigate({ to: module.route as any })}
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
