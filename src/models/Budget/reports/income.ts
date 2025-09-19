export type IncomeReportFilters = {
  start?: string; // 'YYYY-MM-DD'
  end?: string;   // 'YYYY-MM-DD'
  departmentId?: number | '';
  incomeTypeId?: number | '';
  incomeSubTypeId?: number | '';
};

export type IncomeRow = {
  id: number;
  date: string;
  amount: number;
  department: { id: number; name: string };
  incomeType: { id: number; name: string };
  incomeSubType: { id: number; name: string };
};

export type IncomeTotals = {
  byIncomeSubType: { incomeSubTypeId: number; incomeSubTypeName: string; total: number }[];
  byDepartment: { departmentId: number; departmentName: string; total: number }[];
  grandTotal: number;
};

export type IncomeFullResponse = {
  filters: Record<string, unknown>;
  rows: IncomeRow[];
  totals: IncomeTotals;
};
