import apiConfig from "../../../services/apiConfig";
import {
  listDepartments,
  listPSpendTypes,      // ✅ Importar de proyecciones
  listPSpendSubTypes,   // ✅ Importar de proyecciones
} from "../projectionSpendService";

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
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export const pSpendService = {
  downloadSpendCompareExcel,
  downloadPSpendListExcel,

  // ===== Catálogos (CORREGIDOS) =====
  async listDepartments(): Promise<Department[]> {
    const result = await listDepartments();
    return result.data ?? [];
  },

  async listSpendTypes(departmentId?: number): Promise<SpendType[]> {
    if (!departmentId) return [];
    const result = await listPSpendTypes(departmentId);
    // Mapear al formato esperado
    return (result.data ?? []).map(t => ({
      id: t.id,
      name: t.name,
      departmentId: t.departmentId,
      // Agregar campos opcionales si los necesitas
    }));
  },

  async listSpendSubTypes(spendTypeId?: number): Promise<SpendSubType[]> {
    if (!spendTypeId) return [];
    const result = await listPSpendSubTypes(spendTypeId);
    // Mapear al formato esperado
    return (result.data ?? []).map(s => ({
      id: s.id,
      name: s.name,
      pSpendTypeId: s.pSpendTypeId,
      // Agregar campos opcionales si los necesitas
    }));
  },

  async getSpendReport(params: SpendFilters): Promise<ReportSpend> {
    const { data } = await apiConfig.get<ReportSpend>("/report-proj/spend", { params });
    return data;
  },

  // ===== PDF COMPARATIVO =====
  previewSpendComparePDF(filters: SpendFilters) {
    const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
    const qs = buildParams({ ...filters, preview: "true" });
    window.open(`${base}/report-proj/spend/pdf?${qs}`, "_blank");
  },

  async downloadSpendComparePDF(filters: SpendFilters) {
    const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
    const qs = buildParams({ ...filters });
    const filename = `reporte-comparativo-egresos-${new Date().toISOString().slice(0, 10)}.pdf`;
    await downloadBlob(`${base}/report-proj/spend/pdf?${qs}`, filename);
  },

  // ===== PDF LISTADO PSpend =====
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

// ===== EXCEL: Listado de Gastos Proyectados =====
async function downloadPSpendListExcel(filters: SpendFilters) {
  const base = (apiConfig.defaults.baseURL ?? "").replace(/\/$/, "");
  const qs = buildParams({ ...filters });
  const filename = `reporte-pspend-${new Date().toISOString().slice(0, 10)}.xlsx`;
  await downloadBlob(`${base}/report-proj/pspend/excel?${qs}`, filename);
}