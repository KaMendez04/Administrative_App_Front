
export interface Department {
  id: number;
  name: string;
}

export interface IncomeProjectionType {
  id: number;
  name: string;
  departmentId: number;
}

export interface IncomeProjectionSubType {
  id: number;
  name: string;
  incomeProjectionTypeId: number;
}



export interface IncomeProjectionCreateDTO {
  departmentId: number;
  incomeProjectionTypeId: number;
  incomeProjectionSubTypeId: number;
  amount: number;           // en colones, validado > 0
  detail?: string;          // opcional, máx 255
  fiscalYearId?: number;    // opcional, si lo maneja el back
}

export interface CreateDepartmentDTO {
  name: string;
}

export interface CreateIncomeProjectionTypeDTO {
  name: string;
  departmentId: number;
}

export interface CreateIncomeProjectionSubTypeDTO {
  name: string;
  incomeProjectionTypeId: number;
}


export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};
