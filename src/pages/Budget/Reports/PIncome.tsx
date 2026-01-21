import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  useIncomeReport,
  useIncomeReportFilters,
} from "../../../hooks/Budget/reports/usePIncomeReport"
import {
  downloadIncomeReportPDF,
  previewIncomeReportPDF,
  downloadIncomeCompareExcel,
} from "../../../services/Budget/reportPIncome/incomeReportService"
import {
  listDepartments,
  listPIncomeTypes,
  listPIncomeSubTypes,
} from "../../../services/Budget/projectionIncomeService"

import { CustomSelect } from "../../../components/CustomSelect"

type AnyObj = Record<string, unknown>
function ensureArray<T = any>(x: unknown): T[] {
  if (Array.isArray(x)) return x as T[]
  if (x && typeof x === "object") {
    const o = x as AnyObj
    if (Array.isArray((o as any).data)) return (o as any).data as T[]
    if (Array.isArray((o as any).items)) return (o as any).items as T[]
    const vals = Object.values(o)
    if (vals.length && vals.every((v) => v && typeof v === "object"))
      return vals as T[]
  }
  return []
}

// Formateo CRC
const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(
    Number.isFinite(n) ? n : 0
  )

export default function PIncomeProjectionsPage() {
  // ------- filtros -------
  const {
    filters,
    start,
    end,
    departmentId,
    incomeTypeId,
    incomeSubTypeId,
    setStart,
    setEnd,
    setDepartmentId,
    setIncomeTypeId,
    setIncomeSubTypeId,
  } = useIncomeReportFilters()

  const [submitted, setSubmitted] = useState<any>({})

  // Auto-aplicar filtros (sin botones)
  useEffect(() => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      departmentId: departmentId || undefined,
      incomeTypeId: incomeTypeId || undefined,
      incomeSubTypeId: incomeSubTypeId || undefined,
    })
  }, [start, end, departmentId, incomeTypeId, incomeSubTypeId])

  
  const { data: departmentsData = [] } = useQuery({
    queryKey: ["pIncomeDepartments"],
    queryFn: listDepartments,
    refetchOnMount: "always",
    staleTime: 0,
  })
  const departments = ensureArray<any>(departmentsData)

  
  const { data: incomeTypesData = [], isFetching: typesLoading } = useQuery({
    queryKey: ["pIncomeTypes", departmentId ?? null],
    queryFn: () => listPIncomeTypes(departmentId),
    refetchOnMount: "always",
    staleTime: 0,
  })
  const incomeTypes = ensureArray<any>(incomeTypesData)


  const { data: incomeSubTypesData = [], isFetching: subTypesLoading } = useQuery(
    {
      queryKey: ["pIncomeSubTypes", incomeTypeId ?? null],
      queryFn: () => listPIncomeSubTypes(Number(incomeTypeId)),
      enabled: !!incomeTypeId, 
      refetchOnMount: "always",
      staleTime: 0,
    }
  )
  const incomeSubTypes = ensureArray<any>(incomeSubTypesData)

  // reporte
  const reportQuery = useIncomeReport(submitted)
  const rows = ensureArray<any>(reportQuery.data?.rows)
  const totals =
    reportQuery.data?.totals ?? { real: 0, projected: 0, difference: 0 }

  // ------- UI: placeholder dd/mm/aaaa en inputs date -------
  const [forceTextStart, setForceTextStart] = useState(!start)
  const [forceTextEnd, setForceTextEnd] = useState(!end)

  // ------- acciones -------
  const handlePreviewPDF = () => previewIncomeReportPDF(filters)
  const handleDownloadPDF = () => downloadIncomeReportPDF(filters)
  const handleExcelComparativo = () => downloadIncomeCompareExcel(filters)

  
  const departmentOptions = [
    { value: "", label: "Todos" },
    ...departments.map((d: any) => ({ value: d.id, label: d.name })),
  ]

  const typeOptions = [
    {
      value: "",
      label: !departmentId ? "Seleccione un departamento" : typesLoading ? "Cargando..." : "Todos",
    },
    ...incomeTypes.map((t: any) => ({ value: t.id, label: t.name })),
  ]

  const subTypeOptions = [
    {
      value: "",
      label: !incomeTypeId ? "Seleccione un tipo" : subTypesLoading ? "Cargando..." : "Todos",
    },
    ...incomeSubTypes.map((st: any) => ({ value: st.id, label: st.name })),
  ]

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
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Departamento
                </label>

                <CustomSelect
                  value={departmentId ?? ""}
                  onChange={(v) => {
                    const nextDept = v === "" ? undefined : Number(v)
                    setDepartmentId(nextDept)
                    setIncomeTypeId(undefined)
                    setIncomeSubTypeId(undefined)
                  }}
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
                  value={incomeTypeId ?? ""}
                  onChange={(v) => {
                    const nextType = v === "" ? undefined : Number(v)
                    setIncomeTypeId(nextType)
                    setIncomeSubTypeId(undefined)
                  }}
                  options={typeOptions}
                  placeholder={!departmentId ? "Seleccione un departamento" : "Todos"}
                  disabled={!departmentId}
                  zIndex={40}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Subtipo
                </label>

                <CustomSelect
                  value={incomeSubTypeId ?? ""}
                  onChange={(v) => {
                    setIncomeSubTypeId(v === "" ? undefined : Number(v))
                  }}
                  options={subTypeOptions}
                  placeholder={!incomeTypeId ? "Seleccione un tipo" : "Todos"}
                  disabled={!incomeTypeId}
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
                    if (!e.target.value) setForceTextEnd(true)
                  }}
                  onChange={(e) => setEnd(e.target.value || undefined)}
                  className="w-full rounded-2xl border-2 border-[#E4ECD2] bg-white p-3 text-[#33361D] focus:ring-2 focus:ring-[#5B732E] focus:border-[#5B732E] outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#FBFDF7] ring-1 ring-[#E8EEDB] p-5 md:p-6 mb-6">
            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3">
              <div className="md:ml-auto flex flex-wrap gap-3">
                <button
                  onClick={handlePreviewPDF}
                  className="flex-1 min-w-[140px] md:flex-none px-5 py-3 rounded-xl border-2 border-[#C19A3D] text-[#C19A3D] font-semibold hover:bg-[#FEF6E0] transition disabled:opacity-60"
                >
                  Ver PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 min-w-[160px] md:flex-none px-5 py-3 rounded-xl bg-[#C19A3D] text-white font-semibold hover:bg-[#C6A14B] transition disabled:opacity-50 shadow-sm"
                >
                  Descargar PDF
                </button>

                <button
                  onClick={handleExcelComparativo}
                  className="flex-1 min-w-[170px] md:flex-none px-5 py-3 rounded-xl border-2 border-[#2d6a4f] text-white bg-[#376a2d] font-semibold hover:bg-[#3c5c35] transition disabled:opacity-60"
                >
                  Descargar Excel
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
      <div className="rounded-2xl bg-[#F8F9F3] overflow-hidden shadow-sm">
        {/* ===== Header (solo desktop) ===== */}
        <div className="hidden md:block bg-[#EAEFE0] px-4 py-3">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 text-sm font-bold text-[#33361D]">
            <div>Subtipo</div>
            <div className="text-right">Real</div>
            <div className="text-right">Proyectado</div>
            <div className="text-right">Diferencia</div>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="bg-white">
          {rows.map((r: any, i: number) => (
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
              {/* Subtipo */}
              <div>
                <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                  Subtipo
                </span>
                <span className="font-medium">{r.name}</span>
              </div>

              {/* Real */}
              <div className="md:text-right">
                <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                  Real
                </span>
                <span className="tabular-nums whitespace-nowrap">
                  {crc(r.real)}
                </span>
              </div>

              {/* Proyectado */}
              <div className="md:text-right">
                <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                  Proyectado
                </span>
                <span className="font-medium text-[#5B732E] tabular-nums whitespace-nowrap">
                  {crc(r.projected)}
                </span>
              </div>

              {/* Diferencia */}
              <div className="md:text-right">
                <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                  Diferencia
                </span>
                <span className="font-bold text-[#C19A3D] tabular-nums whitespace-nowrap">
                  {crc(r.difference)}
                </span>
              </div>
            </div>
          ))}

          {rows.length === 0 && !reportQuery.isLoading && (
            <div className="py-10 text-center text-gray-400 font-medium">
              Sin resultados
            </div>
          )}

          {reportQuery.isLoading && (
            <div className="py-10 text-center text-gray-400 font-medium">
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
