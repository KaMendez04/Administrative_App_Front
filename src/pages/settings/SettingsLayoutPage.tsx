import * as React from "react"
import { Outlet, Link, useRouterState } from "@tanstack/react-router"
import { Menu, X, User, Users } from "lucide-react"
import { useAuth } from "@/auth/AuthProvider"
import type { AppRole } from "@/auth/role"

type Item = {
  to: string
  label: string
  icon: React.ReactNode
  roles?: AppRole[] 
}

const items: Item[] = [
  { to: "/settings/account", label: "Cuenta", icon: <User className="h-4 w-4" />, roles: ["ADMIN", "JUNTA"] },
  { to: "/settings/users", label: "Usuarios", icon: <Users className="h-4 w-4" />, roles: ["ADMIN"] },
]

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(to + "/")
}

export default function SettingsLayoutPage() {
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
            <h1 className="text-lg font-semibold text-[#2E321B]">Configuración</h1>
            <p className="text-sm text-gray-600">Gestiona tu cuenta y usuarios del sistema.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-[#E6E1D6] bg-white/90 shadow-sm">
              <div className="border-b border-[#E6E1D6] px-6 py-5">
                <h1 className="text-xl font-semibold text-[#2E321B] py-1">Configuración</h1>
                <p className="text-xs text-gray-600">
                  Gestiona tu cuenta y usuarios del sistema.
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

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          />
          <div className="absolute left-3 top-3 w-[280px] rounded-2xl border border-[#E6E1D6] bg-white/95 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E6E1D6] px-4 py-3">
              <div className="font-semibold text-[#2E321B]">Configuración</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/5"
              >
                <X className="h-4 w-4 text-[#2E321B]" />
              </button>
            </div>

            <nav className="p-2">
              {visibleItems.map((it) => {
                const active = isActive(pathname, it.to)
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-[#E6EDC8] text-[#2E321B] border border-[#708C3E]"
                        : "text-[#2E321B]/70 hover:bg-black/5",
                    ].join(" ")}
                  >
                    <span className={active ? "text-[#708C3E]" : "text-[#2E321B]/60"}>
                      {it.icon}
                    </span>
                    {it.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
