// pages/Budget/DashboardPage.tsx
import { useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { crc } from "../utils/crcDateUtil"
// ✅ Importar los hooks en lugar de las funciones directas
import { useIncomeReport } from "../hooks/Budget/reports/useIncomeReport"
import { useSpendReport } from "../hooks/Budget/reports/useSpendReport"
import { useExtraReport } from "../hooks/Budget/reports/useExtraReport"

const COLORS = ["#6B8E3D", "#8BA84E", "#A5C46D", "#C19A3D", "#D4B55A", "#E8C77D"]

export default function DashboardPage() {
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  // Período actual: últimos 30 días
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const currentPeriod = {
    start: thirtyDaysAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  }

  // Período anterior: 30 días antes del período actual
  const sixtyDaysAgo = new Date(today)
  sixtyDaysAgo.setDate(today.getDate() - 60)

  const previousPeriod = {
    start: sixtyDaysAgo.toISOString().split("T")[0],
    end: thirtyDaysAgo.toISOString().split("T")[0],
  }

  // ========== USAR LOS HOOKS EN LUGAR DE LAS FUNCIONES DIRECTAS ==========
  // Período actual
  const { 
    data: incomeData, 
    isLoading: loadingIncome 
  } = useIncomeReport(currentPeriod)

  const { 
    data: spendData, 
    isLoading: loadingSpend 
  } = useSpendReport(currentPeriod)

  const { 
    data: extraData 
  } = useExtraReport(currentPeriod)

  // Período anterior
  const { 
    data: prevIncomeData 
  } = useIncomeReport(previousPeriod)

  const { 
    data: prevSpendData 
  } = useSpendReport(previousPeriod)

  const { 
    data: prevExtraData 
  } = useExtraReport(previousPeriod)

  // ========== MÉTRICAS ACTUALES ==========
  const totalIncome = Number(incomeData?.totals?.total) || 0
  const totalSpend = Number(spendData?.totals?.total) || 0
  const balance = totalIncome - totalSpend
  const extraRemaining = Number(extraData?.totals?.totalRemaining) || 0

  // ========== MÉTRICAS PERÍODO ANTERIOR ==========
  const prevTotalIncome = Number(prevIncomeData?.totals?.total) || 0
  const prevTotalSpend = Number(prevSpendData?.totals?.total) || 0
  const prevBalance = prevTotalIncome - prevTotalSpend
  const prevExtraRemaining = Number(prevExtraData?.totals?.totalRemaining) || 0

  // ========== DETECTAR SI HAY DATOS PREVIOS ==========
  const hasPrevIncomeData = (prevIncomeData?.rows?.length ?? 0) > 0
  const hasPrevSpendData = (prevSpendData?.rows?.length ?? 0) > 0
  const hasPrevExtraData = (prevExtraData?.rows?.length ?? 0) > 0

  // ========== CALCULAR CAMBIOS PORCENTUALES ==========
  const calculateChange = (
    current: number,
    previous: number,
    hasPrevData: boolean
  ): {
    pctStr: string
    isPositive: boolean
    isZero: boolean
    noPreviousData: boolean
    directionWord?: "superior" | "inferior"
  } => {
    if (!hasPrevData) {
      return { pctStr: "0", isPositive: false, isZero: false, noPreviousData: true }
    }

    if (previous === 0 && current === 0) {
      return { pctStr: "0", isPositive: false, isZero: true, noPreviousData: false }
    }

    if (previous === 0 && current > 0) {
      return { pctStr: "100", isPositive: true, isZero: false, noPreviousData: false, directionWord: "superior" }
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
      directionWord: change >= 0 ? "superior" : "inferior",
    }
  }

  const incomeChange = calculateChange(totalIncome, prevTotalIncome, hasPrevIncomeData)
  const spendChange = calculateChange(totalSpend, prevTotalSpend, hasPrevSpendData)
  const balanceChange = calculateChange(balance, prevBalance, hasPrevIncomeData || hasPrevSpendData)
  const extraChange = calculateChange(extraRemaining, prevExtraRemaining, hasPrevExtraData)

  const isLoading = loadingIncome || loadingSpend

  // ========== PREPARAR DATOS PARA GRÁFICOS ==========
  const barChartData = (incomeData?.totals?.byDepartment ?? []).map((dept: any) => ({
    name: dept.department || dept.departmentName || dept.name,
    ingresos: dept.total,
    egresos:
      (spendData?.totals?.byDepartment ?? []).find(
        (s: any) =>
          (s.department || s.departmentName || s.name) === (dept.department || dept.departmentName || dept.name)
      )?.total ?? 0,
  }))

  const pieChartData = (incomeData?.totals?.byDepartment ?? []).map((dept: any, index: number) => ({
    name: dept.department || dept.departmentName || dept.name,
    value: dept.total,
    color: COLORS[index % COLORS.length],
  }))

  const totalPie = pieChartData.reduce((sum: number, item: any) => sum + item.value, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9F3] via-[#F3F4EE] to-[#EEF0E8]">
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        {/* Nota Explicativa Colapsable */}
        <div className="mb-6 bg-white rounded-2xl shadow-sm border border-[#E5E8DC] overflow-hidden">
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="w-full flex items-center gap-3 p-5 hover:bg-[#F8F9F3] transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F8F9F3] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#6B8E3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-bold text-[#3D4A1F]">¿Cómo se calculan estas métricas?</h3>
            </div>
            <svg 
              className={`w-5 h-5 text-[#6B7A4A] transition-transform ${isInfoOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isInfoOpen && (
            <div className="px-5 pb-5 pt-0">
              <div className="pl-13">
                <p className="text-xs text-[#6B7A4A] leading-relaxed">
                  Comparamos los <span className="font-semibold text-[#3D4A1F]">últimos 30 días</span> con los <span className="font-semibold text-[#3D4A1F]">30 días anteriores</span>. 
                  Los porcentajes muestran el cambio entre ambos períodos: 
                  <span className="inline-flex items-center gap-1 mx-1 font-semibold text-[#4A7C2F]">
                    <span className="text-sm">↑</span> verde
                  </span> 
                  indica mejora, 
                  <span className="inline-flex items-center gap-1 mx-1 font-semibold text-[#B91C1C]">
                    <span className="text-sm">↓</span> rojo
                  </span> 
                  indica disminución. Si aparece <span className="font-semibold text-[#6B7A4A]">"Sin datos previos"</span>, no hay registros del período anterior para comparar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Ingresos */}
          <div className="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#E5E8DC]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6B8E3D]/5 to-transparent rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="text-xs font-bold text-[#6B8E3D] tracking-wider uppercase mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B8E3D]"></div>
                Total Ingresos
              </div>
              <div className="text-2xl font-bold text-[#3D4A1F] mb-2 tracking-tight">
                {isLoading ? "..." : crc(totalIncome)}
              </div>
              {incomeChange.noPreviousData ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Datos nuevos (sin comparación)</span>
                </div>
              ) : incomeChange.isZero ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Sin variación vs. período pasado</span>
                </div>
              ) : (
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    incomeChange.isPositive ? "bg-[#E8F5E0] text-[#4A7C2F]" : "bg-[#FEF2F2] text-[#B91C1C]"
                  }`}
                  title={`${incomeChange.pctStr}% ${incomeChange.directionWord} al período pasado`}
                >
                  <span className="text-base">{incomeChange.isPositive ? "↑" : "↓"}</span>
                  <span>
                    {incomeChange.pctStr}% {incomeChange.directionWord} al período pasado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Total Egresos */}
          <div className="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#E5E8DC]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4B55A]/5 to-transparent rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="text-xs font-bold text-[#C19A3D] tracking-wider uppercase mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C19A3D]"></div>
                Total Egresos
              </div>
              <div className="text-2xl font-bold text-[#3D4A1F] mb-2 tracking-tight">
                {isLoading ? "..." : crc(totalSpend)}
              </div>
              {spendChange.noPreviousData ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Datos nuevos (sin comparación)</span>
                </div>
              ) : spendChange.isZero ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Sin variación vs. período pasado</span>
                </div>
              ) : (
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    spendChange.isPositive ? "bg-[#E8F5E0] text-[#4A7C2F]" : "bg-[#FEF2F2] text-[#B91C1C]"
                  }`}
                  title={`${spendChange.pctStr}% ${spendChange.directionWord} al período pasado`}
                >
                  <span className="text-base">{spendChange.isPositive ? "↑" : "↓"}</span>
                  <span>
                    {spendChange.pctStr}% {spendChange.directionWord} al período pasado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Balance */}
          <div
            className={`group relative rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border ${
              balance >= 0 ? "bg-white border-[#E5E8DC]" : "bg-white border-[#E5E8DC]"
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 ${
                balance >= 0
                  ? "bg-gradient-to-br from-[#6B8E3D]/5 to-transparent"
                  : "bg-gradient-to-br from-[#D4B55A]/5 to-transparent"
              }`}
            ></div>
            <div className="relative">
              <div
                className={`text-xs font-bold tracking-wider uppercase mb-2 flex items-center gap-2 ${
                  balance >= 0 ? "text-[#6B8E3D]" : "text-[#C19A3D]"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${balance >= 0 ? "bg-[#6B8E3D]" : "bg-[#C19A3D]"}`}></div>
                Balance Neto
              </div>
              <div
                className={`text-2xl font-bold mb-2 tracking-tight ${
                  balance >= 0 ? "text-[#3D4A1F]" : "text-[#3D4A1F]"
                }`}
              >
                {isLoading ? "..." : crc(balance)}
              </div>
              {balanceChange.noPreviousData ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Datos nuevos (sin comparación)</span>
                </div>
              ) : balanceChange.isZero ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Sin variación vs. período pasado</span>
                </div>
              ) : (
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    balanceChange.isPositive ? "bg-[#E8F5E0] text-[#4A7C2F]" : "bg-[#FEF2F2] text-[#B91C1C]"
                  }`}
                  title={`${balanceChange.pctStr}% ${balanceChange.directionWord} al período pasado`}
                >
                  <span className="text-base">{balanceChange.isPositive ? "↑" : "↓"}</span>
                  <span>
                    {balanceChange.pctStr}% {balanceChange.directionWord} al período pasado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Extraordinarios */}
          <div className="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#E5E8DC]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E8C77D]/5 to-transparent rounded-full -mr-12 -mt-12"></div>
            <div className="relative">
              <div className="text-xs font-bold text-[#D4B55A] tracking-wider uppercase mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4B55A]"></div>
                Extraordinarios
              </div>
              <div className="text-2xl font-bold text-[#3D4A1F] mb-2 tracking-tight">{crc(extraRemaining)}</div>
              {extraChange.noPreviousData ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Datos nuevos (sin comparación)</span>
                </div>
              ) : extraChange.isZero ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
                  <span>Sin variación vs. período pasado</span>
                </div>
              ) : (
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    extraChange.isPositive ? "bg-[#E8F5E0] text-[#4A7C2F]" : "bg-[#FEF2F2] text-[#B91C1C]"
                  }`}
                  title={`${extraChange.pctStr}% ${extraChange.directionWord} al período pasado`}
                >
                  <span className="text-base">{extraChange.isPositive ? "↑" : "↓"}</span>
                  <span>
                    {extraChange.pctStr}% {extraChange.directionWord} al período pasado
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E8DC] hover:shadow-md transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#3D4A1F] mb-1 tracking-tight">Comparativa por Departamento</h2>
              <p className="text-sm text-[#6B7A4A] font-medium">Ingresos vs Egresos</p>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-8 border-3 border-[#6B8E3D] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[#6B7A4A] font-medium text-sm">Cargando datos...</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barChartData} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6B8E3D" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#8BA84E" stopOpacity={0.85} />
                    </linearGradient>
                    <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C19A3D" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#D4B55A" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E8DC" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#6B7A4A", fontWeight: 600 }}
                    axisLine={{ stroke: "#E5E8DC" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7A4A", fontWeight: 600 }}
                    axisLine={{ stroke: "#E5E8DC" }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => crc(value)}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E8DC",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                    cursor={{ fill: "rgba(107, 142, 61, 0.04)" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                  <Bar
                    dataKey="egresos"
                    fill="url(#colorEgresos)"
                    name="Egresos"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="ingresos"
                    fill="url(#colorIngresos)"
                    name="Ingresos"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico de Dona */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E8DC] hover:shadow-md transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#3D4A1F] mb-1 tracking-tight">Distribución de Ingresos</h2>
              <p className="text-sm text-[#6B7A4A] font-medium">Por departamento</p>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-[#6B8E3D] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[#6B7A4A] font-medium text-sm">Cargando datos...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <defs>
                        {COLORS.map((color, idx) => (
                          <linearGradient key={idx} id={`gradient-${idx}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.75} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry: any, index: any) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#gradient-${index % COLORS.length})`}
                            stroke="#fff"
                            strokeWidth={3}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => crc(value)}
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E8DC",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Leyenda personalizada */}
                <div className="flex-1 space-y-2">
                  {pieChartData.map((item: any, index: any) => {
                    const percentage = totalPie > 0 ? ((item.value / totalPie) * 100).toFixed(1) : "0"
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9F3] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-semibold text-[#3D4A1F]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#6B8E3D]">{percentage}%</span>
                          <span className="text-xs text-[#6B7A4A] font-medium">{crc(item.value)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}