import { mapIncomeRows, mapSpendRows, type ApiIncomeByDept, type ApiSpendByDept, type CardStats, type Row } from "../../models/Budget/initialType";
import apiConfig from "../apiConfig";

const HOME_SUMMARY_URL = "/home/summary";        // Para las cards
const HOME_INCOMES_URL = "/home/incomes";        // Para tabla de ingresos
const HOME_SPENDS_URL = "/home/spends";          // Para tabla de egresos

export async function fetchIncomeByDepartment(): Promise<Row[]> {
  const { data } = await apiConfig.get<ApiIncomeByDept[]>(
    `${HOME_INCOMES_URL}?groupBy=department`
  );
  return mapIncomeRows(data);
}

export async function fetchSpendByDepartment(): Promise<Row[]> {
  const { data } = await apiConfig.get<ApiSpendByDept[]>(
    `${HOME_SPENDS_URL}?groupBy=department`
  );
  return mapSpendRows(data);
}

export async function fetchCardStats(): Promise<CardStats> {
  const { data } = await apiConfig.get<{
    incomes: number;
    spends: number;
    balance: number;
    projectedIncomes: number;
    projectedSpends: number;
    projectedBalance: number;
  }>(HOME_SUMMARY_URL);

  return {
    totalGastado: data.spends,
    totalIngresos: data.incomes,
    saldoRestante: data.balance,
  };
}

export const initialService = {
  fetchIncomeByDepartment,
  fetchSpendByDepartment,
  fetchCardStats,
};

export default initialService;
