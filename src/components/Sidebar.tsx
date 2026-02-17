import { useEffect, useMemo, useRef } from "react"
import { ChevronLeft } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { sidebarItems } from "../models/SidebarType"
import { useAuth } from "@/auth/AuthProvider"
import { canAccess } from "@/auth/role"
import { Button } from "./ui/button"

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

  // ✅ bloquea scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  function normalizePath(p: string) {
    if (!p) return "/"
    return p !== "/" ? p.replace(/\/+$/, "") : p
  }

  function isActivePath(pathname: string, href: string) {
    const p = normalizePath(pathname)
    const h = normalizePath(href)
    return p === h || p.startsWith(h + "/")
  }

  const filteredItems = useMemo(() => {
    return sidebarItems.filter((item: any) => {
      if (!item.roles || item.roles.length === 0) return !!user
      return canAccess(user, item.roles)
    })
  }, [user])

  // ✅ separa Configuración para mandarlo abajo
  const mainItems = useMemo(
    () => filteredItems.filter((it: any) => it.title !== "Configuración"),
    [filteredItems],
  )
  const configItem = useMemo(
    () => filteredItems.find((it: any) => it.title === "Configuración"),
    [filteredItems],
  )

  const SidebarLink = ({ href, title, icon: Icon, hideDot }: any) => {
    const active = isActivePath(pathname, href)

    return (
      <Link
        to={href}
        onClick={() => isMobile && setIsOpen(false)}
        className={[
          "group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#708C3E]/25",
          active
            ? "bg-[#5A7018]/70 text-[#FAF9F5] ring-1 ring-[#708C3E]/25"
            : "text-[#2E321B]/75 hover:bg-black/[0.04] hover:text-[#2E321B]",
        ].join(" ")}
      >
        <span
          className={[
            "grid h-7 w-7 place-items-center rounded-md transition",
            active
              ? "text-[#FAF9F5] ring-1 ring-[#708C3E]/15"
              : "text-[#2E321B]/55 group-hover:text-[#708C3E]",
          ].join(" ")}
        >
          <Icon className="h-4 w-4 shrink-0" />
        </span>

        <span className="truncate">{title}</span>

        {!hideDot && (
          <span
            className={[
              "ml-auto h-2 w-2 rounded-full transition",
              active ? "bg-[#FAF9F5]" : "bg-transparent group-hover:bg-[#708C3E]/30",
            ].join(" ")}
          />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 z-[90] bg-[#2E321B]/45 backdrop-blur-[2px] transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={[
          "fixed left-0 top-0 z-[100] h-dvh w-64",
          "bg-[#FAF9F5]/96 backdrop-blur-md text-[#2E321B]",
          "border-r border-[#E6E1D6] shadow-2xl",
          "transition-transform duration-300 will-change-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="border-b border-[#E6E1D6] px-4 py-5">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dqaseydi6/image/upload/v1754008574/logo-camara_rmdpur.png"
              alt="Logo Cámara"
              className="h-12 w-12 rounded-md object-contain bg-white/60 ring-1 ring-[#708C3E]/10"
            />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#2E321B] leading-tight">
                Cámara de Ganaderos
              </div>
              <div className="text-[12px] font-medium text-[#708C3E] leading-tight">
                de Hojancha
              </div>
            </div>
          </div>
        </div>

        {/* Links principales (scroll interno, scrollbar oculto) */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
          style={{ scrollbarWidth: "none" }}
        >
          <style>{`
            nav::-webkit-scrollbar { display: none; }
          `}</style>

          {mainItems.map((item: any) => (
            <SidebarLink key={item.title} {...item} />
          ))}
        </nav>

        {configItem && (
          <div className="border-t border-[#E6E1D6] px-3 py-1">
            <SidebarLink {...configItem} hideDot />
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#E6E1D6] p-3">
          <Button
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-[#708C3E] text-white hover:brightness-110 transition"
            aria-label="Cerrar sidebar"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    </>
  )
}
