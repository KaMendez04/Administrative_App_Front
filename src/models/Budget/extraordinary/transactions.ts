export interface CreateTransferDto {
    incomeSubTypeId: number;
    spendSubTypeId: number;
    amount: string;   // manda string decimal "1500.00" (match con tu back)
    date?: string;    // yyyy-mm-dd
    name?: string;
    detail?: string;
  }
  
  export interface TransferResponseDto {
    transfer: any;
    spend: any;
    remainingFromIncomeSubType: number;
    incomeType?: any; // si tu back ya lo devuelve
  }
  
  // Opcionales por si quieres tipar los lookups
  export type Dept = { 
    id: number; 
    name: string 
    };
  
  export type IncomeType = {
    id: number; 
    name: string;
    department?: { id: number; name: string };
  };
  export type IncomeSubType = {
    id: number; 
    name: string;
    incomeType?: IncomeType;
  };
  
  export type SpendType = {
    id: number; 
    name: string;
    department?: { id: number; name: string };
  };
  export type SpendSubType = {
    id: number; 
    name: string;
    spendType?: SpendType;
  };
  