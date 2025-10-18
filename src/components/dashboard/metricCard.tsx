import type { MetricCardProps } from "../../models/PrincipalType"

export function MetricCard({ 
  title, 
  value, 
  change, 
  color, 
  isLoading, 
  isBalance,
  balanceValue = 0 
}: MetricCardProps) {
  const gradientColor = isBalance 
    ? (balanceValue >= 0 ? "#6B8E3D" : "#C19A3D")
    : color

  return (
    <div className="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#E5E8DC]">
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12"
        style={{
          background: `linear-gradient(to bottom right, ${gradientColor}0D, transparent)`
        }}
      />
      
      <div className="relative">
        <div 
          className="text-xs font-bold tracking-wider uppercase mb-2 flex items-center gap-2"
          style={{ color }}
        >
          <div 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: color }}
          />
          {title}
        </div>
        
        <div className="text-2xl font-bold text-[#3D4A1F] mb-2 tracking-tight">
          {isLoading ? "..." : value}
        </div>
        
        {change.noPreviousData ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
            <span>Datos nuevos (sin comparación)</span>
          </div>
        ) : change.isZero ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F3F4EE] text-[#6B7A4A]">
            <span>Sin variación vs. período pasado</span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
              change.isPositive ? "bg-[#E8F5E0] text-[#4A7C2F]" : "bg-[#FEF2F2] text-[#B91C1C]"
            }`}
            title={`${change.pctStr}% ${change.directionWord} al período pasado`}
          >
            <span className="text-base">{change.isPositive ? "↑" : "↓"}</span>
            <span>
              {change.pctStr}% {change.directionWord} al período pasado
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
