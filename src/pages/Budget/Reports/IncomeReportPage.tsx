import { useState } from "react";
import {
  useIncomeReport,
  useIncomeReportExcel,
  useIncomeReportPDF,
} from "../../../hooks/Budget/reports/useIncomeReport";

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2,
  }).format(n);

export default function IncomeReportPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // 🔹 queryInput = lo que escribe la persona
  // 🔹 query = filtro ya aplicado al presionar el botón
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");

  const [submitted, setSubmitted] = useState<any>({});

  const { data, isFetching } = useIncomeReport(submitted);
  const { mutateAsync: generateIncomePDF, isPending: isPdfGenerating } =
    useIncomeReportPDF();
  const { mutateAsync: generateIncomeExcel, isPending: isExcelGenerating } =
    useIncomeReportExcel();

  const rows = data?.rows ?? [];
  const totals: any = data?.totals ?? {};
  const [isDownloading, setIsDownloading] = useState(false);

  // 🔎 FILTRO LOCAL usando SOLO el query APLICADO
  const filteredRows = rows.filter((r: any) => {
    if (!query.trim()) return true;

    const searchTerm = query.toLowerCase().trim();
    const dept = (r.department || "").toLowerCase();
    const type = (r.incomeType || "").toLowerCase();
    const subtype = (r.incomeSubType || "").toLowerCase();

    return (
      dept.includes(searchTerm) ||
      type.includes(searchTerm) ||
      subtype.includes(searchTerm)
    );
  });

  // ✅ Aplicar filtros SOLO al darle clic
  const apply = () => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      // query no va al backend, es solo local
    });

    // aquí "congelamos" lo que haya en el input
    setQuery(queryInput);
  };

  const clearFilters = () => {
    setStart("");
    setEnd("");
    setQueryInput("");
    setQuery("");
    setSubmitted({});
  };

  const hasSubmittedFilters = submitted && Object.keys(submitted).length > 0;

  const handlePreviewPDF = async () => {
    if (!hasSubmittedFilters) {
      return alert("Primero aplica los filtros antes de ver el PDF");
    }
    await generateIncomePDF({ ...(submitted ?? {}), preview: true } as any);
  };

  const handleDownloadPDF = async () => {
    if (!hasSubmittedFilters) {
      return alert("Primero aplica los filtros antes de descargar el PDF");
    }
    setIsDownloading(true);
    try {
      await generateIncomePDF({ ...(submitted ?? {}), preview: false } as any);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handleDownloadExcel = async () => {
    if (!hasSubmittedFilters) {
      return alert("Primero aplica los filtros antes de descargar el Excel");
    }
    await generateIncomeExcel(submitted ?? {});
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="">
          {/* Tarjetas Totales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
                Total Ingresos
              </div>
              <div className="mt-2 text-3xl font-bold text-[#5B732E]">
                {crc(totals?.total ?? 0)}
              </div>
            </div>
            <div className="rounded-2xl bg-[#EAEFE0] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
                Departamentos
              </div>
              <ul className="mt-3 text-sm text-[#33361D] space-y-1.5">
                {(totals?.byDepartment ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span className="font-medium">{r.department}</span>
                    <span className="font-bold text-[#5B732E]">
                      {crc(r.total)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#FEF6E0] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#C6A14B] tracking-wider uppercase">
                Tipos de Ingreso
              </div>
              <ul className="mt-3 text-sm text-[#33361D] space-y-1.5">
                {(totals?.byType ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span className="font-medium">{r.type}</span>
                    <span className="font-bold text-[#C19A3D]">
                      {crc(r.total)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
            <div className="text-sm font-bold text-[#33361D] mb-4">
              Filtros
            </div>

            <div className="mb-4">
              <input
                placeholder="Buscar por departamento, tipo o subtipo…"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
              />
              {query && (
                <div className="mt-2 text-xs text-gray-600">
                  Mostrando {filteredRows.length} de {rows.length} resultados
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>
            </div>

            {/* Botones (mismo responsive) */}
            <div className="mt-5 flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={clearFilters}
                disabled={isFetching}
                className="rounded-xl border-2 border-[#5B732E] text-[#5B732E] font-semibold px-6 py-3 hover:bg-[#EAEFE0] transition disabled:opacity-60"
              >
                Limpiar
              </button>
              <button
                onClick={apply}
                disabled={isFetching}
                className="rounded-xl bg-[#5B732E] text-white font-semibold px-6 py-3 hover:bg-[#556B2F] transition disabled:opacity-60 shadow-sm"
              >
                {isFetching ? "Cargando..." : "Aplicar filtros"}
              </button>

              <div className="ml-auto flex gap-3">
                <button
                  onClick={handlePreviewPDF}
                  disabled={isPdfGenerating}
                  className="px-5 py-3 rounded-xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold hover:bg-[#FEF6E0] transition"
                >
                  Ver PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || isPdfGenerating}
                  className="px-5 py-3 rounded-xl bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition disabled:opacity-50 shadow-sm"
                >
                  {isDownloading || isPdfGenerating
                    ? "Descargando…"
                    : "Descargar PDF"}
                </button>
                <button
                  onClick={handleDownloadExcel}
                  disabled={isExcelGenerating}
                  className="px-5 py-3 rounded-xl border-2 border-[#2d6a4f] text-white bg-[#376a2d] font-semibold hover:bg-[#3c5c35] transition disabled:opacity-60"
                >
                  {isExcelGenerating ? "Generando…" : "Descargar Excel"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla sin líneas */}
          <div className="mt-6 rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
            <div className="bg-[#EAEFE0] px-4 py-3">
              <div className="grid grid-cols-5 gap-4 text-sm font-bold text-[#33361D]">
                <div>Departamento</div>
                <div>Tipo</div>
                <div>Subtipo</div>
                <div>Fecha</div>
                <div className="text-right">Monto</div>
              </div>
            </div>
            <div className="bg-white">
              {filteredRows.map((r: any, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition"
                >
                  <div className="font-medium">{r.department}</div>
                  <div className="font-medium">{r.incomeType}</div>
                  <div className="font-medium">{r.incomeSubType}</div>
                  <div className="font-medium">
                    {r?.date
                      ? new Date(r.date).toLocaleDateString("es-CR")
                      : "—"}
                  </div>
                  <div className="text-right font-bold text-[#5B732E]">
                    {crc(r.amount)}
                  </div>
                </div>
              ))}

              {filteredRows.length === 0 && !isFetching && (
                <div className="py-8 text-center text-gray-400 font-medium">
                  {query
                    ? "No se encontraron resultados para tu búsqueda"
                    : "Sin resultados"}
                </div>
              )}

              {isFetching && (
                <div className="py-8 text-center text-gray-400 font-medium">
                  Cargando...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
