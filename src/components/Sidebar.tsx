import { useEffect, useMemo, useRef } from "react"
import { ChevronLeft } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { sidebarItems } from "../models/SidebarType"
import { useAuth } from "@/auth/AuthProvider"
import { canAccess } from "@/auth/role"

type Props = {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  isMobile: boolean
}

export function AppSidebar({ isOpen, setIsOpen, isMobile }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const sidebarRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, isMobile, setIsOpen])

  const SidebarLink = ({ href, title, icon: Icon }: any) => {
    const isActive = pathname === href
    return (
      <Link
        to={href}
        onClick={() => isMobile && setIsOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all border
          ${
            isActive
              ? "bg-[#708C3E] text-white border-[#708C3E]"
              : "text-[#4A4A4A] border-transparent hover:border-[#A3853D] hover:bg-[#F7F5F0]"
          }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{title}</span>
      </Link>
    )
  }

  const filteredItems = useMemo(() => {
    return sidebarItems.filter((item: any) => {
      // si un item no define roles => visible para cualquier logueado
      if (!item.roles || item.roles.length === 0) return !!user
      return canAccess(user, item.roles)
    })
  }, [user])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2E321B]/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-[#FAF9F5] text-[#2E321B] flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-center p-6 border-b border-[#DCD6C9]">
          <img
            src="https://res.cloudinary.com/dqaseydi6/image/upload/v1754008574/logo-camara_rmdpur.png"
            alt="Logo Cámara"
            className="w-16 h-16 object-contain mb-2 rounded"
          />
          <h1 className="text-center text-sm font-semibold text-[#708C3E] leading-tight tracking-tight">
            Cámara de Ganaderos
            <br />
            de Hojancha
          </h1>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {filteredItems.map((item: any) => (
            <SidebarLink key={item.title} {...item} />
          ))}
        </nav>

        {/* Botón cerrar */}
        <div className="p-4 border-t border-[#DCD6C9]">
          <button
            onClick={() => setIsOpen(false)}
            className="flex rounded-full gap-2 px-2 py-2 bg-[#708C3E] text-white hover:bg-[#5d741c] transition-all text-sm font-medium shadow"
            aria-label="Cerrar sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
