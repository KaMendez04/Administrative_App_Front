export interface Department {
  id: number;
  name: string;
}

export interface PIncomeType {
  id: number;
  name: string;
  departmentId: number;
}

export interface PIncomeSubType {
  id: number;
  name: string;
  pIncomeTypeId: number;
}

export interface PIncome {
  id: number;
  amount: string; 
 
  pIncomeSubType: PIncomeSubType;
}

export type CreateDepartmentDTO = {
  name: string;
};

export type CreatePIncomeTypeDTO = {
  name: string;
  departmentId: number;
};

export type CreatePIncomeSubTypeDTO = {
  name: string;
  pIncomeTypeId: number;
};


export type CreatePIncomeDTO = {
  pIncomeSubTypeId: number;
  amount: number;
};

export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};
