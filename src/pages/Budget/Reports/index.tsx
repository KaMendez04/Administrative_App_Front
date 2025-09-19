import { Outlet, Link, useRouterState } from "@tanstack/react-router";

export default function Reports() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="relative rounded-3xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.05)] ring-1 ring-gray-100 p-6 md:p-10">
          <nav className="mb-6 flex flex-wrap gap-3">
            <Link
              to="/budget/reports/income"
              className={
                isActive("/budget/reports/income")
                  ? "px-3 py-2 rounded-lg bg-[#708C3E] text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-[#F0F2EA] border border-gray-200 text-gray-700"
              }
            >
              Ingresos
            </Link>

            <Link
              to="/budget/reports/spend"
              className={
                isActive("/budget/reports/spend")
                  ? "px-3 py-2 rounded-lg bg-[#708C3E] text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-[#F0F2EA] border border-gray-200 text-gray-700"
              }
            >
              Egresos
            </Link>

            <Link
              to="/budget/reports/ProjectionIncome"
              className={
                isActive("/budget/reports/pincome")
                  ? "px-3 py-2 rounded-lg bg-[#A3853D] text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-[#FAF5E7] border border-gray-200 text-gray-700"
              }
            >
              Proyección de ingresos
            </Link>

            <Link
              to="/budget/reports/ProjectionSpends"
              className={
                isActive("/budget/reports/pspend")
                  ? "px-3 py-2 rounded-lg bg-[#A3853D] text-white shadow-sm"
                  : "px-3 py-2 rounded-lg hover:bg-[#FAF5E7] border border-gray-200 text-gray-700"
              }
            >
              Proyección de egresos
            </Link>
          </nav>

          {/* Contenedor de subpáginas */}
          <div className="border-2 border-gray-100 rounded-xl bg-[#FAF9F5]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
