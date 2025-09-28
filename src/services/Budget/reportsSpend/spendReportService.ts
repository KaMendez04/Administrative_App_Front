import type { SpendFiltersResolved, SpendSummary, SpendTableRow } from "../../../models/Budget/reports/spend";
import api from "../../apiConfig";

// Obtener tabla + resumen
export async function fetchSpendFull(filters: SpendFiltersResolved): Promise<{
  filters: SpendFiltersResolved;
  rows: SpendTableRow[];
  totals: SpendSummary;
}> {
  const { data } = await api.get("/report/spend/full", { params: filters });
  return data as {
    filters: SpendFiltersResolved;
    rows: SpendTableRow[];
    totals: SpendSummary;
  };
}

// PDF (visualizar/descargar)
export async function fetchSpendPDF(filters: SpendFiltersResolved, preview = false): Promise<Blob> {
  const { data } = await api.get("/report/spend/pdf", {
    params: { ...filters, preview: preview ? "true" : "false" },
    responseType: "blob",
  });
  return data as Blob;
}

export function downloadSpendPdf(blob: Blob, filename?: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `reporte-egresos-${new Date().toISOString().slice(0, 10)}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}
