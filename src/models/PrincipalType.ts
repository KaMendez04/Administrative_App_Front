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