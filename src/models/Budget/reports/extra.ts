export type ExtraReportFilters = {
    start?: string;   // 'YYYY-MM-DD'
    end?: string;     // 'YYYY-MM-DD'
    name?: string;    // texto libre para buscar por nombre/descr
  };
  
  export type ExtraRow = {
    id: number;
    name?: string | null;
    description?: string | null;
    date?: string | null;   // ISO 'YYYY-MM-DD'
    amount: number;
    used: number;
    remaining: number;
  };
  
  export type ExtraTotals = {
    count: number;
    totalAmount: number;
    totalUsed: number;
    totalRemaining: number;
  };
  
  export type ExtraFullResponse = {
    filters: Record<string, unknown>;
    rows: ExtraRow[];
    totals: ExtraTotals;
  };