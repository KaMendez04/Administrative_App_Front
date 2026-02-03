import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { pSpendService } from "../../../services/Budget/reportsPSpend/pSpendReportService"
import { CustomSelect } from "../../../components/CustomSelect"

// ✅ solo llamamos lo que ya tenés
import { usePagination, PaginationBar } from "../../../components/ui/pagination"

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

// ======= Componente =======
export default function PSpendProjectionsPage() {
  // ------- filtros (simples en local como en tu ejemplo) -------
  const [submitted, setSubmitted] = useState<any>({})
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [departmentId, setDepartmentId] = useState<number | undefined>()
  const [spendTypeId, setSpendTypeId] = useState<number | undefined>()
  const [spendSubTypeId, setSpendSubTypeId] = useState<number | undefined>()

  const filters = { start, end, departmentId, spendTypeId, spendSubTypeId }

  // Auto-aplicar filtros (sin botones)
  useEffect(() => {
    setSubmitted({
      start: start || undefined,
      end: end || undefined,
      departmentId: departmentId || undefined,
      spendTypeId: spendTypeId || undefined,
      spendSubTypeId: spendSubTypeId || undefined,
    })
  }, [start, end, departmentId, spendTypeId, spendSubTypeId])

  // ------- catálogos -------
  // departamentos (siempre)
  const { data: departmentsData = [], isFetching: depsLoading } = useQuery({
    queryKey: ["pSpendDepartments"],
    queryFn: pSpendService.listDepartments, // <- usa el service de pSpend
    refetchOnMount: "always",
    staleTime: 0,
  })
  const departments = ensureArray<any>(departmentsData)

  // tipos por departamento (habilitado solo si hay depto)
  const { data: typesData = [], isFetching: typesLoading } = useQuery({
    queryKey: ["pSpendTypes", departmentId ?? null],
    queryFn: () => pSpendService.listSpendTypes(departmentId),
    enabled: !!departmentId,
    refetchOnMount: "always",
    staleTime: 0,
  })
  const spendTypes = ensureArray<any>(typesData).map((t: any) => ({
    id: t.id ?? t.spendTypeId,
    name: t.name ?? t.spendTypeName,
  }))

  //  subtipos por tipo (habilitado solo si hay tipo)
  const { data: subTypesData = [], isFetching: subTypesLoading } = useQuery({
    queryKey: ["pSpendSubTypes", spendTypeId ?? null],
    queryFn: () => pSpendService.listSpendSubTypes(spendTypeId),
    enabled: !!spendTypeId,
    refetchOnMount: "always",
    staleTime: 0,
  })
  const spendSubTypes = ensureArray<any>(subTypesData).map((st: any) => ({
    id: st.id ?? st.spendSubTypeId,
    name: st.name ?? st.spendSubTypeName,
  }))

  useEffect(() => {
    setSpendTypeId(undefined)
    setSpendSubTypeId(undefined)
  }, [departmentId])

  useEffect(() => {
    setSpendSubTypeId(undefined)
  }, [spendTypeId])

  const { data: reportData, isFetching: reportLoading } = useQuery({
    queryKey: ["pSpendCompareReport", submitted],
    queryFn: () => pSpendService.getSpendReport(submitted),
  })
  const rows = ensureArray<any>(reportData?.rows)
  const totals = reportData?.totals ?? { real: 0, projected: 0, difference: 0 }

  // ------- UI: placeholder dd/mm/aaaa en inputs date -------
  const [forceTextStart, setForceTextStart] = useState(!start)
  const [forceTextEnd, setForceTextEnd] = useState(!end)

  // ------- acciones -------
  const handlePreviewPDF = () => pSpendService.previewSpendComparePDF(filters)
  const handleDownloadPDF = () => pSpendService.downloadSpendComparePDF(filters)
  const handleExcelComparativo = () =>
    pSpendService.downloadSpendCompareExcel(filters)

  //  options para CustomSelect
  const departmentOptions = [
    { value: "", label: depsLoading ? "Cargando..." : "Todos" },
    ...departments.map((d: any) => ({
      value: d.id ?? d.departmentId,
      label: d.name ?? d.departmentName,
    })),
  ]

  const typeOptions = [
    {
      value: "",
      label: !departmentId
        ? "Seleccione un departamento"
        : typesLoading
          ? "Cargando..."
          : "Todos",
    },
    ...spendTypes.map((t) => ({ value: t.id, label: t.name })),
  ]

  const subTypeOptions = [
    {
      value: "",
      label: !spendTypeId
        ? "Seleccione un tipo"
        : subTypesLoading
          ? "Cargando..."
          : "Todos",
    },
    ...spendSubTypes.map((st) => ({ value: st.id, label: st.name })),
  ]

  // ✅ Paginación (mínimo código aquí)
  const { page, setPage, totalPages, pagedItems, pageItems } = usePagination(
    rows,
    10,
    [start, end, departmentId, spendTypeId, spendSubTypeId, reportData]
  )

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="rounded-3xl bg-white p-6 md:p-10">
          {/* Tarjetas superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="rounded-2xl bg-[#F8F9F3] p-6 ring-1 ring-[#EAEFE0]">
              <div className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">
                Total egresos (Proyectado)
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Departamento */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Departamento
                </label>

                <CustomSelect
                  value={departmentId ?? ""}
                  onChange={(v) => {
                    const nextDept = v === "" ? undefined : Number(v)
                    setDepartmentId(nextDept)
                    setSpendTypeId(undefined)
                    setSpendSubTypeId(undefined)
                  }}
                  options={departmentOptions}
                  placeholder="Todos"
                  disabled={false}
                  zIndex={50}
                />
              </div>

              {/* Tipo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Tipo
                </label>

                <CustomSelect
                  value={spendTypeId ?? ""}
                  onChange={(v) => {
                    const nextType = v === "" ? undefined : Number(v)
                    setSpendTypeId(nextType)
                    setSpendSubTypeId(undefined)
                  }}
                  options={typeOptions}
                  placeholder={!departmentId ? "Seleccione un departamento" : "Todos"}
                  disabled={!departmentId}
                  zIndex={40}
                />
              </div>

              {/* Subtipo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#33361D] mb-1.5">
                  Subtipo
                </label>

                <CustomSelect
                  value={spendSubTypeId ?? ""}
                  onChange={(v) =>
                    setSpendSubTypeId(v === "" ? undefined : Number(v))
                  }
                  options={subTypeOptions}
                  placeholder={!spendTypeId ? "Seleccione un tipo" : "Todos"}
                  disabled={!spendTypeId}
                  zIndex={30}
                />
              </div>

              {/* Fecha de inicio */}
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

              {/* Fecha de fin */}
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

          {/* Acciones */}
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
                    <span className="tabular-nums whitespace-nowrap text-[#5B732E]">
                      {crc(r.real)}
                    </span>
                  </div>

                  {/* Proyectado */}
                  <div className="md:text-right">
                    <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                      Proyectado
                    </span>
                    <span className="tabular-nums whitespace-nowrap font-medium text-[#5B732E]">
                      {crc(r.projected)}
                    </span>
                  </div>

                  {/* Diferencia */}
                  <div className="md:text-right">
                    <span className="md:hidden block text-xs font-semibold text-[#6B7280]">
                      Diferencia
                    </span>
                    <span className="tabular-nums whitespace-nowrap font-bold text-[#C19A3D]">
                      {crc(r.difference)}
                    </span>
                  </div>
                </div>
              ))}

              {rows.length === 0 && !reportLoading && (
                <div className="py-10 text-center text-gray-400 font-medium">
                  Sin resultados
                </div>
              )}

              {reportLoading && (
                <div className="py-10 text-center text-gray-400 font-medium">
                  Cargando...
                </div>
              )}
            </div>

            {/* ✅ Paginación */}
            {!reportLoading && rows.length > 0 && totalPages > 1 && (
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
    </div>
  )
}
