import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BarChartSectionProps {
  data: Array<{ name: string; ingresos: number; egresos: number }>
  isLoading: boolean
  formatCurrency: (value: number) => string
}

export function BarChartSection({ data, isLoading, formatCurrency }: BarChartSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E8DC] hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#3D4A1F] mb-1 tracking-tight">
          Comparativa por Departamento
        </h2>
        <p className="text-sm text-[#6B7A4A] font-medium">Ingresos vs Egresos</p>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-8 border-3 border-[#6B8E3D] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#6B7A4A] font-medium text-sm">Cargando datos...</span>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
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
              formatter={(value: number) => formatCurrency(value)}
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
  )
}