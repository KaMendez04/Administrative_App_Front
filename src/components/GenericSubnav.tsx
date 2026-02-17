import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

import { getCurrentUser } from "../auth/auth"
import type { RoleCode } from "../types/roles"

export type NavItem = {
  to: string
  label: string
  exact?: boolean
  allowedRoles?: RoleCode[]
}

type GenericSubnavProps = {
  items: NavItem[]
  layoutId: string
}

export function GenericSubnav({ items, layoutId }: GenericSubnavProps) {
  const { location } = useRouterState()
  const pathname = location.pathname

  const role = (getCurrentUser()?.role?.name ?? "").toUpperCase() as RoleCode

  const visibleItems = items.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(role),
  )

  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname.startsWith(path)

  const [open, setOpen] = React.useState(false)
  const btnRef = React.useRef<HTMLButtonElement | null>(null)
  const [pos, setPos] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 16,
  })

  const updatePosition = React.useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      top: Math.round(r.bottom + 10),
      left: Math.round(r.left),
    })
  }, [])

  React.useEffect(() => {
    if (!open) return
    updatePosition()
    const onResize = () => updatePosition()
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onResize, true)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onResize, true)
    }
  }, [open, updatePosition])

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div className="sticky top-16 z-20 w-full bg-transparent border-none md:bg-[#f3f8ef] md:backdrop-blur-md md:border-b md:border-slate-200/40">
      {/* MOBILE: botón */}
      <div className="md:hidden mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          className="inline-flex items-center justify-center rounded-xl p-2 hover:bg-black/5 transition"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <span className="w-10" />
      </div>

      {/* DESKTOP */}
      <nav className="hidden md:flex mx-auto max-w-7xl px-4 py-4 flex-col items-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-2">
          <ul className="relative flex flex-wrap justify-center gap-1">
            {visibleItems.map((item) => {
              const active = isActive(item.to, item.exact)
              return (
                <li key={item.to} className="relative">
                  <Link
                    to={item.to}
                    className={`relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#EAEFE0] ${
                      active
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId={layoutId}
                        className="absolute inset-0 rounded-md bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] shadow-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* MENÚ FLOTANTE (mobile) */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/25"
          />

          <div className="absolute" style={{ top: pos.top, left: pos.left }}>
            <div
              className="
                w-[280px]
                rounded-2xl
                border border-white/25
                bg-white/80
                backdrop-blur-xl
                shadow-2xl
                p-3
                ring-1 ring-gray-100
              "
            >
              <div className="flex items-center justify-end pb-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="rounded-xl p-2 hover:bg-black/5 transition"
                >
                  <X className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {visibleItems.map((item) => {
                  const active = isActive(item.to, item.exact)
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={`
                          relative block rounded-xl px-3 py-2 text-sm font-medium transition-colors
                          ${
                            active
                              ? "text-[#708C3E] font-semibold"
                              : "text-gray-700 hover:text-[#708C3E]"
                          }
                          hover:bg-black/5
                        `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
