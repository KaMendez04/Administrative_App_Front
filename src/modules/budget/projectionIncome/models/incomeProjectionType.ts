/* ================== Tipos / Model ================== */
export type FiltersBase = {
  start?: string;
  end?: string;
  departmentId?: number;
};

export type IncomeFilters = FiltersBase & {
  incomeTypeId?: number;
  incomeSubTypeId?: number;
};

export type RowIncome = {
  incomeSubTypeId: number;
  name: string;
  real: number;
  projected: number;
  /** Diferencia = PROYECTADO - REAL (como venías usando en comparativo) */
  difference: number;
};

export type ReportIncome = {
  filters: IncomeFilters;
  rows: RowIncome[];
  totals: {
    real: number;
    projected: number;
    difference: number;
  };
};

/** ===== Catálogos (para selects) ===== */
export type Department = {
  id: number;
  name: string;
};

export type IncomeType = {
  id: number;
  name: string;
  departmentId?: number;
};

export type IncomeSubType = {
  id: number;
  name: string;
  incomeTypeId?: number;
};
