import { useQuery } from "@tanstack/react-query";
import { resolveDepartmentIdByName, resolveSpendSubTypeIdByName, resolveSpendTypeIdByName } from "../../../services/Budget/reportsSpend/catalogLookupService";
import { useMutation } from "@tanstack/react-query";
import { fetchSpendPDF, downloadSpendPdf, fetchSpendFull } from "../../../services/Budget/reportsSpend/spendReportService";
import type { SpendSummary, SpendTableRow } from "../../../models/Budget/reports/spend";

export type SpendReportNameFilters = {
  start?: string;
  end?: string;
  departmentName?: string;
  spendTypeName?: string;
  spendSubTypeName?: string;
};

export function useSpendReportPDF() {
  return useMutation<unknown, Error, SpendReportNameFilters & { preview?: boolean }>({
    mutationFn: async (filters) => {
      // Resolver nombres -> IDs para el servicio de PDF
      const departmentId = await resolveDepartmentIdByName(filters?.departmentName);
      const spendTypeId = await resolveSpendTypeIdByName(filters?.spendTypeName, departmentId);
      const spendSubTypeId = await resolveSpendSubTypeIdByName(filters?.spendSubTypeName, spendTypeId);

      const resolved = {
        start: filters.start || undefined,
        end: filters.end || undefined,
        departmentId,
        spendTypeId,
        spendSubTypeId,
      };

      const pdfBlob = await fetchSpendPDF(resolved as any, filters.preview ?? false);

      if (filters.preview) {
        // Abrir PDF en modal / nueva ventana
        const url = window.URL.createObjectURL(pdfBlob);
        window.open(url, "_blank");
        return; // no descarga
      }

      // Descargar automáticamente
      downloadSpendPdf(pdfBlob);
    },
  });
}

// -------- helpers --------
function textify(v: any): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") {
    if ("name" in v && v.name != null) return String((v as any).name);
    if ("title" in v && v.title != null) return String((v as any).title);
    if ("label" in v && v.label != null) return String((v as any).label);
  }
  try { return JSON.stringify(v); } catch { return String(v); }
}
function numify(v: any): number { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function isoDate(v: any): string {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d.toISOString() : "";
}
function groupBySum(rows: any[], key: "department" | "spendType") {
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
// -------------------------

export function useSpendReport(filters: SpendReportNameFilters | null) {
  return useQuery<{ rows: SpendTableRow[]; totals: SpendSummary }>({
    queryKey: ["report", "spend", "full", filters],
    enabled: !!filters,
    queryFn: async () => {
      // 1) Resolver nombres -> IDs
      const departmentId = await resolveDepartmentIdByName(filters?.departmentName);
      const spendTypeId = await resolveSpendTypeIdByName(filters?.spendTypeName, departmentId);
      const spendSubTypeId = await resolveSpendSubTypeIdByName(filters?.spendSubTypeName, spendTypeId);

      // 2) Llamar al back
      const { rows, totals } = await fetchSpendFull({
        start: filters?.start || undefined,
        end: filters?.end || undefined,
        departmentId,
        spendTypeId,
        spendSubTypeId,
      });

      // 3) Normalizar filas
      const normRows: SpendTableRow[] = (rows ?? []).map((r: any) => ({
        department: textify(r.department),
        spendType: textify(r.spendType ?? r.type),
        spendSubType: textify(r.spendSubType ?? r.subType ?? r.subtype ?? r.spend_subtype ?? r.subTypeName),
        date: isoDate(r.date ?? r.createdAt ?? r.dateTime),
        amount: numify(r.amount ?? r.total),
      }));

      // helpers arriba del hook
      function deptLabel(x: any): string {
        // acepta string, objeto {name}, {department:{name}}, {departmentName}, {dept}, {name}
        if (typeof x === "string") return x;
        if (x?.department) return textify(x.department);      // si viene objeto, toma .name adentro
        return textify(x.departmentName ?? x.dept ?? x.name ?? x);
      }

     // dentro de queryFn, donde armamos baseTotals:
      const baseTotals = {
        total: numify(totals?.total),
        byDepartment: (totals?.byDepartment ?? []).map((x: any) => ({
          department: deptLabel(x) || deptLabel(x?.department),
          total: numify(x.total),
        })),
        byType: (totals?.byType ?? []).map((x: any) => ({
          type: textify(x.type ?? x.name),
          total: numify(x.total),
        })),
        bySubType: (totals?.bySubType ?? []).map((x: any) => ({
          subType: textify(x.subType ?? x.name),
          total: numify(x.total),
        })),
      };
      // Derivados desde las filas si faltan
      const sumFromRows = normRows.reduce((acc: number, r: { amount: any; }) => acc + numify(r.amount), 0);
      const finalTotals: SpendSummary = {
        total: baseTotals.total > 0 ? baseTotals.total : sumFromRows,
        byDepartment: (baseTotals.byDepartment.length
          ? baseTotals.byDepartment
          : (groupBySum(normRows, "department") as Array<{ department: string; total: number }>)) as Array<{
          department: string;
          total: number;
        }>,
        byType: (baseTotals.byType.length
          ? baseTotals.byType
          : (groupBySum(normRows, "spendType") as Array<{ type: string; total: number }>)) as Array<{
          type: string;
          total: number;
        }>,
        bySubType: baseTotals.bySubType,
      };

      return { rows: normRows, totals: finalTotals };
    },
  });
}


