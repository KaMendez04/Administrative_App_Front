import * as React from "react"
import { Outlet, Link, useRouterState } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

export default function Reports() {
  const { location } = useRouterState()
  const pathname = location.pathname

  const isActive = (path: string) => pathname.startsWith(path)

  const tabs = [
    { to: "/budget/reports/income", label: "Ingresos" },
    { to: "/budget/reports/spend", label: "Egresos" },
    { to: "/budget/reports/ProjectionIncome", label: "Proyección de ingresos" },
    { to: "/budget/reports/ProjectionSpends", label: "Proyección de egresos" },
    { to: "/budget/reports/Extraordinary", label: "Extraordinario" },
  ]

  // Menú flotante mobile (mínimo)
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
    <div className="min-h-screen bg-[#f3f8ef]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.05)] ring-1 ring-gray-100 p-6 md:p-10">
          {/* MOBILE: botón + menú flotante (sin tocar el diseño desktop) */}
          <div className="mb-6 md:hidden flex items-center justify-between relative">
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

          {/*DESKTOP: nav EXACTO (solo lo ocultamos en mobile) */}
          <nav className="mb-6 hidden md:flex flex-wrap justify-center gap-6 relative">
            {tabs.map((tab) => {
              const active = isActive(tab.to)
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`relative px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    active
                      ? "text-[#708C3E] font-semibold"
                      : "text-gray-700 hover:text-[#708C3E]"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[3px] w-16 rounded-full bg-[#708C3E]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Menú flotante tipo glass (mobile) */}
          {open && (
            <div className="fixed inset-0 z-[60] md:hidden">
              {/* overlay: cierra al tocar afuera */}
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/25"
              />

              {/* panel flotante */}
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
                    {tabs.map((tab) => {
                      const active = isActive(tab.to)
                      return (
                        <li key={tab.to}>
                          <Link
                            to={tab.to}
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
                            {tab.label}
                            
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Contenedor de subpáginas */}
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
