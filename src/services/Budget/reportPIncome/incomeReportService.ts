import type { IncomeFilters, IncomeSubType, IncomeType, ReportIncome } from "../../../modules/budget/projectionIncome/models/incomeProjectionType";
import type { Department } from "../../../modules/budget/income/models/IncomeType";
import apiConfig from "../../../apiConfig/apiConfig";


export async function listDepartments(): Promise<Department[]> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return data ?? [];
}

export async function listIncomeTypes(departmentId?: number): Promise<IncomeType[]> {
  const { data } = await apiConfig.get<any[]>("/income-type");
  let items: IncomeType[] = (data ?? []).map((t: any) => ({
    id: t.id, name: t.name, departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return items;
}

export async function listIncomeSubTypes(incomeTypeId?: number): Promise<IncomeSubType[]> {
  const { data } = await apiConfig.get<any[]>("/income-sub-type", {
    params: incomeTypeId ? { incomeTypeId } : undefined,
  });
  return (data ?? []).map((s: any) => ({
    id: s.id, name: s.name, incomeTypeId: s?.incomeType?.id,
  }));
}
export async function getIncomeReport(params: IncomeFilters): Promise<ReportIncome> {
  const { data } = await apiConfig.get<ReportIncome>("/report-proj/income", { params });
  return data;
}

function clean<T extends object>(obj: T): Partial<T> {
    const out: any = {};
    Object.entries(obj ?? {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") out[k] = v;
    });
    return out;
  }
  
  function filenameFromCD(cd?: string, def = "reporte.pdf") {
    if (!cd) return def;
    const m = /filename\*?=(?:UTF-8''|")?([^;"]+)/i.exec(cd);
    if (!m) return def;
    try { return decodeURIComponent(m[1].replace(/"/g, "").trim()); } catch { return def; }
  }
  
  export async function downloadIncomeReportPDF(filters: IncomeFilters) {
    const params = clean(filters);
    const res = await apiConfig.get<Blob>("/report-proj/income/pdf", {
      params,
      responseType: "blob",
    });
    const blob = res.data;
    const url = URL.createObjectURL(blob);
  
    const cd = (res as any).headers?.["content-disposition"];
    const filename = filenameFromCD(cd, `reporte-ingresos.pdf-${new Date().toISOString().slice(0, 10)}`);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  
  export async function previewIncomeReportPDF(filters: IncomeFilters) {
    const params = clean(filters);
    const res = await apiConfig.get<Blob>("/report-proj/income/pdf", {
      params,
      responseType: "blob",
    });
    const blob = res.data;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  // ===== EXCEL: Comparativo de Ingresos =====
export async function downloadIncomeCompareExcel(filters: IncomeFilters) {
  const params = clean(filters);
  const res = await apiConfig.get<Blob>("/report-proj/income/excel", {
    params,
    responseType: "blob",
  });

  const cd = (res as any).headers?.["content-disposition"];
  const filename = filenameFromCD(
    cd,
    `reporte-comparativo-ingresos-${new Date().toISOString().slice(0, 10)}.xlsx`
  );

  const blob = res.data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ===== EXCEL: Listado de Ingresos Proyectados (pIncome) =====
export async function downloadPIncomeListExcel(filters: IncomeFilters) {
  const params = clean(filters);
  const res = await apiConfig.get<Blob>("/report-proj/pincome/excel", {
    params,
    responseType: "blob",
  });

  const cd = (res as any).headers?.["content-disposition"];
  const filename = filenameFromCD(
    cd,
    `reporte-pincome-${new Date().toISOString().slice(0, 10)}.xlsx`
  );

  const blob = res.data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
