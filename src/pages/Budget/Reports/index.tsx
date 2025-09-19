import { Outlet, Link, useRouterState } from "@tanstack/react-router";

export default function Reports() {
  const { location } = useRouterState();
  const isIncome = location.pathname.startsWith("/budget/reports/income");

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <nav className="mb-6 flex gap-3">
            <Link
              to="/budget/reports/income"
              className={
                isIncome
                  ? "px-3 py-2 rounded-lg bg-green-500 text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-green-50 border border-gray-100 text-gray-700"
              }
            >
              Ingresos
            </Link>
            
            {/* futuros tabs */}
             <Link
              to="/budget/reports/spend" //cambiar por egresos cuando esté listo
              className={
                isIncome
                  ? "px-3 py-2 rounded-lg bg-green-500 text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-green-50 border border-gray-100 text-gray-700"
              }
            >
              Egresos
            </Link>
             <Link
              to="/budget/reports/ProjectionIncome" //cambiar por proyeccion de ingresos cuando esté listo
              className={
                isIncome
                  ? "px-3 py-2 rounded-lg bg-green-500 text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-green-50 border border-gray-100 text-gray-700"
              }
            >
              Proyeccion de ingresos
            </Link>

             <Link
              to="/budget/reports/ProjectionSpends" //cambiar por proyeccion de egresos cuando esté listo
              className={
                isIncome
                  ? "px-3 py-2 rounded-lg bg-green-500 text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-green-50 border border-gray-100 text-gray-700"
              }
            >
              Proyeccion de egresos
            </Link>
          </nav>

          {/* Contenedor de subpáginas con el mismo marco blanco */}
          <div className="border-2 border-gray-100 rounded-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}