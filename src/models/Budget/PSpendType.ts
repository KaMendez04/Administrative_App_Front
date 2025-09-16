export interface Department {
  id: number;
  name: string;
}

export interface PSpendType {
  id: number;
  name: string;
  departmentId: number;
}

export interface PSpendSubType {
  id: number;
  name: string;
  pSpendTypeId: number;
}

export interface PSpend {
  id: number;
  amount: string; // el back suele devolver string
  pSpendSubType: PSpendSubType;
}

export type CreatePSpendDTO = {
  pSpendSubTypeId: number;
  amount: number; // se serializa a string con 2 decimales en el service
  // fiscalYearId?: number; // agrega si tu back lo pide
};

export type ApiList<T> = { data: T[]; total?: number };
