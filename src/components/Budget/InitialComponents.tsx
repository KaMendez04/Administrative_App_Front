import { TrendingDown, TrendingUp, BarChart3 } from "lucide-react"
import type { Row } from "../../models/Budget/initialType"
import type { ColumnDef } from "@tanstack/react-table"
import { GenericTable } from "../GenericTable"

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0)

export function StatCard({
  title,
  value,
  color,
  icon,
}: {
  title: string
  value: number
  color: "red" | "green" | "blue"
  icon: "down" | "up" | "bars"
}) {
  const palette =
    color === "red"
      ? { text: "text-[#5B732E]", ring: "ring-[#EAEFE0]", icon: "text-[#556B2F]", bg: "bg-[#F8F9F3]" }
      : color === "green"
        ? { text: "text-[#5B732E]", ring: "ring-[#EAEFE0]", icon: "text-[#556B2F]", bg: "bg-[#EAEFE0]" }
        : { text: "text-[#C19A3D]", ring: "ring-[#FEF6E0]", icon: "text-[#C6A14B]", bg: "bg-[#FEF6E0]" }

  return (
    <div className={`rounded-2xl ${palette.bg} ring-1 ${palette.ring} shadow-sm p-5`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold text-[#556B2F] tracking-wider uppercase">{title}</p>
        {icon === "down" && <TrendingDown className={`h-5 w-5 ${palette.icon}`} />}
        {icon === "up" && <TrendingUp className={`h-5 w-5 ${palette.icon}`} />}
        {icon === "bars" && <BarChart3 className={`h-5 w-5 ${palette.icon}`} />}
      </div>
      <div className={`mt-2 text-3xl font-bold tracking-wide ${palette.text}`}>{crc(value)}</div>
    </div>
  )
}

/* ✅ NUEVA LÓGICA:
   Positivo = verde
   Negativo = amarillo
   Igual para Ingresos y Egresos
*/
export function DiffBadge({ value }: { value: number }) {
  const isPositive = value >= 0

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isPositive
          ? "bg-[#EAEFE0] text-[#556B2F] ring-1 ring-[#5B732E]/20" // verde
          : "bg-[#FEF6E0] text-[#C19A3D] ring-1 ring-[#C6A14B]/20", // amarillo
      ].join(" ")}
    >
      {crc(value)}
    </span>
  )
}

export function DataTable({
  title,
  rows,
  realLabel,
  projLabel,
  totalReal,
  totalProjected,
  totalDiff,
}: {
  title: string
  rows: Row[]
  realLabel: string
  projLabel: string
  totalReal: number
  totalProjected: number
  totalDiff: number
}) {
  type TableRow = Row & { __isTotal?: boolean }

  // Desktop: incluye Totales dentro de la tabla
  const dataDesktop: TableRow[] = [
    ...(rows ?? []),
    {
      department: "Totales",
      spent: totalReal,
      projected: totalProjected,
      __isTotal: true,
    } as TableRow,
  ]

  // Mobile: solo filas normales
  const dataMobile: TableRow[] = [...(rows ?? [])] as TableRow[]

  const columns: ColumnDef<TableRow, any>[] = [
    {
      header: "Departamentos",
      accessorKey: "department",
      cell: ({ row }) => (
        <span className="text-[#33361D] font-medium">{row.original.department}</span>
      ),
    },
    {
      header: realLabel,
      accessorKey: "spent",
      cell: ({ row }) => (
        <span className="text-[#556B2F]">{crc(row.original.spent)}</span>
      ),
    },
    {
      header: projLabel,
      accessorKey: "projected",
      cell: ({ row }) => (
        <span className="text-[#556B2F]">{crc(row.original.projected)}</span>
      ),
    },
    {
      header: "Diferencia",
      id: "diff",
      cell: ({ row }) => {
        const isTotal = !!row.original.__isTotal
        const value = isTotal
          ? totalDiff
          : row.original.spent - row.original.projected

        return <DiffBadge value={value} />
      },
    },
  ]

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-bold text-[#33361D]">{title}</h3>

      <div className="overflow-hidden rounded-2xl ring-1 ring-[#EAEFE0] bg-white shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <GenericTable<TableRow>
            data={dataDesktop}
            columns={columns}
            isLoading={false}
          />
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          <GenericTable<TableRow>
            data={dataMobile}
            columns={columns}
            isLoading={false}
          />
        </div>
      </div>

      {/* Totales SOLO en mobile */}
      <div className="md:hidden mt-3 rounded-2xl border border-[#EAEFE0] bg-[#F8F9F3] p-3 shadow-sm">
        <div className="grid grid-cols-12 gap-2 items-start">
          <div className="col-span-5 text-[11px] font-bold text-[#5B732E] uppercase tracking-wider">
            Departamentos
          </div>
          <div className="col-span-7 text-sm font-bold text-[#2E321B]">
            Totales
          </div>
        </div>

        <div className="mt-2 grid grid-cols-12 gap-2 items-start">
          <div className="col-span-5 text-[11px] font-bold text-[#5B732E] uppercase tracking-wider">
            {realLabel}
          </div>
          <div className="col-span-7 text-sm font-bold text-[#2E321B]">
            {crc(totalReal)}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-12 gap-2 items-start">
          <div className="col-span-5 text-[11px] font-bold text-[#5B732E] uppercase tracking-wider">
            {projLabel}
          </div>
          <div className="col-span-7 text-sm font-bold text-[#2E321B]">
            {crc(totalProjected)}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-12 gap-2 items-start">
          <div className="col-span-5 text-[11px] font-bold text-[#5B732E] uppercase tracking-wider">
            Diferencia
          </div>
          <div className="col-span-7">
            <DiffBadge value={totalDiff} />
          </div>
        </div>
      </div>
    </div>
  )
}
