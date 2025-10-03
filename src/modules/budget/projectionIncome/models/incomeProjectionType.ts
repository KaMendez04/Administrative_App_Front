/* ================== Tipos / Model ================== */
export type FiltersBase = {
  start?: string;
  end?: string;
  departmentId?: number;
};

export type PIncomeFilters = FiltersBase & {
  pIncomeTypeId?: number;
  pIncomeSubTypeId?: number;
};

export type RowPIncome = {
  pIncomeSubTypeId: number;
  name: string;
  real: number;
  projected: number;
  /** Diferencia = PROYECTADO - REAL (como venías usando en comparativo) */
  difference: number;
};

export type ReportPIncome = {
  filters: PIncomeFilters;
  rows: RowPIncome[];
  totals: {
    real: number;
    projected: number;
    difference: number;
  };
};

export type ApiList<T> = {
  data: T[];
  total?: number;
};

/** ===== Catálogos (para selects) ===== */
export type Department = {
  id: number;
  name: string;
};

export type CreateDepartmentDTO = {
  name: string;
};

export type PIncomeType = {
  id: number;
  name: string;
  departmentId?: number; 
};

export type PIncomeSubType = {
  id: number;
  name: string;
  pIncomeTypeId?: number; 
};

export type CreatePIncomeTypeDTO = {
  name: string;
  departmentId: number;
};

export type CreatePIncomeSubTypeDTO = {
  name: string;
  pIncomeTypeId: number;
};

export interface PIncome {
  id: number;
  amount: string; 
 
  pIncomeSubType: PIncomeSubType;
}

export type CreatePIncomeDTO = {
  pIncomeSubTypeId: number;
  amount: number;
};