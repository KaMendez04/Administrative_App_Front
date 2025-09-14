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
  amount: number;
};

export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};
