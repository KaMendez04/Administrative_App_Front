import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useIncomeReport,
  useIncomeReportFilters,
  useIncomeSubTypes,
  useIncomeTypes,
} from "../../../hooks/Budget/reports/usePIncomeReport";
import {
  downloadIncomeReportPDF,
  previewIncomeReportPDF,
  downloadIncomeCompareExcel,
} from "../../../services/Budget/reportPIncome/incomeReportService";
import { listDepartments } from "../../../services/Budget/projectionIncomeService";

// util: convierte cualquier cosa en array razonable
type AnyObj = Record<string, unknown>;
function ensureArray<T = any>(x: unknown): T[] {
  if (Array.isArray(x)) return x as T[];
  if (x && typeof x === "object") {
    const o = x as AnyObj;
    if (Array.isArray(o.data)) return o.data as T[];
    if (Array.isArray(o.items)) return o.items as T[];
    const vals = Object.values(o);
    if (vals.length && vals.every((v) => v && typeof v === "object")) return vals as T[];
  }
  return [];
}

// Formateo CRC
const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(
    Number.isFinite(n) ? n : 0
  );

export default function PIncomeProjectionsPage() {
  // ------- filtros -------
  const {
    filters,
    start,
    end,
    departmentId,
    incomeTypeId,
    setStart,
    setEnd,
    setDepartmentId,
    setIncomeTypeId,
    setIncomeSubTypeId,
  } = useIncomeReportFilters();

  // ⚠️ Forzamos la carga de departamentos con clave única y refetch en mount
  const { data: departmentsData = [] } = useQuery({
    queryKey: ["pIncomeDepartments"],           // clave única (no colisiona con otros)
    queryFn: listDepartments,                   // misma función de servicio
    refetchOnMount: "always",                   // que llame cuando entres a la página
    staleTime: 0,                               // sin cache “fresco”
  });
  const departments = ensureArray<any>(departmentsData);

  // tipos/subtipos (sí dependen del dept / tipo)
  const { data: incomeTypesData = [] } = useIncomeTypes(departmentId);
  const { data: incomeSubTypesData = [] } = useIncomeSubTypes(incomeTypeId);
  const incomeTypes = ensureArray<any>(incomeTypesData);

  // reporte
  const reportQuery = useIncomeReport(filters);
  const rows = ensureArray<any>(reportQuery.data?.rows);
  const totals =
    reportQuery.data?.totals ?? { real: 0, projected: 0, difference: 0 };

  // ------- UI: placeholder dd/mm/aaaa en inputs date -------
  const [forceTextStart, setForceTextStart] = useState(!start);
  const [forceTextEnd, setForceTextEnd] = useState(!end);

  // ------- acciones -------
  const apply = () => reportQuery.refetch();
  const clear = () => {
    setStart(undefined);
    setEnd(undefined);
    setDepartmentId(undefined);
    setIncomeTypeId(undefined);
    setIncomeSubTypeId(undefined);
  };

  const handlePreviewPDF = () => previewIncomeReportPDF(filters);
  const handleDownloadPDF = () => downloadIncomeReportPDF(filters);
  const handleExcelComparativo = () => downloadIncomeCompareExcel(filters);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white p-6 md:p-10">
          {/* Tarjetas superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="rounded-2xl bg-[#F8F9F3] p-6 ring-1 ring-[#EAEFE0]">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
                Total ingresos (Proyectado)
              </div>
              <div className="mt-2 text-3xl font-bold text-[#5B732E]">
                {crc(totals.projected)}
              </div>
            </div>

            <div className="rounded-2xl bg-[#EAEFE0] p-6 ring-1 ring-[#EAEFE0]">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
                Total real
              </div>
              <div className="mt-2 text-3xl font-bold text-[#5B732E]">
                {crc(totals.real)}
              </div>
            </div>

            <div className="rounded-2xl bg-[#FEF6E0] p-6 ring-1 ring-[#F3E8C8]">
              <div className="text-xs font-bold text-[#C6A14B] tracking-wider uppercase">
                Diferencia (Proy - Real)
              </div>
              <div className="mt-2 text-3xl font-bold text-[#C19A3D]">
                {crc(totals.difference)}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="rounded-3xl bg-[#FBFDF7] ring-1 ring-[#E8EEDB] p-5 md:p-6 mb-6">
            <div className="text-sm font-bold text-[#33361D] mb-3">Filtros</div>

            {/* Buscador ancho (placeholder) */}
            <div className="mb-4">
              <input
                placeholder="Buscar por departamento, tipo o subtipo..."
                className="w-full rounded-2xl border-2 border-[#E4ECD2] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                onChange={() => {}}
              />
            </div>

            {/* Grid selects + fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Departamento
                </label>
                <select
                  value={departmentId ?? ""}
                  onChange={(e) =>
                    setDepartmentId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full rounded-2xl border-2 border-[#E4ECD2] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                >
                  <option value="">Todos</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Tipo
                </label>
                <select
                  value={incomeTypeId ?? ""}
                  onChange={(e) =>
                    setIncomeTypeId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full rounded-2xl border-2 border-[#E4ECD2] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                >
                  <option value="">Todos</option>
                  {incomeTypes.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Fecha de inicio
                </label>
                <input
                  type={forceTextStart ? "text" : "date"}
                  placeholder="dd/mm/aaaa"
                  value={start ?? ""}
                  onFocus={() => setForceTextStart(false)}
                  onBlur={(e) => {
                    if (!e.target.value) setForceTextStart(true);
                  }}
                  onChange={(e) => setStart(e.target.value || undefined)}
                  className="w-full rounded-2xl border-2 border-[#E4ECD2] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Fecha de fin
                </label>
                <input
                  type={forceTextEnd ? "text" : "date"}
                  placeholder="dd/mm/aaaa"
                  value={end ?? ""}
                  onFocus={() => setForceTextEnd(false)}
                  onBlur={(e) => {
                    if (!e.target.value) setForceTextEnd(true);
                  }}
                  onChange={(e) => setEnd(e.target.value || undefined)}
                  className="w-full rounded-2xl border-2 border-[#E4ECD2] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#FBFDF7] ring-1 ring-[#E8EEDB] p-5 md:p-6 mb-6">
            {/* Acciones */}
            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex gap-3">
                <button
                  onClick={clear}
                  className="rounded-2xl border-2 border-[#5B732E] text-[#5B732E] font-semibold px-6 py-3 hover:bg-[#EAEFE0] transition"
                >
                  Limpiar
                </button>
                <button
                  onClick={apply}
                  disabled={reportQuery.isLoading}
                  className="rounded-2xl bg-[#5B732E] text-white font-semibold px-6 py-3 hover:bg-[#556B2F] transition disabled:opacity-60 shadow-sm"
                >
                  {reportQuery.isLoading ? "Cargando..." : "Aplicar filtros"}
                </button>
              </div>

              {/* Botones a la derecha */}
              <div className="md:ml-auto flex flex-wrap gap-3">
                <button
                  onClick={handlePreviewPDF}
                  className="rounded-2xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold px-6 py-3 hover:bg-[#FEF6E0] transition"
                >
                  Ver PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="rounded-2xl bg-[#C19A3D] text-white font-semibold px-6 py-3 hover:bg-[#C6A14B] transition shadow-sm"
                >
                  Descargar PDF
                </button>

                {/* Excel */}
                <button
                  onClick={handleExcelComparativo}
                  className="rounded-2xl border-2 border-[#2d6a4f] text-white bg-[#376a2d] font-semibold px-6 py-3 hover:bg-[#3c5c35] transition disabled:opacity-60"
                >
                  Descargar Excel
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-2xl border border-[#EAEFE0] overflow-hidden">
            <div className="max-h-[60vh] overflow-auto">
              <div className="sticky top-0 z-10 bg-[#EAEFE0] px-4 py-3 border-b border-[#E3E6D9]">
                <div className="grid grid-cols-4 gap-4 text-xs md:text-sm font-bold text-[#33361D]">
                  <div>Subtipo</div>
                  <div className="text-right">Real</div>
                  <div className="text-right">Proyectado</div>
                  <div className="text-right">Diferencia</div>
                </div>
              </div>

              <div className="bg-white divide-y divide-[#F0F2E6]">
                {rows.map((r: any, i: number) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 gap-4 px-4 py-3 text-sm text-[#33361D] even:bg-[#FAFBF7] hover:bg-[#F8F9F3] transition"
                  >
                    <div className="font-medium">{r.name}</div>
                    <div className="text-right tabular-nums">{crc(r.real)}</div>
                    <div className="text-right tabular-nums font-medium text-[#5B732E]">
                      {crc(r.projected)}
                    </div>
                    <div className="text-right tabular-nums font-bold text-[#C19A3D]">
                      {crc(r.difference)}
                    </div>
                  </div>
                ))}

                {rows.length === 0 && !reportQuery.isLoading && (
                  <div className="py-10 text-center text-gray-400 font-medium">
                    Sin resultados
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
