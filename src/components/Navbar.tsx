import React from "react"
import { LogOut, Menu, User, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { getCurrentUser, clearSession } from "../auth/auth"
import { showConfirmOutAlert } from "../utils/alerts"
import { NotificationDropdown } from "./Notification/NotificationDropdown"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"

type Props = {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Navbar({ isSidebarOpen, setSidebarOpen }: Props) {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  )

  const navigate = useNavigate()

  const user = getCurrentUser()
  const roleName = user?.role?.name?.toUpperCase()

  const roleLabel =
    roleName === "ADMIN"
      ? "Administrador"
      : roleName === "JUNTA"
        ? "Junta Directiva"
        : "Usuario"

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

  const handleLogout = async () => {
    const confirmed = await showConfirmOutAlert(
      "Confirmar cierre de sesión",
      "¿Está seguro que desea salir?",
    )
    if (confirmed) {
      clearSession()
      navigate({ to: "/login" })
    }
  }

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#DCD6C9] px-4 sm:px-10 py-3 shadow-sm">
      <div
        className={[
          "flex items-center justify-between max-w-7xl mx-auto transition-transform duration-300",
          isSidebarOpen && isDesktop ? "translate-x-64" : "translate-x-0",
        ].join(" ")}
      >
        {/* Botón menú */}
        <button
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-transparent text-[#2E321B] hover:text-[#708C3E] hover:bg-black/[0.03] transition"
          aria-label="Abrir menú"
          type="button"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />

          {/* Dropdown usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2",
                  "bg-white/70",
                  "text-[#2E321B] hover:text-[#8B6C2E] hover:bg-[#FEF6E0] hover:border-[#DCD6C9]",
                  "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF6E0]/25",
                ].join(" ")}
              >
                <User className="w-5 h-5 text-[#8B6C2E] hover:text-[#8B6C2E]" />
                <span className="text-sm font-medium">{roleLabel}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className={[
                "w-56 rounded-md border border-[#E6E1D6] bg-white shadow-xl",
                "p-2",
              ].join(" ")}
            >
              {/* Opcional: encabezado pequeño */}
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-[#2E321B]">Cuenta</p>
                <p className="text-[11px] text-[#2E321B]/60">{roleLabel}</p>
              </div>

              <DropdownMenuSeparator className="my-2 bg-[#E6E1D6]" />

              {/* Configuración */}
              <DropdownMenuItem
                className={[
                  "rounded-xl px-2.5 py-2 cursor-pointer",
                  "focus:bg-[#F3F5EA] focus:text-[#2E321B]",
                ].join(" ")}
                onSelect={() => navigate({ to: "/settings" })}
              >
                <Settings className="w-4 h-4 mr-2 text-[#708C3E]" />
                <span className="text-sm">Configuración</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 bg-[#E6E1D6]" />

              {/* Cerrar sesión */}
              <DropdownMenuItem
                className={[
                  "rounded-xl px-2.5 py-2 cursor-pointer",
                  "focus:bg-red-50 focus:text-red-700",
                ].join(" ")}
                onSelect={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
              >
                <LogOut className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-sm">Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
