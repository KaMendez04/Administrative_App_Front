import { useEffect, useMemo, useState } from "react"

import {
  useSpendReport,
  useSpendReportExcel,
  useSpendReportPDF,
  type SpendReportNameFilters,
} from "../../../hooks/Budget/reports/useSpendReport"

import { CustomSelect } from "../../../components/CustomSelect"

// ✅ solo llamamos el componente/hook que ya tenés
import { usePagination, PaginationBar } from "../../../components/ui/pagination"

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0)

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es")
  )
}

export default function SpendReportPage() {
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()

  //  filtros por selects
  const [departmentName, setDepartmentName] = useState<string | undefined>()
  const [spendTypeName, setSpendTypeName] = useState<string | undefined>()
  const [spendSubTypeName, setSpendSubTypeName] = useState<string | undefined>()

  // submitted siempre objeto (no null), auto-aplica
  const [submitted, setSubmitted] = useState<SpendReportNameFilters>({})

  const { data, isLoading } = useSpendReport(submitted)
  const pdfMutation = useSpendReportPDF()
  const excelMutation = useSpendReportExcel()
  const [isDownloading, setIsDownloading] = useState(false)

  const rows = data?.rows ?? []
  const totals: any = data?.totals ?? {}

  // Auto-aplicar filtros (sin botones)
  useEffect(() => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      departmentName: departmentName || undefined,
      spendTypeName: spendTypeName || undefined,
      spendSubTypeName: spendSubTypeName || undefined,
    })
  }, [start, end, departmentName, spendTypeName, spendSubTypeName])

  // Reseteos dependientes
  useEffect(() => {
    setSpendTypeName(undefined)
    setSpendSubTypeName(undefined)
  }, [departmentName])

  useEffect(() => {
    setSpendSubTypeName(undefined)
  }, [spendTypeName])

  const departmentOptions = useMemo(() => {
    const depts = uniqSorted(rows.map((r: any) => String(r.department ?? "")))
    return [
      { value: "", label: "Todos" },
      ...depts.map((d) => ({ value: d, label: d })),
    ]
  }, [rows])

  const typeOptions = useMemo(() => {
    const filtered = departmentName
      ? rows.filter((r: any) => String(r.department ?? "") === departmentName)
      : rows

    const types = uniqSorted(filtered.map((r: any) => String(r.spendType ?? "")))

    return [
      { value: "", label: "Todos" },
      ...types.map((t) => ({ value: t, label: t })),
    ]
  }, [rows, departmentName])

  const subTypeOptions = useMemo(() => {
    const filtered = rows.filter((r: any) => {
      const deptOk = departmentName
        ? String(r.department ?? "") === departmentName
        : true

      const typeOk = spendTypeName
        ? String(r.spendType ?? "") === spendTypeName
        : true

      return deptOk && typeOk
    })

    const subs = uniqSorted(
      filtered.map((r: any) => String(r.spendSubType ?? ""))
    )

    return [
      { value: "", label: "Todos" },
      ...subs.map((s) => ({ value: s, label: s })),
    ]
  }, [rows, departmentName, spendTypeName])

  const filteredRows = useMemo(() => {
    return rows.filter((r: any) => {
      const deptOk = departmentName
        ? String(r.department ?? "") === departmentName
        : true

      const typeOk = spendTypeName
        ? String(r.spendType ?? "") === spendTypeName
        : true

      const subOk = spendSubTypeName
        ? String(r.spendSubType ?? "") === spendSubTypeName
        : true

      return deptOk && typeOk && subOk
    })
  }, [rows, departmentName, spendTypeName, spendSubTypeName])

  // ------- UI: placeholder dd/mm/aaaa en inputs date -------
  const [forceTextStart, setForceTextStart] = useState(!start)
  const [forceTextEnd, setForceTextEnd] = useState(!end)

  const handlePreviewPDF = async () => {
    await pdfMutation.mutateAsync({ ...submitted, preview: true })
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await pdfMutation.mutateAsync({ ...submitted, preview: false })
    } finally {
      setTimeout(() => setIsDownloading(false), 1200)
    }
  }

  const handleDownloadExcel = async () => {
    await excelMutation.mutateAsync(submitted)
  }

  // ✅ Paginación (mínimo código aquí: todo vive en ui/pagination)
  const { page, setPage, totalPages, pagedItems, pageItems } = usePagination(
    filteredRows,
    10,
    [start, end, departmentName, spendTypeName, spendSubTypeName, rows]
  )

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {/* Totales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
              Total Egresos
            </div>
            <div className="mt-2 text-3xl font-bold text-[#5B732E]">
              {crc(totals?.total ?? 0)}
            </div>
          </div>

          <div className="rounded-2xl bg-[#EAEFE0] p-5 shadow-sm">
            <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
              Por Departamento
            </div>
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
            <div className="text-xs font-bold text-[#C6A14B] tracking-wider uppercase">
              Por Tipo
            </div>
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

        {/* Filtros (NO TOCAR) */}
        <div className="mt-6 rounded-2xl bg-[#F8F9F3] p-5 shadow-sm">
          <div className="text-sm font-bold text-[#33361D] mb-4">Filtros</div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                Departamento
              </label>
              <CustomSelect
                value={departmentName ?? ""}
                onChange={(v) =>
                  setDepartmentName(v === "" ? undefined : String(v))
                }
                options={departmentOptions}
                placeholder="Todos"
                zIndex={50}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                Tipo
              </label>
              <CustomSelect
                value={spendTypeName ?? ""}
                onChange={(v) => setSpendTypeName(v === "" ? undefined : String(v))}
                options={typeOptions}
                placeholder="Todos"
                zIndex={40}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                Subtipo
              </label>
              <CustomSelect
                value={spendSubTypeName ?? ""}
                onChange={(v) =>
                  setSpendSubTypeName(v === "" ? undefined : String(v))
                }
                options={subTypeOptions}
                placeholder="Todos"
                zIndex={30}
              />
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
                  if (!e.target.value) setForceTextStart(true)
                }}
                onChange={(e) => setStart(e.target.value || undefined)}
                className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
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
                  if (!e.target.value) setForceTextEnd(true)
                }}
                onChange={(e) => setEnd(e.target.value || undefined)}
                className="w-full rounded-xl border-2 border-[#EAEFE0] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Acciones (CARD aparte) */}
        <div className="mt-6 rounded-3xl bg-[#FBFDF7] ring-1 ring-[#E8EEDB] p-5 md:p-6 mb-6">
          <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3">
            <div className="md:ml-auto flex flex-wrap gap-3">
              <button
                onClick={handlePreviewPDF}
                disabled={pdfMutation.isPending}
                className="rounded-2xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold px-6 py-3 hover:bg-[#FEF6E0] transition disabled:opacity-60"
              >
                Ver PDF
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading || pdfMutation.isPending}
                className="rounded-2xl bg-[#C19A3D] text-white font-semibold px-6 py-3 hover:bg-[#C6A14B] transition shadow-sm disabled:opacity-60"
              >
                {isDownloading || pdfMutation.isPending
                  ? "Descargando…"
                  : "Descargar PDF"}
              </button>

              <button
                onClick={handleDownloadExcel}
                disabled={excelMutation.isPending}
                className="rounded-2xl border-2 border-[#2d6a4f] text-white bg-[#376a2d] font-semibold px-6 py-3 hover:bg-[#3c5c35] transition disabled:opacity-60"
              >
                {excelMutation.isPending ? "Generando…" : "Descargar Excel"}
              </button>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="mt-6 rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
          {/* Header solo desktop */}
          <div className="hidden md:block bg-[#EAEFE0] px-4 py-3">
            <div className="grid grid-cols-[1.5fr_1.5fr_2fr_1fr_0.9fr] gap-4 text-sm font-bold text-[#33361D]">
              <div>Departamento</div>
              <div>Tipo</div>
              <div>Subtipo</div>
              <div>Fecha</div>
              <div className="text-right">Monto</div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white">
            {pagedItems.map((r: any, i: number) => (
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
                  <span className="font-medium">{r.spendType}</span>
                </div>

                {/* Subtipo */}
                <div>
                  <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                    Subtipo
                  </span>
                  <span className="font-medium">{r.spendSubType}</span>
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
            {filteredRows.length === 0 && !isLoading && (
              <div className="py-8 text-center text-gray-400 font-medium">
                Sin resultados
              </div>
            )}

            {isLoading && (
              <div className="py-8 text-center text-gray-400 font-medium">
                Cargando...
              </div>
            )}
          </div>

          {/* ✅ Paginación (misma dinámica que antes) */}
          {!isLoading && filteredRows.length > 0 && totalPages > 1 && (
            <div className="bg-white px-4 py-4 border-t border-[#EAEFE0]">
              <PaginationBar
                page={page}
                totalPages={totalPages}
                pageItems={pageItems}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
