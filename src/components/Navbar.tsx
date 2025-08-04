import { Menu, User, X } from "lucide-react"
import React from "react"

export default function Navbar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const toggleSidebar = () => {
    const newState = !isSidebarOpen
    setSidebarOpen(newState)
    setIsSidebarOpen(newState)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#FAF9F5] border-b border-[#DCD6C9] shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Solo botón de hamburguesa (nunca logo o texto) */}
        <button
          onClick={toggleSidebar}
          className="text-[#2E321B] hover:text-[#708C3E] p-2 rounded-md transition"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Dropdown de usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-[#2E321B] hover:text-[#A3853D] transition"
            onClick={toggleDropdown}
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Administrador</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Cambiar Contraseña
                </div>
                <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Cerrar Sesión
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
