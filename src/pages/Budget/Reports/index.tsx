import { Outlet, Link, useRouterState } from '@tanstack/react-router';

export default function Reports() {
  const { location } = useRouterState();
  const isIncome = location.pathname.startsWith('/budget/reports/income');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      <nav className="mb-6 flex gap-2">
        <Link
          to="/budget/reports/income"
          className={
            isIncome
              ? 'px-3 py-2 rounded-lg bg-[#708C3E] text-white'
              : 'px-3 py-2 rounded-lg hover:bg-gray-100'
          }
        >
          Ingresos
        </Link>
        {/* aquí podrás agregar más tabs */}
      </nav>

      <Outlet />
    </div>
  );
}
