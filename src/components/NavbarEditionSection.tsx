import { Link, useRouterState } from "@tanstack/react-router"
import { motion } from "framer-motion"

const sections = [
  { to: "/edition/principal", label: "Principal", exact: true },
  { to: "/edition/about", label: "Sobre Nosotros" },
  { to: "/edition/servicios", label: "Servicios" },
  { to: "/edition/associates", label: "Asociados" },
  { to: "/edition/volunteers", label: "Voluntarios" },
  { to: "/edition/faq", label: "Preguntas" },
  { to: "/edition/events", label: "Eventos" },
]

export default function NavbarEditionSection() {
  const { location } = useRouterState()
  const pathname = location.pathname
  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname.startsWith(path)

  return (
    <div
      className="
        sticky top-16 w-full
        z-0                          /* ↓↓↓ MANDADO AL FONDO */
        bg-gradient-to-r from-slate-50/30 to-white/30
        backdrop-blur-sm supports-[backdrop-filter]:bg-white/20 bg-[#f3f8ef]
      "
    >
      <nav className="mx-8px max-w-7xl px-4 py-4 flex flex-col items-center bg-[#f3f8ef] ">
        <div
          className="
            rounded-2xl border border-white/60
            bg-white backdrop-blur-md
            shadow-sm shadow-slate-900/5
            p-2
            mb-5px
          "
        >
          <ul className="relative flex flex-wrap justify-center gap-1">
            {sections.map((item) => {
              const active = isActive(item.to, (item as any).exact)
              return (
                <li key={item.to} className="relative">
                  <Link
                    to={item.to as any}
                    className={`relative inline-flex items-center justify-center
                      px-6 py-2 text-sm font-medium rounded-md
                      transition-all duration-200 ease-out
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                      ${active
                        ? "text-white"
                        : "text-slate-700 hover:text-slate-900 hover:bg-white/30"
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="edition-subnav-active"
                        className="
                          absolute inset-0 rounded-md
                          bg-gradient-to-r from-[#6F8C1F]/90 to-[#475C1D]/90
                          shadow
                        "
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
