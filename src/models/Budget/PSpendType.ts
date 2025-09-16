export interface Department {
  id: number;
  name: string;
}

export interface SpendType {
  id: number;
  name: string;
  departmentId: number;
}

export interface SpendSubType {
  id: number;
  name: string;
  spendTypeId: number;
}

export interface PSpend { // Proyección de egreso (no incluye date)
  id: number;
  amount: string;          // el back suele devolver string
  spendSubType: SpendSubType;
}

export type CreatePSpendDTO = {
  spendSubTypeId: number;
  amount: number;          // se serializa a string con 2 decimales
  // fiscalYearId?: number; // <- si tu back lo exige, lo puedes incluir
};

export type ApiList<T> = { data: T[]; total?: number };
