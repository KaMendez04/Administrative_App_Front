import { TrendingDown, TrendingUp, BarChart3 } from "lucide-react"
import type { Row } from "../../models/Budget/initialType"

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

export function DiffBadge({ value, context }: { value: number; context: "income" | "spend" }) {
  let isGood: boolean

  if (context === "income") {
    isGood = value >= 0
  } else {
    isGood = value <= 0
  }

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isGood
          ? "bg-[#EAEFE0] text-[#556B2F] ring-1 ring-[#5B732E]/20"
          : "bg-[#FEF6E0] text-[#C19A3D] ring-1 ring-[#C6A14B]/20",
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
  context = "income",
}: {
  title: string
  rows: Row[]
  realLabel: string
  projLabel: string
  totalReal: number
  totalProjected: number
  totalDiff: number
  context?: "income" | "spend"
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-bold text-[#33361D]">{title}</h3>
      <div className="overflow-hidden rounded-2xl ring-1 ring-[#EAEFE0] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-[#EAEFE0]">
          <thead className="bg-[#F8F9F3]">
            <tr className="text-left text-sm text-[#556B2F]">
              <th className="px-5 py-3 font-semibold">Departamentos</th>
              <th className="px-5 py-3 font-semibold">{realLabel}</th>
              <th className="px-5 py-3 font-semibold">{projLabel}</th>
              <th className="px-5 py-3 font-semibold">Diferencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEFE0] text-sm">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[#F8F9F3] transition">
                <td className="px-5 py-3 text-[#33361D] font-medium">{r.department}</td>
                <td className="px-5 py-3 text-[#556B2F]">{crc(r.spent)}</td>
                <td className="px-5 py-3 text-[#556B2F]">{crc(r.projected)}</td>
                <td className="px-5 py-3">
                  <DiffBadge value={r.spent - r.projected} context={context} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-[#556B2F]/60" colSpan={4}>
                  Sin datos por ahora.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-[#F8F9F3]">
            <tr className="text-sm font-bold text-[#33361D]">
              <td className="px-5 py-3">Totales</td>
              <td className="px-5 py-3">{crc(totalReal)}</td>
              <td className="px-5 py-3">{crc(totalProjected)}</td>
              <td className="px-5 py-3">
                <DiffBadge value={totalDiff} context={context} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}