// src/services/Budget/initialService.ts
import {
  mapIncomeRows,
  mapSpendRows,
  type ApiIncomeByDept,
  type ApiSpendByDept,
  type CardStats,
  type Row,
} from "../../models/Budget/initialType";
import apiConfig from "../../apiConfig/apiConfig";

const HOME_SUMMARY_URL = "/home/summary";  // Cards
const HOME_INCOMES_URL = "/home/incomes";  // Tabla ingresos
const HOME_SPENDS_URL  = "/home/spends";   // Tabla egresos

type Range = { startDate?: string; endDate?: string };
type GroupBy = "department" | "type" | "subtype";

// helper para armar querystring limpio
const qs = (obj: Record<string, any>) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

export async function fetchIncomeByDepartment(
  params: { groupBy?: GroupBy } & Range = {}
): Promise<Row[]> {
  const query = qs({ groupBy: params.groupBy ?? "department", ...params });
  const { data } = await apiConfig.get<ApiIncomeByDept[]>(
    `${HOME_INCOMES_URL}${query ? `?${query}` : ""}`
  );
  return mapIncomeRows(data);
}

export async function fetchSpendByDepartment(
  params: { groupBy?: GroupBy } & Range = {}
): Promise<Row[]> {
  const query = qs({ groupBy: params.groupBy ?? "department", ...params });
  const { data } = await apiConfig.get<ApiSpendByDept[]>(
    `${HOME_SPENDS_URL}${query ? `?${query}` : ""}`
  );
  return mapSpendRows(data);
}

export async function fetchCardStats(params: Range = {}): Promise<CardStats> {
  const query = qs(params);
  const { data } = await apiConfig.get<{
    incomes: number;
    spends: number;
    balance: number;
    projectedIncomes: number;
    projectedSpends: number;
    projectedBalance: number;
  }>(`${HOME_SUMMARY_URL}${query ? `?${query}` : ""}`);

  // ✅ Calcular el balance correcto: Ingresos Reales - Egresos Totales
  const saldoRestante = data.incomes - data.spends;

  return {
    totalGastado: data.spends,
    totalIngresos: data.incomes,
    saldoRestante: saldoRestante,
  };
}
export const initialService = {
  fetchIncomeByDepartment,
  fetchSpendByDepartment,
  fetchCardStats,
};

export default initialService;
