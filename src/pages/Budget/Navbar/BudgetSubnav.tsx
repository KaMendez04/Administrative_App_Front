import { Link, useRouterState } from "@tanstack/react-router"
import { motion } from "framer-motion"
import type { NavItem, RoleCode } from "../../../types/roles"
import { getCurrentUser } from "../../../services/auth"

const items: NavItem[] = [
  { to: "/budget", label: "Inicio", exact: true, allowedRoles: ["ADMIN", "JUNTA"] },
  { to: "/budget/pincome", label: "Proyección Ingresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/pexpense", label: "Proyección Egresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/income", label: "Ingresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/expenses", label: "Egresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/extra", label: "Extraordinario", allowedRoles: ["ADMIN"] },
  { to: "/budget/reports", label: "Reportes", allowedRoles: ["ADMIN", "JUNTA"] },
]

export default function BudgetSubnav() {
  const { location } = useRouterState()
  const pathname = location.pathname

  const role = (getCurrentUser()?.role?.name ?? "").toUpperCase() as RoleCode
  const visibleItems = items.filter(item => item.allowedRoles.includes(role))

  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname.startsWith(path)

  return (
<div className="sticky top-16 z-30 w-full bg-[#f3f8ef] from-slate-50/80 to-white/80 backdrop-blur-md border-b border-slate-200/40">
  <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col items-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/5 p-2">
          <ul className="relative flex flex-wrap justify-center gap-1">
            {visibleItems.map((item) => {
              const active = isActive(item.to, item.exact)
              return (
                <li key={item.to} className="relative">
                  <Link
                    to={item.to}
                    className={`relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      active
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="budget-subnav-active"
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
    </div>
  )
}