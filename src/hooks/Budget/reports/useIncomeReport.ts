import { useQuery, useMutation } from "@tanstack/react-query";
import {
  resolveDepartmentIdByName,
  resolveIncomeTypeIdByName,
  resolveIncomeSubTypeIdByName,
} from "../../../services/Budget/reportIncome/catalogLookupService";
import {
  fetchIncomeFull,
  fetchIncomePDF,
  downloadIncomePdf,
  downloadIncomeExcel,
  fetchIncomeExcel,
} from "../../../services/Budget/reportIncome/incomeReportService";

// filtros por NOMBRE (como en Spend)
export type IncomeReportNameFilters = {
  start?: string;
  end?: string;
  departmentName?: string;
  incomeTypeName?: string;
  incomeSubTypeName?: string;
};

function textify(v: any): string {
  if (v == null) return "";
  if (["string", "number", "boolean"].includes(typeof v)) return String(v);
  try {
    if (v?.name != null) return String(v.name);
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
function numify(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function isoDate(v: any): string {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d.toISOString() : "";
}
function groupBySum(rows: any[], key: "department" | "incomeType") {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = textify(r[key]) || "—";
    const amt = numify(r.amount);
    m.set(k, (m.get(k) ?? 0) + amt);
  }
  if (key === "department") {
    return Array.from(m, ([department, total]) => ({ department, total }));
  }
  return Array.from(m, ([type, total]) => ({ type, total }));
}

export function useIncomeReport(filters: IncomeReportNameFilters | null) {
  return useQuery({
    queryKey: ["report", "income", "full", filters],
    enabled: !!filters, // habilita cuando apliques filtros
    queryFn: async () => {
      // 1) resolver nombres -> ids
      const departmentId = await resolveDepartmentIdByName(filters?.departmentName);
      const incomeTypeId = await resolveIncomeTypeIdByName(filters?.incomeTypeName, departmentId);
      const incomeSubTypeId = await resolveIncomeSubTypeIdByName(filters?.incomeSubTypeName, incomeTypeId);

      // 2) pedir al back
      const { rows, totals } = await fetchIncomeFull({
        start: filters?.start || undefined,
        end: filters?.end || undefined,
        departmentId,
        incomeTypeId,
        incomeSubTypeId,
      });

      // 3) normalizar filas
      const normRows = (rows ?? []).map((r: any) => ({
        department: textify(r.department ?? r.departmentName ?? r.dept),
        incomeType: textify(r.incomeType ?? r.type),
        incomeSubType: textify(r.incomeSubType ?? r.subType),
        date: isoDate(r.date ?? r.createdAt),
        amount: numify(r.amount ?? r.total),
      }));

      // 4) totales del back + fallbacks desde filas
      const baseTotals = {
        total: numify(totals?.total ?? totals?.grandTotal),
        byDepartment: (totals?.byDepartment ?? []).map((x: any) => ({
          department: textify(x.department ?? x.departmentName ?? x.dept ?? x.name),
          total: numify(x.total),
        })),
        byType: (totals?.byType ?? totals?.byIncomeType ?? []).map((x: any) => ({
          type: textify(x.type ?? x.name),
          total: numify(x.total),
        })),
      };

      const fromRows = normRows.reduce((acc, r) => acc + numify(r.amount), 0);
      const finalTotals = {
        total: baseTotals.total > 0 ? baseTotals.total : fromRows,
        byDepartment: baseTotals.byDepartment.length
          ? baseTotals.byDepartment
          : groupBySum(normRows, "department"),
        byType: baseTotals.byType.length
          ? baseTotals.byType
          : groupBySum(normRows, "incomeType"),
      };

      return { rows: normRows, totals: finalTotals };
    },
  });
}

// PDF (preview / download) igual a Spend
export function useIncomeReportPDF() {
  return useMutation<unknown, Error, IncomeReportNameFilters & { preview?: boolean }>({
    mutationFn: async (filters) => {
      const departmentId = await resolveDepartmentIdByName(filters?.departmentName);
      const incomeTypeId = await resolveIncomeTypeIdByName(filters?.incomeTypeName, departmentId);
      const incomeSubTypeId = await resolveIncomeSubTypeIdByName(filters?.incomeSubTypeName, incomeTypeId);

      const blob = await fetchIncomePDF(
        {
          start: filters?.start || undefined,
          end: filters?.end || undefined,
          departmentId,
          incomeTypeId,
          incomeSubTypeId,
        },
        filters.preview ?? false
      );

      if (filters.preview) {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        return;
      }
      downloadIncomePdf(blob);
    },
  });
}

export function useIncomeReportExcel() {
  return useMutation<unknown, Error, IncomeReportNameFilters>({
    mutationFn: async (filters) => {
      const departmentId = await resolveDepartmentIdByName(filters?.departmentName);
      const incomeTypeId = await resolveIncomeTypeIdByName(filters?.incomeTypeName, departmentId);
      const incomeSubTypeId = await resolveIncomeSubTypeIdByName(filters?.incomeSubTypeName, incomeTypeId);

      const blob = await fetchIncomeExcel({
        start: filters?.start || undefined,
        end: filters?.end || undefined,
        departmentId,
        incomeTypeId,
        incomeSubTypeId,
      });

      downloadIncomeExcel(blob);
    },
  });
}