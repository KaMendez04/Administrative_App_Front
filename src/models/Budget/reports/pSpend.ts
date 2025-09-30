/* ================== Tipos / Model ================== */
export type FiltersBase = {
  start?: string;
  end?: string;
  departmentId?: number;
};

export type SpendFilters = FiltersBase & {
  spendTypeId?: number;
  spendSubTypeId?: number;
};

export type RowSpend = {
  spendSubTypeId: number;
  name: string;
  real: number;
  projected: number;
  /** Diferencia = PROYECTADO - REAL (alineado al reporte actual) */
  difference: number;
};

export type ReportSpend = {
  filters: SpendFilters;
  rows: RowSpend[];
  totals: {
    real: number;
    projected: number;
    difference: number;
  };
};

/** ===== Catálogos (para selects) ===== */
export type Department = {
  id: number;
  name: string;
};

export type SpendType = {
  id: number;
  name: string;
  departmentId?: number;
};

export type SpendSubType = {
  id: number;
  name: string;
  spendTypeId?: number;
};
