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

export interface Income {
  id: number;
  amount: string; 
  date: string;   
  incomeSubType: IncomeSubType;
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
  amount: number;
  date: string;
};

export type Option = { label: string; value: number | string };

export type ApiList<T> = {
  data: T[];
  total?: number;
};
