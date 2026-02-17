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

export interface Spend {
  id: number;
  amount: string; 
  date: string;   // YYYY-MM-DD
  spendSubType: SpendSubType;
}

export type CreateDepartmentDTO = {
  name: string;
};

export type CreateSpendTypeDTO = {
  name: string;
  departmentId: number;
};

export type CreateSpendSubTypeDTO = {
  name: string;
  spendTypeId: number;
};

export type CreateSpendDTO = {
  spendSubTypeId: number;
  amount: number; // lo serializamos en el service si hace falta
  date: string;   // 'YYYY-MM-DD'
};

export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};


export type PSpendType = {
  id: number;
  name: string;
  departmentId?: number;
};

export type PSpendSubType = {
  id: number;
  name: string;
  typeId: number; // pSpendTypeId
};

// src/models/Budget/SpendType.ts
export type UpdateSpendDTO = {
  id: number
  spendSubTypeId?: number
  amount?: number
  date?: string
}
