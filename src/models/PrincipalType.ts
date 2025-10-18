import type { LucideIcon } from "lucide-react"

export interface ChangeIndicator {
  pctStr: string
  isPositive: boolean
  isZero: boolean
  noPreviousData: boolean
  directionWord?: "superior" | "inferior"
}

export interface MetricCardProps {
  title: string
  value: string
  change: ChangeIndicator
  color: string
  isLoading?: boolean
  isBalance?: boolean
  balanceValue?: number
}

export interface PieChartSectionProps {
  data: Array<{ name: string; value: number; color: string }>
  isLoading: boolean
  formatCurrency: (value: number) => string
}

export interface ModuleCardProps {
  title: string
  description: string
  subtitle?: string | number
  icon: LucideIcon
  route: string
  primaryAction: string
  isLoading?: boolean
}