import { resolveDepartmentIdByName, resolveSpendSubTypeIdByName, resolveSpendTypeIdByName } from "../../../services/Budget/reportsSpend/catalogLookupService";
import { fetchSpendFull } from "../../../services/Budget/reportsSpend/spendReportService";
import { useQuery } from "@tanstack/react-query";

export type SpendReportNameFilters = {
  start?: string;
  end?: string;
  departmentName?: string;
  spendTypeName?: string;
  spendSubTypeName?: string;
};

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
  return useQuery({
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
      const normRows = (rows ?? []).map((r: any) => ({
        department: textify(r.department),
        spend: textify(r.spend ?? r.concept ?? r.detail ?? r.description),
        spendType: textify(r.spendType ?? r.type),
        date: isoDate(r.date ?? r.createdAt ?? r.dateTime),
        amount: numify(r.amount ?? r.total),
      }));

      // 4) Normalizar/crear summary (fallbacks si viene vacío)
      const baseTotals = {
        total: numify(totals?.total),
        byDepartment: (totals?.byDepartment ?? []).map((x: any) => ({
          department: textify(x.department ?? x.name ?? x.dept),
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
      const finalTotals = {
        total: baseTotals.total > 0 ? baseTotals.total : sumFromRows,
        byDepartment: baseTotals.byDepartment.length ? baseTotals.byDepartment : groupBySum(normRows, "department"),
        byType: baseTotals.byType.length ? baseTotals.byType : groupBySum(normRows, "spendType"),
        bySubType: baseTotals.bySubType, // opcional: podrías derivar por subtipo si lo necesitas
      };

      return { rows: normRows, totals: finalTotals };
    },
  });
}


