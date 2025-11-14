import { useIncomeReport } from "../hooks/Budget/reports/useIncomeReport"
import { useSpendReport } from "../hooks/Budget/reports/useSpendReport"
import { crc } from "../utils/crcDateUtil"
import { BarChartSection } from "../components/dashboard/barChartSection"
import { PieChartSection } from "../components/dashboard/pieChartSection"
import { ModuleSummarySection } from "../components/dashboard/ModuleSummarySection"
import { useAssociatesSolicitudesPolling } from "../hooks/notification/useAssociatesSolicitudesPolling"
import { useInitial } from "../hooks/Budget/useInitial"
import { useFiscalYear } from "../hooks/Budget/useFiscalYear"
import { useState } from "react"

const COLORS = ["#6B8E3D", "#8BA84E", "#A5C46D", "#C19A3D", "#D4B55A", "#E8C77D"]

//Combina ingresos y egresos por departamento
function combineIncomeAndSpendByDepartment(
  incomeDepts: any[] = [],
  spendDepts: any[] = []
) {
  const deptMap = new Map<string, { ingresos: number; egresos: number }>();

  // Agregar TODOS los ingresos
  incomeDepts.forEach((dept) => {
    const name = dept.department || dept.departmentName || dept.name || "Sin Departamento";
    if (!deptMap.has(name)) {
      deptMap.set(name, { ingresos: 0, egresos: 0 });
    }
    deptMap.get(name)!.ingresos += dept.total || 0;
  });

  // Agregar TODOS los egresos
  spendDepts.forEach((dept) => {
    const name = dept.department || dept.departmentName || dept.name || "Sin Departamento";
    if (!deptMap.has(name)) {
      deptMap.set(name, { ingresos: 0, egresos: 0 });
    }
    deptMap.get(name)!.egresos += dept.total || 0;
  });

  // Convertir a array y ordenar
  return Array.from(deptMap.entries())
    .map(([name, values]) => ({
      name,
      ingresos: values.ingresos,
      egresos: values.egresos
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function DashboardPage() {
  useAssociatesSolicitudesPolling()

  // ✅ Obtener el año fiscal actual
  const { current: fiscalYear } = useFiscalYear()

  // ✅ Usar useInitial para obtener el balance correcto
  const [range] = useState({ startDate: '', endDate: '' });
  const { cards } = useInitial(range);
  
  // Período actual: últimos 30 días
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const currentPeriod = {
    start: thirtyDaysAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  }

  // Queries período actual
  const { data: incomeData, isLoading: loadingIncome } = useIncomeReport(currentPeriod)
  const { data: spendData, isLoading: loadingSpend } = useSpendReport(currentPeriod)

  const isLoading = loadingIncome || loadingSpend

  // ✅ CORREGIDO: Ahora combina TODOS los departamentos
  const barChartData = combineIncomeAndSpendByDepartment(
    incomeData?.totals?.byDepartment ?? [],
    spendData?.totals?.byDepartment ?? []
  );

  const pieChartData = (incomeData?.totals?.byDepartment ?? []).map((dept: any, index: number) => ({
    name: dept.department || dept.departmentName || dept.name,
    value: dept.total,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="mx-auto max-w-7xl p-6 md:p-10 space-y-8">
        {/* ✅ Usar el saldoRestante de useInitial */}
        <ModuleSummarySection 
          currentBalance={cards.saldoRestante} 
          fiscalYear={fiscalYear ?? undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartSection 
            data={barChartData}
            isLoading={isLoading}
            formatCurrency={crc}
          />

          <PieChartSection data={pieChartData} isLoading={isLoading} formatCurrency={crc} />
        </div>
      </div>
    </div>
  )
}