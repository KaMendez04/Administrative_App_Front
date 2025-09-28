import { useState } from "react";
import { useSpendReport, useSpendReportPDF } from "../../../hooks/Budget/reports/useSpendReport";

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export default function SpendReportPage() {
  // Filtros
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Hook de datos
  const { data, isFetching, isLoading } = useSpendReport(submitted);
  // Hook para generar/preview del PDF
  const { mutateAsync: generateSpendPDF, isPending: isPdfGenerating } = useSpendReportPDF();

  const rows = data?.rows ?? [];
  const totals: any = data?.totals ?? {};

  const apply = () => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      search: query || undefined,
    });
  };

  const clearFilters = () => {
    setStart("");
    setEnd("");
    setQuery("");
    setSubmitted(null);
  };

  const handleDownloadPDF = async () => {
    if (!submitted) return alert("Primero aplica los filtros antes de descargar el PDF");
    setIsDownloading(true);
    try {
      await generateSpendPDF({ ...(submitted ?? {}), preview: false } as any);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handlePreviewPDF = async () => {
    if (!submitted) return alert("Primero aplica los filtros antes de ver el PDF");
    await generateSpendPDF({ ...(submitted ?? {}), preview: true } as any);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Reportes — Egresos</h2>

          {/* 🟣 Tarjetas Totales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl ring-1 ring-indigo-100 bg-indigo-50 p-5">
              <div className="text-xs font-semibold text-indigo-600 tracking-wider">TOTAL EGRESOS</div>
              <div className="mt-2 text-3xl font-bold text-indigo-900">{crc(totals?.total ?? 0)}</div>
            </div>
            <div className="rounded-2xl ring-1 ring-green-100 bg-green-50 p-5">
              <div className="text-xs font-semibold text-green-600 tracking-wider">DEPARTAMENTOS</div>
              <ul className="mt-3 text-sm text-green-900 space-y-1">
                {(totals?.byDepartment ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{r.department}</span>
                    <span className="font-semibold">{crc(r.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl ring-1 ring-amber-100 bg-amber-50 p-5">
              <div className="text-xs font-semibold text-amber-600 tracking-wider">TIPOS DE EGRESO</div>
              <ul className="mt-3 text-sm text-amber-900 space-y-1">
                {(totals?.byType ?? []).map((r: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{r.type}</span>
                    <span className="font-semibold">{crc(r.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 🧰 Filtros */}
          <div className="mt-6 rounded-2xl ring-1 ring-gray-200 p-5 bg-white">
            <div className="text-sm font-semibold text-gray-700 mb-4">Filtros</div>

            {/* 🔍 Barra de búsqueda unificada */}
            <div className="mb-4">
              <input
                placeholder="Buscar por departamento, tipo o subtipo…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fecha de fin</label>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3"
                />
              </div>
            </div>

            {/* 🔘 Botones */}
            <div className="mt-4 flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={clearFilters}
                disabled={isFetching}
                className="rounded-xl border border-gray-300 text-gray-700 px-5 py-3 hover:bg-gray-50 transition disabled:opacity-60"
              >
                Limpiar
              </button>
              <button
                onClick={apply}
                disabled={isFetching}
                className="rounded-xl bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isFetching ? "Cargando..." : "Aplicar filtros"}
              </button>

              {/* 📄 PDF */}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={handlePreviewPDF}
                  disabled={isPdfGenerating}
                  className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  Ver PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || isPdfGenerating}
                  className="px-4 py-3 rounded-xl bg-[#708C3E] text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  {isDownloading || isPdfGenerating ? "Descargando…" : "Descargar PDF"}
                </button>
              </div>
            </div>
          </div>

          {/* 📊 Tabla */}
          <div className="mt-6 rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 px-4">Departamento</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Subtipo</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 px-4">{r.department}</td>
                    <td className="py-2 px-4">{r.spendType}</td>
                    <td className="py-2 px-4">{r.spendSubType}</td>
                    <td className="py-2 px-4">{new Date(r.date).toLocaleDateString("es-CR")}</td>
                    <td className="py-2 px-4 text-right">{crc(r.amount)}</td>
                  </tr>
                ))}
                {rows.length === 0 && !isFetching && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      Sin resultados
                    </td>
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
