import { useMemo, useState } from "react";
import type { SpendReportNameFilters } from "../../../hooks/Budget/reports/useSpendReport";
import { useSpendReport } from "../../../hooks/Budget/reports/useSpendReport";

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

export default function SpendReportPage() {
  // Inputs (por NOMBRE)
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [deptName, setDeptName] = useState("");
  const [typeName, setTypeName] = useState("");
  const [subTypeName, setSubTypeName] = useState("");

  // Filtros confirmados (disparan el query)
  const [submitted, setSubmitted] = useState<SpendReportNameFilters | null>(null);

  const { data, isFetching } = useSpendReport(submitted);

  const rangeText = useMemo(() => {
    if (!start && !end) return "";
    return `${start || "…"} → ${end || "…"}`;
  }, [start, end]);

  const rows = data?.rows ?? [];
  const totals: any = data?.totals ?? {};

  function apply() {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      departmentName: deptName || undefined,
      spendTypeName: typeName || undefined,
      spendSubTypeName: subTypeName || undefined,
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Reportes — Egresos</h2>

          {/* Filtros (por NOMBRE) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Desde</label>
              <input type="date" value={start} onChange={e=>setStart(e.target.value)}
                     className="w-full rounded-xl border border-gray-200 p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hasta</label>
              <input type="date" value={end} onChange={e=>setEnd(e.target.value)}
                     className="w-full rounded-xl border border-gray-200 p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Departamento (nombre)</label>
              <input placeholder="Opcional" value={deptName} onChange={e=>setDeptName(e.target.value)}
                     className="w-full rounded-xl border border-gray-200 p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo egreso (nombre)</label>
              <input placeholder="Opcional" value={typeName} onChange={e=>setTypeName(e.target.value)}
                     className="w-full rounded-xl border border-gray-200 p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Subtipo egreso (nombre)</label>
              <input placeholder="Opcional" value={subTypeName} onChange={e=>setSubTypeName(e.target.value)}
                     className="w-full rounded-xl border border-gray-200 p-2" />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={apply}
              disabled={isFetching}
              className="rounded-xl bg-[#708C3E] text-white px-4 py-2 hover:opacity-95 disabled:opacity-60"
            >
              {isFetching ? "Cargando..." : "Aplicar filtros"}
            </button>
            {!!rangeText && <span className="text-sm text-gray-500">{rangeText}</span>}
          </div>

          {/* Totales */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="text-sm text-gray-500">Total egresos</div>
              <div className="text-2xl font-semibold">{crc(totals?.total ?? 0)}</div>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="text-sm text-gray-500">Por departamento</div>
              <ul className="text-sm mt-2 space-y-1">
                {(totals?.byDepartment ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{r.department}</span><span className="font-medium">{crc(r.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="text-sm text-gray-500">Por tipo</div>
              <ul className="text-sm mt-2 space-y-1">
                {(totals?.byType ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{r.type}</span><span className="font-medium">{crc(r.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tabla */}
          <div className="mt-10 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 pr-4">Departamento</th>
                  <th className="py-2 pr-4">Tipo de egreso</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4">{r.department}</td>
                    <td className="py-2 pr-4">{r.spendType}</td>
                    <td className="py-2 pr-4">{new Date(r.date).toISOString()}</td>
                    <td className="py-2 pr-4 text-right">{crc(r.amount)}</td>
                  </tr>
                ))}
                {rows.length === 0 && !isFetching && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">Sin resultados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
