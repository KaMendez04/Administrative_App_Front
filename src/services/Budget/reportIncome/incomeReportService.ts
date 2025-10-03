import api from "../../apiConfig";

export type IncomeResolvedFilters = {
  start?: string;
  end?: string;
  departmentId?: number;
  incomeTypeId?: number;
  incomeSubTypeId?: number;
};

type IncomeFullDTO = {
  filters?: any;
  rows: any[];
  totals: any;
};

export async function fetchIncomeFull(
  resolved: IncomeResolvedFilters
): Promise<{ rows: any[]; totals: any }> {
  // ⬇ Tipamos el response para que data tenga .rows y .totals
  const { data } = await api.get<IncomeFullDTO>("/report/income/full", {
    params: resolved,
  });

  return {
    rows: data?.rows ?? [],
    totals: data?.totals ?? {},
  };
}

export async function fetchIncomePDF(
  resolved: IncomeResolvedFilters,
  preview = false
): Promise<Blob> {
  const { data } = await api.get<Blob>("/report/income/pdf", {
    params: { ...resolved, preview: preview ? "true" : "false" },
    // ⬇ asegura el tipo literal correcto
    responseType: "blob" as const,
  });
  return data;
}

export function downloadIncomePdf(blob: Blob, filename?: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    filename ?? `reporte-ingresos-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}