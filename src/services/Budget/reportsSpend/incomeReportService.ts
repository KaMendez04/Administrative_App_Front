import type { IncomeReportFilters, IncomeSummary, IncomeRow } from "../../../models/Budget/reports/income";
import api from "../../../apiConfig/apiConfig";

// Obtener tabla + resumen
export async function fetchIncomeFull(filters: IncomeReportFilters): Promise<{
  filters: IncomeReportFilters;
  rows: IncomeRow[];
  totals: IncomeSummary;
}> {
  const { data } = await api.get("/report/income/full", { params: filters });
  return data as {
    filters: IncomeReportFilters;
    rows: IncomeRow[];
    totals: IncomeSummary;
  };
}

// PDF (visualizar/descargar)
export async function fetchIncomePDF(filters: IncomeReportFilters, preview = false): Promise<Blob> {
  const { data } = await api.get("/report/income/pdf", {
    params: { ...filters, preview: preview ? "true" : "false" },
    responseType: "blob",
  });
  return data as Blob;
}

export function downloadIncomePdf(blob: Blob, filename?: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `reporte-ingresos-${new Date().toISOString().slice(0, 10)}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}
