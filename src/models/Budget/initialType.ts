
export type Row = {
  department: string;
  spent: number;
  projected: number;
};

/** Estadísticas para las tarjetas superiores */
export type CardStats = {
  totalGastado: number;
  totalIngresos: number;
  saldoRestante: number;
};



/** Respuesta de API: Ingresos por departamento (estructura del backend) */
export type ApiIncomeByDept = {
  id: number;
  name: string;
  real: number;
  projected: number;
  diff: number;
};

/** Respuesta de API: Egresos por departamento (estructura del backend) */
export type ApiSpendByDept = {
  id: number;
  name: string;
  real: number;
  projected: number;
  diff: number;
};


export function mapIncomeRows(api: ApiIncomeByDept[] | null | undefined): Row[] {
  if (!api) return [];
  return api.map((x) => ({
    department: x.name,
    spent: x.real,
    projected: x.projected,
  }));
}


export function mapSpendRows(api: ApiSpendByDept[] | null | undefined): Row[] {
  if (!api) return [];
  return api.map((x) => ({
    department: x.name,
    spent: x.real,
    projected: x.projected,
  }));
}