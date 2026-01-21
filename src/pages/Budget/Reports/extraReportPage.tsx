import { useEffect, useState } from "react"
import {
  useExtraReport,
  useExtraReportExcel,
} from "../../../hooks/Budget/reports/useExtraReport"
import {
  downloadExtraReportPDF,
  previewExtraReportPDF,
} from "../../../services/Budget/reportsExtra/extraReportService"

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(n || 0)

export default function ExtraReportPage() {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [name, setName] = useState("")

  const [submitted, setSubmitted] = useState<{
    start?: string
    end?: string
    name?: string
  }>({})

  const [isDownloading, setIsDownloading] = useState(false)

  const { data, isFetching, isLoading } = useExtraReport(submitted)
  const rows = data?.rows ?? []
  const totals = data?.totals ?? {
    count: 0,
    totalAmount: 0,
    totalUsed: 0,
    totalRemaining: 0,
  }

  const excelMutation = useExtraReportExcel()

  // Auto-aplicar filtros
  useEffect(() => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      name: name || undefined,
    })
  }, [start, end, name])

  // ------- acciones -------
  const handlePreviewPDF = () => {
    previewExtraReportPDF(submitted)
  }

  const handleDownloadPDF = () => {
    setIsDownloading(true)
    try {
      downloadExtraReportPDF(submitted)
    } finally {
      setTimeout(() => setIsDownloading(false), 1200)
    }
  }

  const handleDownloadExcel = async () => {
    await excelMutation.mutateAsync(submitted)
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
              TOTAL
            </div>
            <div className="mt-2 text-3xl font-bold text-[#5B732E]">
              {fmt(totals.totalAmount)}
            </div>
          </div>

          <div className="rounded-2xl bg-[#EAEFE0] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
              USADO
            </div>
            <div className="mt-2 text-3xl font-bold text-[#5B732E]">
              {fmt(totals.totalUsed)}
            </div>
          </div>

          <div className="rounded-2xl bg-[#FEF6E0] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#C6A14B] tracking-wider uppercase">
              RESTANTE
            </div>
            <div className="mt-2 text-3xl font-bold text-[#C19A3D]">
              {fmt(totals.totalRemaining)}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-6 rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

          <div className="mb-4">
            <input
              placeholder="Buscar por nombre…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
            />
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
        </div>

        {/* CARD SEPARADO DE ACCIONES */}
        <div className="mt-6 rounded-3xl bg-[#FBFDF7] ring-1 ring-[#E8EEDB] p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="md:ml-auto w-full md:w-auto flex flex-wrap gap-3">
              <button
                onClick={handlePreviewPDF}
                disabled={isFetching}
                className="flex-1 min-w-[140px] md:flex-none px-5 py-3 rounded-xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold hover:bg-[#FEF6E0] transition disabled:opacity-60"
              >
                Ver PDF
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading || isFetching}
                className="flex-1 min-w-[160px] md:flex-none px-5 py-3 rounded-xl bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition disabled:opacity-50 shadow-sm"
              >
                {isDownloading ? "Descargando…" : "Descargar PDF"}
              </button>

              <button
                onClick={handleDownloadExcel}
                disabled={excelMutation.isPending || isFetching}
                className="flex-1 min-w-[170px] md:flex-none px-5 py-3 rounded-xl border-2 border-[#2d6a4f] text-white bg-[#376a2d] font-semibold hover:bg-[#3c5c35] transition disabled:opacity-60"
              >
                {excelMutation.isPending ? "Generando…" : "Descargar Excel"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-6 rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
          {/* ===== Header (solo desktop) ===== */}
          <div className="hidden md:block bg-[#EAEFE0] px-4 py-3">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 text-sm font-bold text-[#33361D]">
              <div>Nombre</div>
              <div className="text-right">Monto</div>
              <div className="text-right">Usado</div>
              <div className="text-right">Restante</div>
            </div>
          </div>

          {/* ===== Body ===== */}
          <div className="bg-white">
            {(rows ?? []).map((r: any, i: number) => (
              <div
                key={i}
                className="
                  border-b border-[#EAEFE0]
                  px-4 py-3
                  text-sm text-[#33361D]
                  hover:bg-[#F8F9F3]
                  transition
                  grid
                  grid-cols-1
                  gap-2
                  md:grid-cols-[1fr_1fr_1fr_1fr]
                  md:gap-4
                "
              >
                {/* Nombre */}
                <div>
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Nombre
                  </span>
                  <span className="font-medium">{r.name}</span>
                </div>

                {/* Monto */}
                <div className="md:text-right">
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Monto
                  </span>
                  <span className="tabular-nums whitespace-nowrap font-medium text-[#5B732E]">
                    {fmt(r.amount)}
                  </span>
                </div>

                {/* Usado */}
                <div className="md:text-right">
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Usado
                  </span>
                  <span className="tabular-nums whitespace-nowrap text-[#5B732E]">
                    {fmt(r.used)}
                  </span>
                </div>

                {/* Restante */}
                <div className="md:text-right">
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Restante
                  </span>
                  <span className="tabular-nums whitespace-nowrap font-bold text-[#C19A3D]">
                    {fmt(r.remaining)}
                  </span>
                </div>
              </div>
            ))}

            {/* Estados */}
            {(rows ?? []).length === 0 && !(isLoading && !data) && (
              <div className="py-10 text-center text-gray-400 font-medium">
                Sin resultados
              </div>
            )}

            {(isLoading && !data) && (
              <div className="py-10 text-center text-gray-400 font-medium">
                Cargando...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
