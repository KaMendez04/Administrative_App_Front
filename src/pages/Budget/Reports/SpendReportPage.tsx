import { useState } from "react"; 
import { useSpendReport, useSpendReportPDF, type SpendReportNameFilters } from "../../../hooks/Budget/reports/useSpendReport";
import SpendTable from "../../../components/Budget/Reports/spendTable";

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

export default function SpendReportPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [deptName, setDeptName] = useState("");
  const [typeName, setTypeName] = useState("");
  const [subTypeName, setSubTypeName] = useState("");
  const [search, setSearch] = useState("");

  const [submitted, setSubmitted] = useState<SpendReportNameFilters | null>({});
  const { data, isFetching, isLoading } = useSpendReport(submitted);
  const pdfMutation = useSpendReportPDF();
  const [isDownloading, setIsDownloading] = useState(false);

  const rows = data?.rows ?? [];
  const totals: any = data?.totals ?? {};

  const apply = () => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      departmentName: search || deptName || undefined,
      spendTypeName: search || typeName || undefined,
      spendSubTypeName: search || subTypeName || undefined,
    });
  };

  const clearFilters = () => {
    setStart("");
    setEnd("");
    setDeptName("");
    setTypeName("");
    setSubTypeName("");
    setSearch("");
    setSubmitted({});
  };

  const handlePreviewPDF = async () => {
    if (!submitted) return alert("Primero aplica los filtros antes de ver el PDF");
    await pdfMutation.mutateAsync({ ...submitted, preview: true });
  };

  const handleDownloadPDF = async () => {
    if (!submitted) return alert("Primero aplica los filtros antes de descargar el PDF");
    setIsDownloading(true);
    try {
      await pdfMutation.mutateAsync({ ...submitted, preview: false });
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">

        {/* Totales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">Total Egresos</div>
            <div className="mt-2 text-3xl font-bold text-[#5B732E]">{crc(totals?.total ?? 0)}</div>
          </div>
          <div className="rounded-2xl bg-[#EAEFE0] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">Por Departamento</div>
            <ul className="mt-3 text-sm text-[#33361D] space-y-1.5">
              {(totals?.byDepartment ?? []).map((r: any, i: number) => (
                <li key={i} className="flex justify-between">
                  <span className="font-medium">{r.department}</span>
                  <span className="font-bold text-[#5B732E]">{crc(r.total)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[#FEF6E0] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#C6A14B] tracking-wider uppercase">Por Tipo</div>
            <ul className="mt-3 text-sm text-[#33361D] space-y-1.5">
              {(totals?.byType ?? []).map((r: any, i: number) => (
                <li key={i} className="flex justify-between">
                  <span className="font-medium">{r.type}</span>
                  <span className="font-bold text-[#C19A3D]">{crc(r.total)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-6 rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

          {/* Barra de búsqueda */}
          <div className="mb-4">
            <input
              placeholder="Buscar por departamento, tipo o subtipo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#33361D] mb-1.5">Fecha de inicio</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#33361D] mb-1.5">Fecha de fin</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
              />
            </div>
          </div>

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
              Aplicar filtros
            </button>

            <div className="ml-auto flex gap-3">
              <button
                onClick={handlePreviewPDF}
                disabled={pdfMutation.isPending}
                className="px-5 py-3 rounded-xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold hover:bg-[#FEF6E0] transition"
              >
                Ver PDF
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading || pdfMutation.isPending}
                className="px-5 py-3 rounded-xl bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition disabled:opacity-50 shadow-sm"
              >
                {isDownloading || pdfMutation.isPending ? "Descargando…" : "Descargar PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-6 rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
          <div className="bg-white">
            <SpendTable rows={rows} loading={isLoading && !data} />
          </div>
        </div>

      </div>
    </div>
  );
}
