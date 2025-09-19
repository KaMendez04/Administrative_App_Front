import { useQuery } from "@tanstack/react-query";
import type { IncomeFullResponse, IncomeReportFilters } from "../../../models/Budget/reports/income";
import { getIncomeFull } from "../../../services/reportService";


export function useIncomeReport(filters: IncomeReportFilters) {
  return useQuery<IncomeFullResponse>({
    queryKey: ["report", "income", "full", filters],
    queryFn: () => getIncomeFull(filters),
    staleTime: 60_000, // 1 min
    enabled: !!filters.start && !!filters.end, // pide al menos rango
  });
}
