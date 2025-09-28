export type SpendTableRow = {
    department: string;
    spend: string;
    spendType: string;
    date: string;  // ISO
    amount: number;
  };
  
  export type SpendSummary = {
    total: number;
    byDepartment: Array<{ department: string; total: number }>;
    byType: Array<{ type: string; total: number }>;
    bySubType?: Array<{ subType: string; total: number }>;
  };
  
  export type SpendFiltersResolved = {
    start?: string;
    end?: string;
    departmentId?: number;
    spendTypeId?: number;
    spendSubTypeId?: number;
  };