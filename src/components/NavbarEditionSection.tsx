import { useNavigate, useLocation } from "@tanstack/react-router"

const sections = [
  { label: "Principal", path: "/edition/principal" },
  { label: "Sobre Nosotros", path: "/edition/about" },
  { label: "Servicios", path: "/edition/servicios" },
  { label: "Asociados", path: "/edition/associates" },
  { label: "Voluntarios", path: "/edition/volunteers" },
  { label: "Preguntas", path: "/edition/faq" },
  { label: "Eventos", path: "/edition/events" },
]

export default function NavbarEditionSection() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-12 border-b pb-4">
      {sections.map(({ label, path }) => {
        const isActive = currentPath === path
        return (
          <button
            key={path}
            onClick={() => navigate({ to: path as any })}
            className={`px-4 py-2 border rounded-md text-sm font-medium duration-200 ${
              isActive
                ? "border-[#708C3E] text-[#708C3E] bg-[#F5F7EC] hover:bg-[#EEF4D8]"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
