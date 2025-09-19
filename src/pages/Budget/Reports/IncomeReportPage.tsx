import { useMemo, useState } from "react";
import type { IncomeReportFilters } from "../../../models/Budget/reports/income";
import { useIncomeReport } from "../../../hooks/Budget/reports/useIncomeReport";
import IncomeTable from "../../../components/Budget/Reports/IncomeTable";
import IncomeTotals from "../../../components/Budget/Reports/IncomeTotals";


const todayISO = new Date().toISOString().slice(0, 10);

export default function IncomeReportPage() {
  const [filters, setFilters] = useState<IncomeReportFilters>({
    start: todayISO,
    end: todayISO,
    departmentId: "",
    incomeTypeId: "",
    incomeSubTypeId: "",
  });

  const cleanFilters = useMemo<IncomeReportFilters>(() => ({
    ...filters,
    departmentId: filters.departmentId === "" ? undefined : Number(filters.departmentId),
    incomeTypeId: filters.incomeTypeId === "" ? undefined : Number(filters.incomeTypeId),
    incomeSubTypeId: filters.incomeSubTypeId === "" ? undefined : Number(filters.incomeSubTypeId),
  }), [filters]);

  const { data, isLoading, refetch, isFetching } = useIncomeReport(cleanFilters);

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-4">Reportes — Ingresos</h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div>
              <label className="text-sm text-gray-600">Desde</label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2"
                value={filters.start ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, start: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Hasta</label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2"
                value={filters.end ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, end: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Departamento (id)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Opcional"
                value={filters.departmentId as any}
                onChange={(e) => setFilters((f) => ({ ...f, departmentId: e.target.value as any }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Tipo ingreso (id)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Opcional"
                value={filters.incomeTypeId as any}
                onChange={(e) => setFilters((f) => ({ ...f, incomeTypeId: e.target.value as any }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Subtipo ingreso (id)</label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Opcional"
                value={filters.incomeSubTypeId as any}
                onChange={(e) => setFilters((f) => ({ ...f, incomeSubTypeId: e.target.value as any }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => refetch()}
              className="rounded-xl bg-[#708C3E] text-white px-4 py-2 shadow hover:opacity-90"
            >
              {isFetching ? "Actualizando…" : "Aplicar filtros"}
            </button>
            <span className="text-sm text-gray-500">
              {cleanFilters.start} → {cleanFilters.end}
            </span>
          </div>

          {/* Tabla */}
          <IncomeTable rows={data?.rows ?? []} loading={isLoading} />

          {/* Totales (bandas) */}
          <IncomeTotals totals={data?.totals} loading={isLoading} />
        </div>
      </div>
    </div>
  );
}
