import { ChevronLeft } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { sidebarItems } from "../models/SidebarType"

export function AppSidebar({ isOpen, setIsOpen, isMobile }: any) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const SidebarLink = ({ href, title, icon: Icon }: any) => {
    const isActive = pathname === href
    return (
      <Link
        to={href}
        onClick={() => isMobile && setIsOpen(false)}
        className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-[#708C3E] text-[#FAF9F5] shadow"
            : "text-[#2E321B] hover:bg-[#FAF9F5] hover:text-[#2E321B]"
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{title}</span>
      </Link>
    )
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-[#A3853D] text-white flex flex-col shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#FAF9F5]/40">
        <span className="text-lg font-semibold text-[#2E321B]">Menú</span>
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {sidebarItems.map((item) => (
          <SidebarLink key={item.title} {...item} />
        ))}
      </nav>

      {/* Botón circular para cerrar - SIEMPRE visible */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 -right-5 z-50 w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#2E321B] text-[#2E321B] hover:bg-[#708C3E] hover:text-white shadow-lg flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  )
}
