// src/services/reportService.ts
 // <-- ajusta si tu archivo está en otra ruta
import type {
  IncomeFullResponse,
  IncomeReportFilters,
  IncomeRow,
  IncomeTotals,
} from "../models/Budget/reports/income";
import apiConfig from "./apiConfig";

export async function getIncomeFull(filters: IncomeReportFilters): Promise<IncomeFullResponse> {
  const { data } = await apiConfig.get("/report/income/full", { params: filters });
  return data as IncomeFullResponse;
}

export async function getIncomeTable(filters: IncomeReportFilters): Promise<IncomeRow[]> {
  const { data } = await apiConfig.get("/report/income/table", { params: filters });
  return data as IncomeRow[];
}

export async function getIncomeSummary(filters: IncomeReportFilters): Promise<IncomeTotals> {
  const { data } = await apiConfig.get("/report/income/summary", { params: filters });
  return data as IncomeTotals;
}
