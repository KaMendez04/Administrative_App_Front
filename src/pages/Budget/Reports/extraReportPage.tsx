import { useState } from "react";
import { useExtraReport } from "../../../hooks/Budget/reports/useExtraReport";
import ExtraTable from "../../../components/Budget/Reports/extraTable";
import { downloadExtraReportPDF, previewExtraReportPDF } from "../../../services/Budget/reportsExtra/extraReportService";

const fmt = (n:number)=>new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",maximumFractionDigits:0}).format(n||0);

export default function ExtraReportPage(){
  const [start,setStart]=useState(""); 
  const [end,setEnd]=useState(""); 
  const [name,setName]=useState("");
  const [submitted,setSubmitted]=useState<{start?:string;end?:string;name?:string}|null>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const {data,isFetching,isLoading}=useExtraReport(submitted);
  const rows = data?.rows ?? [];
  const totals = data?.totals ?? {count:0,totalAmount:0,totalUsed:0,totalRemaining:0};

  const apply=()=>setSubmitted({ start: start||undefined, end: end||undefined, name: name||undefined });
  const clearFilters = ()=>{ setStart(""); setEnd(""); setName(""); setSubmitted({}); };

  const handleDownloadPDF = () => {
    if (!submitted) return alert('Primero aplica los filtros antes de descargar el PDF');
    setIsDownloading(true);
    try { downloadExtraReportPDF(submitted); } 
    finally { setTimeout(()=>setIsDownloading(false), 1200); }
  };

  const handlePreviewPDF = () => {
    if (!submitted) return alert('Primero aplica los filtros antes de ver el PDF');
    previewExtraReportPDF(submitted);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="">

          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">TOTAL</div>
              <div className="mt-2 text-3xl font-bold text-[#5B732E]">{fmt(totals.totalAmount)}</div>

            </div>
            <div className="rounded-2xl bg-[#EAEFE0] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">USADO</div>
              <div className="mt-2 text-3xl font-bold text-[#5B732E]">{fmt(totals.totalUsed)}</div>

            </div>
            <div className="rounded-2xl bg-[#FEF6E0] p-5 shadow-sm">
              <div className="text-xs font-bold text-[#C6A14B] tracking-wider uppercase">RESTANTE</div>
              <div className="mt-2 text-3xl font-bold text-[#C19A3D]">{fmt(totals.totalRemaining)}</div>

            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
            <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

            <div className="mb-4">
              <input
                placeholder="Buscar por nombre…"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">Fecha de inicio</label>
                <input
                  type="date"
                  value={start}
                  onChange={(e)=>setStart(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">Fecha de fin</label>
                <input
                  type="date"
                  value={end}
                  onChange={(e)=>setEnd(e.target.value)}
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
                {isFetching ? "Cargando..." : "Aplicar filtros"}
              </button>

              <div className="ml-auto flex gap-3">
                <button
                  onClick={handlePreviewPDF}
                  disabled={isFetching}
                  className="px-5 py-3 rounded-xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold hover:bg-[#FEF6E0] transition"
                >
                  Ver PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="px-5 py-3 rounded-xl bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition disabled:opacity-50 shadow-sm"
                >
                  {isDownloading ? "Descargando…" : "Descargar PDF"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="mt-6 rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
            <ExtraTable rows={rows as any[]} loading={isLoading && !data} />
          </div>

        </div>
      </div>
    </div>
  );
}
