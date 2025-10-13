import { useInitial } from "../../hooks/Budget/useInitial"
import { useFiscalYear } from "../../hooks/Budget/useFiscalYear"
import { DataTable, StatCard } from "../../components/Budget/InitialComponents"
import FiscalYearSelector from "../../components/common/FiscalYearSelector"

export default function InitialPage() {
  const { current } = useFiscalYear()
  const { loading, error, cards, incomeRows, spendRows } = useInitial()

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-[#5A5A4A]">Cargando información...</div>
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8B4513]">Error al cargar los datos.</div>
    )

  const incomeTotalReal = incomeRows.reduce((s, r) => s + r.spent, 0)
  const incomeTotalProjected = incomeRows.reduce((s, r) => s + r.projected, 0)
  const incomeTotalDiff = incomeTotalReal - incomeTotalProjected

  const spendTotalReal = spendRows.reduce((s, r) => s + r.spent, 0)
  const spendTotalProjected = spendRows.reduce((s, r) => s + r.projected, 0)
  const spendTotalDiff = spendTotalReal - spendTotalProjected

  return (
    <div key={current?.id ?? "nofy"} className="min-h-screen bg-[#f3f8ef]">
      <div className="mx-auto max-w-6xl p-4 md:p-8 bg-[#f3f8ef]" >
        <div className="rounded-2xl bg-white shadow-sm p-6 md:p-10">
          <div className="flex justify-end mb-6">
            <FiscalYearSelector />
          </div>

          {/* ====== Cards métricas ====== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard title="Total de egresos" value={cards.totalGastado} color="red" icon="down" />
            <StatCard title="Total de Ingresos" value={cards.totalIngresos} color="green" icon="up" />
            <StatCard title="Saldo Restante" value={cards.saldoRestante} color="blue" icon="bars" />
          </div>

          {/* ====== Tablas ====== */}
          <DataTable
            title="Ingresos"
            rows={incomeRows}
            realLabel="Ingresos Reales"
            projLabel="Proyección de Ingresos"
            totalReal={incomeTotalReal}
            totalProjected={incomeTotalProjected}
            totalDiff={incomeTotalDiff}
            context="income"
          />
          <DataTable
            title="Egresos"
            rows={spendRows}
            realLabel="Egresos Reales"
            projLabel="Proyección de Egresos"
            totalReal={spendTotalReal}
            totalProjected={spendTotalProjected}
            totalDiff={spendTotalDiff}
            context="spend"
          />
        </div>
      </div>
    </div>
  )
}