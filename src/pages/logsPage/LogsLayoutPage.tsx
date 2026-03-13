import { useAuth } from "@/auth/AuthProvider"
import type { AppRole } from "@/auth/guards"
import { Link, Outlet, useRouterState } from "@tanstack/react-router"
import { Menu, ScrollText, Users } from "lucide-react"
import React from "react"

type Item = {
  to: string
  label: string
  icon: React.ReactNode
  roles?: AppRole[] 
}

const items: Item[] = [
  { to: "/logs/budgetLogs", label: "Presupuesto", icon: <ScrollText className="h-4 w-4" />, roles: ["ADMIN", "JUNTA"] },
  { to: "/logs/usersLog", label: "Usuarios", icon: <Users className="h-4 w-4" />, roles: ["ADMIN"] },
]

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(to + "/")
}

export default function LogsLayoutPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
    const { user } = useAuth() as any
    const [open, setOpen] = React.useState(false)
  
    const visibleItems = items.filter((item) => {
      if (!item.roles) return true
      return item.roles.includes(user?.role.name)
    })
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F9F3]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Top (mobile) */}
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E1D6] bg-white/90"
          >
            <Menu className="h-5 w-5 text-[#2E321B]" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-[#2E321B]">Bitácora</h1>
            <p className="text-sm text-gray-600">Gestiona los cambios realizados en el sistema.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
              <div className="border-b border-[#E6E1D6] px-6 py-5">
                <h1 className="text-xl font-semibold text-[#2E321B] py-1">Bitácora</h1>
                <p className="text-xs text-gray-600">
                  Gestiona los cambios realizados en el sistema.
                </p>
              </div>

              <nav className="p-3">
                <div className="space-y-1">
                  {visibleItems.map((it) => {
                    const active = isActive(pathname, it.to)
                    return (
                      <Link
                        key={it.to}
                        to={it.to}
                        className={[
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                          active
                            ? "bg-[#5A7018]/70 text-[#FAF9F5] ring-1 ring-[#708C3E]/25"
                            : "text-[#2E321B]/75 hover:bg-black/[0.04] hover:text-[#2E321B]",
                        ].join(" ")}
                      >
                        <span className={active ? "text-[#FAF9F5] ring-1 ring-[#708C3E]/15" 
                          : "text-[#2E321B]/55 group-hover:text-[#708C3E]"}>
                          {it.icon}
                        </span>
                        {it.label}
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mx-auto w-full max-w-5xl">
                <Outlet />
            </div>
        </main>
        </div>
      </div>
      </div>
    </div>
  )
}