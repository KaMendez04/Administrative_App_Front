import { useEffect, useMemo, useState } from "react"
import {
  useIncomeReport,
  useIncomeReportExcel,
  useIncomeReportPDF,
} from "../../../hooks/Budget/reports/useIncomeReport"

import { CustomSelect } from "../../../components/CustomSelect"

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 2,
  }).format(n)

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es")
  )
}

export default function IncomeReportPage() {
  
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()

  
  const [department, setDepartment] = useState<string | undefined>()
  const [incomeType, setIncomeType] = useState<string | undefined>()
  const [incomeSubType, setIncomeSubType] = useState<string | undefined>()

  
  const [submitted, setSubmitted] = useState<any>({})

  const { data, isFetching } = useIncomeReport(submitted)
  const { mutateAsync: generateIncomePDF, isPending: isPdfGenerating } =
    useIncomeReportPDF()
  const { mutateAsync: generateIncomeExcel, isPending: isExcelGenerating } =
    useIncomeReportExcel()

  const rows = data?.rows ?? []
  const totals: any = data?.totals ?? {}
  const [isDownloading, setIsDownloading] = useState(false)

  // Auto-aplicar filtros (sin botones)
  useEffect(() => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
    })
  }, [start, end])

  
  useEffect(() => {
    setIncomeType(undefined)
    setIncomeSubType(undefined)
  }, [department])

  useEffect(() => {
    setIncomeSubType(undefined)
  }, [incomeType])

  
  const departmentOptions = useMemo(() => {
    const depts = uniqSorted(rows.map((r: any) => String(r.department ?? "")))
    return [
      { value: "", label: "Todos" },
      ...depts.map((d) => ({ value: d, label: d })),
    ]
  }, [rows])

  const typeOptions = useMemo(() => {
    const filtered = department
      ? rows.filter((r: any) => String(r.department ?? "") === department)
      : rows

    const types = uniqSorted(filtered.map((r: any) => String(r.incomeType ?? "")))

    return [
      { value: "", label: "Todos" },
      ...types.map((t) => ({ value: t, label: t })),
    ]
  }, [rows, department])

  const subTypeOptions = useMemo(() => {
    const filtered = rows.filter((r: any) => {
      const deptOk = department ? String(r.department ?? "") === department : true
      const typeOk = incomeType ? String(r.incomeType ?? "") === incomeType : true
      return deptOk && typeOk
    })

    const subs = uniqSorted(
      filtered.map((r: any) => String(r.incomeSubType ?? ""))
    )

    return [
      { value: "", label: "Todos" },
      ...subs.map((s) => ({ value: s, label: s })),
    ]
  }, [rows, department, incomeType])

  // Filtro local por selects (sin buscador)
  const filteredRows = useMemo(() => {
    return rows.filter((r: any) => {
      const deptOk = department ? String(r.department ?? "") === department : true
      const typeOk = incomeType ? String(r.incomeType ?? "") === incomeType : true
      const subOk = incomeSubType
        ? String(r.incomeSubType ?? "") === incomeSubType
        : true
      return deptOk && typeOk && subOk
    })
  }, [rows, department, incomeType, incomeSubType])

  // ------- UI: placeholder dd/mm/aaaa en inputs date -------
  const [forceTextStart, setForceTextStart] = useState(!start)
  const [forceTextEnd, setForceTextEnd] = useState(!end)

  // Exportar con filtros actuales (sin “aplicar”)
  const exportFilters = {
    start: start || undefined,
    end: end || undefined,
    department: department || undefined,
    incomeType: incomeType || undefined,
    incomeSubType: incomeSubType || undefined,
  }

  const handlePreviewPDF = async () => {
    await generateIncomePDF({ ...(exportFilters ?? {}), preview: true } as any)
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await generateIncomePDF({ ...(exportFilters ?? {}), preview: false } as any)
    } finally {
      setTimeout(() => setIsDownloading(false), 1200)
    }
  }

  const handleDownloadExcel = async () => {
    await generateIncomeExcel(exportFilters as any)
  }

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
            <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Departamento */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Departamento
                </label>
                <CustomSelect
                  value={department ?? ""}
                  onChange={(v) =>
                    setDepartment(v === "" ? undefined : String(v))
                  }
                  options={departmentOptions}
                  placeholder="Todos"
                  zIndex={50}
                />
              </div>

              {/* Tipo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Tipo
                </label>
                <CustomSelect
                  value={incomeType ?? ""}
                  onChange={(v) =>
                    setIncomeType(v === "" ? undefined : String(v))
                  }
                  options={typeOptions}
                  placeholder="Todos"
                  disabled={false}
                  zIndex={40}
                />
              </div>

              {/* Subtipo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Subtipo
                </label>
                <CustomSelect
                  value={incomeSubType ?? ""}
                  onChange={(v) =>
                    setIncomeSubType(v === "" ? undefined : String(v))
                  }
                  options={subTypeOptions}
                  placeholder="Todos"
                  disabled={false}
                  zIndex={30}
                />
              </div>

              {/* Fecha inicio */}
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
                    if (!e.target.value) setForceTextStart(true)
                  }}
                  onChange={(e) => setStart(e.target.value || undefined)}
                  className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>

              {/* Fecha fin */}
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
                    if (!e.target.value) setForceTextEnd(true)
                  }}
                  onChange={(e) => setEnd(e.target.value || undefined)}
                  className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>
            </div>
          </div>

          
          <div className="mt-6 rounded-3xl bg-[#FBFDF7] ring-1 ring-[#E8EEDB] p-5 md:p-6 mb-6">
            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3">
              <div className="md:ml-auto flex flex-wrap gap-3">
                <button
                  onClick={handlePreviewPDF}
                  disabled={isPdfGenerating}
                  className="flex-1 min-w-[140px] md:flex-none px-5 py-3 rounded-xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold hover:bg-[#FEF6E0] transition disabled:opacity-60"
                >
                  Ver PDF
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || isPdfGenerating}
                  className="flex-1 min-w-[160px] md:flex-none px-5 py-3 rounded-xl bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition disabled:opacity-50 shadow-sm"
                >
                  {isDownloading || isPdfGenerating
                    ? "Descargando…"
                    : "Descargar PDF"}
                </button>

                <button
                  onClick={handleDownloadExcel}
                  disabled={isExcelGenerating}
                  className="flex-1 min-w-[170px] md:flex-none px-5 py-3 rounded-xl border-2 border-[#2d6a4f] text-white bg-[#376a2d] font-semibold hover:bg-[#3c5c35] transition disabled:opacity-60"
                >
                  {isExcelGenerating ? "Generando…" : "Descargar Excel"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla sin líneas */}
          <div className="mt-6 rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
          {/* ===== Header (solo desktop) ===== */}
          <div className="hidden md:block bg-[#EAEFE0] px-4 py-3">
            <div className="grid grid-cols-[1.5fr_1.5fr_2fr_1fr_0.9fr] gap-4 text-sm font-bold text-[#33361D]">
              <div>Departamento</div>
              <div>Tipo</div>
              <div>Subtipo</div>
              <div>Fecha</div>
              <div className="text-right">Monto</div>
            </div>
          </div>

          {/* ===== Body ===== */}
          <div className="bg-white">
            {filteredRows.map((r: any, i: number) => (
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
                  md:grid-cols-[1.5fr_1.5fr_2fr_1fr_0.9fr]
                  md:gap-4
                "
              >
                {/* Departamento */}
                <div>
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Departamento
                  </span>
                  <span className="font-medium">{r.department}</span>
                </div>

                {/* Tipo */}
                <div>
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Tipo
                  </span>
                  <span className="font-medium">{r.incomeType}</span>
                </div>

                {/* Subtipo */}
                <div>
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Subtipo
                  </span>
                  <span className="font-medium">{r.incomeSubType}</span>
                </div>

                {/* Fecha */}
                <div>
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Fecha
                  </span>
                  <span className="font-medium">
                    {r?.date ? new Date(r.date).toLocaleDateString("es-CR") : "—"}
                  </span>
                </div>

                {/* Monto */}
                <div className="md:text-right">
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Monto
                  </span>
                  <span className="font-bold text-[#5B732E] tabular-nums whitespace-nowrap">
                    {crc(r.amount)}
                  </span>
                </div>
              </div>
            ))}

            {/* Estados */}
            {filteredRows.length === 0 && !isFetching && (
              <div className="py-8 text-center text-gray-400 font-medium">
                Sin resultados
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
  )
}
