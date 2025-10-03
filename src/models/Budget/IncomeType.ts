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
export interface Department {
  id: number;
  name: string;
}

export interface IncomeType {
  id: number;
  name: string;
  departmentId?: number;
}

export interface IncomeSubType {
  id: number;
  name: string;
  incomeTypeId?: number;
}

export interface Income {
  id: number;
  amount: string; 
  date: string;   // YYYY-MM-DD
  incomeSubType?: IncomeSubType;
}

export type CreateDepartmentDTO = {
  name: string;
};

export type CreateIncomeTypeDTO = {
  name: string;
  departmentId: number;
};

export type CreateIncomeSubTypeDTO = {
  name: string;
  incomeTypeId: number;
};

export type CreateIncomeDTO = {
  incomeSubTypeId: number;
  amount: number; // lo serializamos en el service si hace falta
  date: string;   // 'YYYY-MM-DD'
};

export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};
