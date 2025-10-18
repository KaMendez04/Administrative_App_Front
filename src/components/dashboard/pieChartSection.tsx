import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer } from "recharts"
import type { PieChartSectionProps } from "../../models/PrincipalType"

const COLORS = ["#6B8E3D", "#8BA84E", "#A5C46D", "#C19A3D", "#D4B55A", "#E8C77D"]



export function PieChartSection({ data, isLoading, formatCurrency }: PieChartSectionProps) {
  const totalPie = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E8DC] hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#3D4A1F] mb-1 tracking-tight">
          Distribución de Ingresos
        </h2>
        <p className="text-sm text-[#6B7A4A] font-medium">Por departamento</p>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#6B8E3D] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#6B7A4A] font-medium text-sm">Cargando datos...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <PieResponsiveContainer width="100%" height={220}>
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
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index % COLORS.length})`}
                      stroke="#fff"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <PieTooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E8DC",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                />
              </PieChart>
            </PieResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {data.map((item, index) => {
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
                    <span className="text-xs text-[#6B7A4A] font-medium">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
