import api from "../../apiConfig";

export type SpendTableRow = {
  department: string;
  spend: string;
  spendType: string;
  date: string;  // ISO
  amount: number;
};

export type SpendSummary = {
  total: number;
  byDepartment: Array<{ department: string; total: number }>;
  byType: Array<{ type: string; total: number }>;
  bySubType?: Array<{ subType: string; total: number }>;
};

export type SpendFiltersResolved = {
  start?: string;
  end?: string;
  departmentId?: number;
  spendTypeId?: number;
  spendSubTypeId?: number;
};

export async function fetchSpendFull(filters: SpendFiltersResolved): Promise<{
  filters: SpendFiltersResolved;
  rows: SpendTableRow[];
  totals: SpendSummary;
}> {
  const { data } = await api.get("/report/spend/full", { params: filters });
  return data as {
    filters: SpendFiltersResolved;
    rows: SpendTableRow[];
    totals: SpendSummary;
  };
}
