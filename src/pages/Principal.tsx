import { useIncomeReport } from "../hooks/Budget/reports/useIncomeReport"
import { useSpendReport } from "../hooks/Budget/reports/useSpendReport"
import { useExtraReport } from "../hooks/Budget/reports/useExtraReport"
import { crc } from "../utils/crcDateUtil"
import { BarChartSection } from "../components/dashboard/barChartSection"
import { PieChartSection } from "../components/dashboard/pieChartSection"
import { ModuleSummarySection } from "../components/dashboard/ModuleSummarySection"

const COLORS = ["#6B8E3D", "#8BA84E", "#A5C46D", "#C19A3D", "#D4B55A", "#E8C77D"]

// Función auxiliar para calcular cambios
function calculateChange(current: number, previous: number, hasPrevData: boolean) {
  if (!hasPrevData) {
    return { pctStr: "0", isPositive: false, isZero: false, noPreviousData: true }
  }

  if (previous === 0 && current === 0) {
    return { pctStr: "0", isPositive: false, isZero: true, noPreviousData: false }
  }

  if (previous === 0 && current > 0) {
    return { pctStr: "100", isPositive: true, isZero: false, noPreviousData: false, directionWord: "superior" as const }
  }

  const change = ((current - previous) / previous) * 100
  const abs = Math.abs(change)

  if (abs < 0.1) {
    return { pctStr: "0", isPositive: false, isZero: true, noPreviousData: false }
  }

  return {
    pctStr: abs.toFixed(1),
    isPositive: change >= 0,
    isZero: false,
    noPreviousData: false,
    directionWord: (change >= 0 ? "superior" : "inferior") as "superior" | "inferior",
  }
}

export default function DashboardPage() {
  // Período actual: últimos 30 días
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const currentPeriod = {
    start: thirtyDaysAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  }

  // Período anterior
  const sixtyDaysAgo = new Date(today)
  sixtyDaysAgo.setDate(today.getDate() - 60)

  const previousPeriod = {
    start: sixtyDaysAgo.toISOString().split("T")[0],
    end: thirtyDaysAgo.toISOString().split("T")[0],
  }

  // Queries período actual
  const { data: incomeData, isLoading: loadingIncome } = useIncomeReport(currentPeriod)
  const { data: spendData, isLoading: loadingSpend } = useSpendReport(currentPeriod)
  const { data: extraData } = useExtraReport(currentPeriod)

  // Queries período anterior
  const { data: prevIncomeData } = useIncomeReport(previousPeriod)
  const { data: prevSpendData } = useSpendReport(previousPeriod)
  const { data: prevExtraData } = useExtraReport(previousPeriod)

  // Métricas actuales
  const totalIncome = Number(incomeData?.totals?.total) || 0
  const totalSpend = Number(spendData?.totals?.total) || 0
  const balance = totalIncome - totalSpend
  const extraRemaining = Number(extraData?.totals?.totalRemaining) || 0

  // Métricas período anterior
  const prevTotalIncome = Number(prevIncomeData?.totals?.total) || 0
  const prevTotalSpend = Number(prevSpendData?.totals?.total) || 0
  const prevBalance = prevTotalIncome - prevTotalSpend
  const prevExtraRemaining = Number(prevExtraData?.totals?.totalRemaining) || 0

  // Detectar datos previos
  const hasPrevIncomeData = (prevIncomeData?.rows?.length ?? 0) > 0
  const hasPrevSpendData = (prevSpendData?.rows?.length ?? 0) > 0
  const hasPrevExtraData = (prevExtraData?.rows?.length ?? 0) > 0

  // Calcular cambios
  const incomeChange = calculateChange(totalIncome, prevTotalIncome, hasPrevIncomeData)
  const spendChange = calculateChange(totalSpend, prevTotalSpend, hasPrevSpendData)
  const balanceChange = calculateChange(balance, prevBalance, hasPrevIncomeData || hasPrevSpendData)
  const extraChange = calculateChange(extraRemaining, prevExtraRemaining, hasPrevExtraData)

  const isLoading = loadingIncome || loadingSpend

  // Preparar datos para gráficos
  const barChartData = (incomeData?.totals?.byDepartment ?? []).map((dept: any) => ({
    name: dept.department || dept.departmentName || dept.name,
    ingresos: dept.total,
    egresos:
      (spendData?.totals?.byDepartment ?? []).find(
        (s: any) =>
          (s.department || s.departmentName || s.name) === (dept.department || dept.departmentName || dept.name),
      )?.total ?? 0,
  }))

  const pieChartData = (incomeData?.totals?.byDepartment ?? []).map((dept: any, index: number) => ({
    name: dept.department || dept.departmentName || dept.name,
    value: dept.total,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="mx-auto max-w-7xl p-6 md:p-10 space-y-8">
        <ModuleSummarySection currentBalance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartSection data={barChartData} isLoading={isLoading} formatCurrency={crc} />

          <PieChartSection data={pieChartData} isLoading={isLoading} formatCurrency={crc} />
        </div>
      </div>
    </div>
  )
}
