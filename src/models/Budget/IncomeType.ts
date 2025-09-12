
export interface Department {
  id: number;
  name: string;
}

export interface IncomeType {
  id: number;
  name: string;
  departmentId: number;
}

export interface IncomeSubType {
  id: number;
  name: string;
  incomeTypeId: number;
}

export interface IncomeCreateDTO {
  departmentId: number;
  incomeTypeId: number;
  incomeSubTypeId: number;
  amount: number;           // en colones, validado > 0
  detail?: string;          // opcional, máx 255
  fiscalYearId?: number;    // opcional, si lo maneja el back
}

export interface CreateDepartmentDTO {
  name: string;
}

export interface CreateIncomeTypeDTO {
  name: string;
  departmentId: number;
}

export interface CreateIncomeSubTypeDTO {
  name: string;
  incomeTypeId: number;
}

export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};
