import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";

export default function Reports() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname.startsWith(path);

  const tabs = [
    { to: "/budget/reports/income", label: "Ingresos" },
    { to: "/budget/reports/spend", label: "Egresos" },
    { to: "/budget/reports/ProjectionIncome", label: "Proyección de ingresos" },
    { to: "/budget/reports/ProjectionSpends", label: "Proyección de egresos" },
    { to: "/budget/reports/Extraordinary", label: "Extraordinario" },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.05)] ring-1 ring-gray-100 p-6 md:p-10">
          <nav className="mb-6 flex flex-wrap justify-center gap-6 relative">
            {tabs.map((tab) => {
              const active = isActive(tab.to);
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
              );
            })}
          </nav>

          {/* Contenedor de subpáginas */}
          <div >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}