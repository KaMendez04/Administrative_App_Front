import { useState } from "react";
import { useExtraReport } from "../../../hooks/Budget/reports/useExtraReport";
import ExtraTable from "../../../components/Budget/Reports/extraTable";
import { downloadExtraReportPDF, previewExtraReportPDF } from "../../../services/Budget/reportsExtra/extraReportService";

const fmt = (n:number)=>new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",maximumFractionDigits:0}).format(n||0);

export default function ExtraReportPage(){
  const [start,setStart]=useState(""); 
  const [end,setEnd]=useState(""); 
  const [name,setName]=useState("");
  const [submitted,setSubmitted]=useState<{start?:string;end?:string;name?:string}|null>({}); // query inicial sin filtros
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
        <div className="rounded-3xl bg-white  p-6 md:p-8">

          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl ring-1 ring-indigo-100 bg-indigo-50 p-5">
              <div className="text-xs font-semibold text-indigo-600 tracking-wider">TOTAL</div>
              <div className="mt-2 text-3xl font-bold text-indigo-900">{fmt(totals.totalAmount)}</div>
              <div className="mt-3 h-2 rounded-full bg-indigo-200"><div className="h-2 bg-indigo-600 w-full rounded-full"/></div>
            </div>
            <div className="rounded-2xl ring-1 ring-green-100 bg-green-50 p-5">
              <div className="text-xs font-semibold text-green-600 tracking-wider">USADO</div>
              <div className="mt-2 text-3xl font-bold text-green-900">{fmt(totals.totalUsed)}</div>
              <div className="mt-3 h-2 rounded-full bg-green-200">
                <div
                  className="h-2 bg-green-600 rounded-full"
                  style={{ width: `${totals.totalAmount>0 ? Math.round((totals.totalUsed/totals.totalAmount)*100) : 0}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl ring-1 ring-amber-100 bg-amber-50 p-5">
              <div className="text-xs font-semibold text-amber-600 tracking-wider">RESTANTE</div>
              <div className="mt-2 text-3xl font-bold text-amber-900">{fmt(totals.totalRemaining)}</div>
              <div className="mt-3 h-2 rounded-full bg-amber-200">
                <div
                  className="h-2 bg-amber-600 rounded-full"
                  style={{ width: `${totals.totalAmount>0 ? Math.round((totals.totalRemaining/totals.totalAmount)*100) : 0}% `}}
                />
              </div>
            </div>
          </div>

          {/* Filtros card */}
          <div className="mt-6 rounded-2xl ring-1 ring-gray-200 p-5 bg-white">
            <div className="text-sm font-semibold text-gray-700 mb-4">Filtros</div>

            <div className="mb-4">
              <input
                placeholder="Buscar por nomdbre…"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  value={start}
                  onChange={(e)=>setStart(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3"
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fecha de fin</label>
                <input
                  type="date"
                  value={end}
                  onChange={(e)=>setEnd(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3"
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>

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

              {/* Botones PDF (se mantienen) */}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={handlePreviewPDF}
                  className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  Ver PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="px-4 py-3 rounded-xl bg-[#708C3E] text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  {isDownloading ? "Descargando…" : "Descargar PDF"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="mt-6 rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white">
            <ExtraTable rows={rows as any[]} loading={isLoading && !data} />
          </div>
        </div>
      </div>
    </div>
  );
}