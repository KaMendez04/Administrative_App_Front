import apiConfig from "../../../apiConfig/apiConfig";
import {
  listDepartments as fetchDepartments,
  listSpendTypes as fetchSpendTypes,
  listSpendSubTypes as fetchSpendSubTypes,
} from "../reportsSpend/catalogLookupService";
import type {
  Department,
  SpendType,
  SpendSubType,
  SpendFilters,
  ReportSpend
} from "../../../models/Budget/reports/pSpend";

function buildParams(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  return q.toString();
}

async function downloadBlob(url: string, filename: string) {
  const response = await apiConfig.get(url, { responseType: "blob" });
  const headers = (response as any).headers ?? {};
  const contentType = (headers["content-type"] as string) || "application/octet-stream";
  const disposition = headers["content-disposition"] as string | undefined;

  // Try to extract filename from Content-Disposition
  let suggestedName = filename;
  if (disposition) {
    const matchStar = disposition.match(/filename\*=([^;]+)/i);
    const matchPlain = disposition.match(/filename=([^;]+)/i);
    const raw = matchStar?.[1] || matchPlain?.[1];
    if (raw) {
      let cleaned = raw.trim();
      cleaned = cleaned.replace(/^UTF-8''/i, "");
      cleaned = cleaned.replace(/^["']|["']$/g, "");
      try {
        suggestedName = decodeURIComponent(cleaned);
      } catch {
        suggestedName = cleaned;
      }
    }
  }

  const blob = response.data instanceof Blob
    ? (response.data as Blob)
    : new Blob([response.data as any], { type: contentType });

  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after a short delay to avoid potential race conditions in some browsers
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export const pSpendService = {
  downloadSpendCompareExcel,
  downloadPSpendListExcel,

  // ===== Catálogos =====
  async listDepartments(): Promise<Department[]> {
    return await fetchDepartments();
  },

  async listSpendTypes(departmentId?: number): Promise<SpendType[]> {
    return await fetchSpendTypes(departmentId);
  },

  async listSpendSubTypes(spendTypeId?: number): Promise<SpendSubType[]> {
    return await fetchSpendSubTypes(spendTypeId);
  },

  async getSpendReport(params: SpendFilters): Promise<ReportSpend> {
    const { data } = await apiConfig.get<ReportSpend>("/report-proj/spend", { params });
    return data;
  },

  // ===== PDF COMPARATIVO (real vs. proyectado) =====
  previewSpendComparePDF(filters: SpendFilters) {
    const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
    const qs = buildParams({ ...filters, preview: "true" });
    // Abrimos en nueva pestaña
    window.open(`${base}/report-proj/spend/pdf?${qs}`, "_blank");
  },

  async downloadSpendComparePDF(filters: SpendFilters) {
    const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
    const qs = buildParams({ ...filters }); // sin preview -> attachment
    const filename = `reporte-comparativo-egresos-${new Date().toISOString().slice(0, 10)}.pdf`;
    await downloadBlob(`${base}/report-proj/spend/pdf?${qs}`, filename);
  },

  // ===== (Opcional) PDF de LISTADO PSpend (solo proyectados) =====
  previewPSpendListPDF(filters: SpendFilters) {
    const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
    const qs = buildParams({ ...filters, preview: "true" });
    window.open(`${base}/report-proj/pspend/pdf?${qs}`, "_blank");
  },

  async downloadPSpendListPDF(filters: SpendFilters) {
    const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
    const qs = buildParams({ ...filters });
    const filename = `reporte-pspend-${new Date().toISOString().slice(0, 10)}.pdf`;
    await downloadBlob(`${base}/report-proj/pspend/pdf?${qs}`, filename);
  },
};
// ===== EXCEL: Comparativo de Egresos =====
async function downloadSpendCompareExcel(filters: SpendFilters) {
  const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
  const qs = buildParams({ ...filters });
  const filename = `reporte-comparativo-egresos-${new Date().toISOString().slice(0, 10)}.xlsx`;
  await downloadBlob(`${base}/report-proj/spend/excel?${qs}`, filename);
}

// ===== EXCEL: Listado de Gastos Proyectados (pSpend) =====
async function downloadPSpendListExcel(filters: SpendFilters) {
  const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
  const qs = buildParams({ ...filters });
  const filename = `reporte-pspend-${new Date().toISOString().slice(0, 10)}.xlsx`;
  await downloadBlob(`${base}/report-proj/pspend/excel?${qs}`, filename);
}
