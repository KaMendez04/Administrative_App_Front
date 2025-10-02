// DTOs
export interface CreateExtraordinaryDto {
    name: string;
    amount: number;
    date?: string;
  }
  
export interface AssignExtraordinaryDto {
    extraordinaryId: number;
    amount: number;
    departmentId: number;
    subTypeName: string;
    date?: string;
  }