// src/pages/Budget/Reports/IncomeReportPage.tsx
"use client"

import { useMemo, useState } from "react"
import { Search, Download } from "lucide-react"
import type { IncomeReportFilters } from "../../../models/Budget/reports/income"
import { useIncomeReport } from "../../../hooks/Budget/reports/useIncomeReport"
import IncomeTable from "../../../components/Budget/Reports/IncomeTable"
import IncomeTotals from "../../../components/Budget/Reports/IncomeTotals"

const todayISO = new Date().toISOString().slice(0, 10)

export default function IncomeReportPage() {
  const [filters, setFilters] = useState<IncomeReportFilters>({
    start: todayISO,
    end: todayISO,
    departmentId: "",
    incomeTypeId: "",
    incomeSubTypeId: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  // Normaliza tipos para el hook (IDs como number u undefined)
  const cleanFilters = useMemo<IncomeReportFilters>(
    () => ({
      ...filters,
      departmentId: filters.departmentId === "" ? undefined : Number(filters.departmentId),
      incomeTypeId: filters.incomeTypeId === "" ? undefined : Number(filters.incomeTypeId),
      incomeSubTypeId: filters.incomeSubTypeId === "" ? undefined : Number(filters.incomeSubTypeId),
    }),
    [filters]
  )

  const { data, isLoading, refetch, isFetching } = useIncomeReport(cleanFilters)

  // Filtro en cliente para el buscador (departamento/tipo/subtipo)
  const filteredRows = useMemo(() => {
    const rows = data?.rows ?? []
    const q = searchTerm.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const d = r.department?.name?.toLowerCase?.() ?? ""
      const sub = r.incomeSubType?.name?.toLowerCase?.() ?? ""
      const typ = r.incomeType?.name?.toLowerCase?.() ?? ""
      return d.includes(q) || sub.includes(q) || typ.includes(q)
    })
  }, [data?.rows, searchTerm])

  // Exportar CSV (Excel) de las filas filtradas
  const exportToCSV = () => {
    const head = ["Departamentos", "Ingreso", "Tipo de ingreso", "Fecha", "Monto"]
    const lines = filteredRows.map((r) =>
      [
        r.department?.name ?? "",
        r.incomeSubType?.name ?? "",
        r.incomeType?.name ?? "",
        r.date ?? "",
        r.amount ?? 0,
      ].join(",")
    )
    const csv = [head.join(","), ...lines].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte_ingresos_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-sm">
            {/* Search + Export */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  placeholder="Buscar departamentos, ingresos, tipo de ingreso"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 py-3 text-base sm:text-lg rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-green-400 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={exportToCSV}
                className="px-4 sm:px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 bg-white text-gray-700 transition-all text-sm sm:text-base inline-flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar a EXCEL</span>
                <span className="sm:hidden">Excel</span>
              </button>
            </div>

            {/* Panel de filtros (fechas + ids opcionales) */}
            <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Fecha desde</label>
                  <input
                    type="date"
                    value={filters.start ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, start: e.target.value }))}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg py-3 px-3 focus:border-green-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Fecha hasta</label>
                  <input
                    type="date"
                    value={filters.end ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, end: e.target.value }))}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg py-3 px-3 focus:border-green-400 transition-all"
                  />
                </div>
                 <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                <button
                  onClick={() => refetch()}
                  className="rounded-xl bg-[#708C3E] text-white px-5 py-3 shadow hover:opacity-90 transition-all"
                >
                  {isFetching ? "Actualizando…" : "Aplicar filtros"}
                </button>
              </div>

              </div>
            </div>

            {/* Tabla y totales existentes */}
            <div className="border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <IncomeTable rows={filteredRows} loading={isLoading} />
            </div>

            <IncomeTotals totals={data?.totals} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}