// src/components/Budget/Reports/IncomeTotals.tsx
import type { IncomeTotals } from "../../../models/Budget/reports/income";

type Props = { totals: IncomeTotals | undefined; loading?: boolean };

const fmt = (n: number) => Number(n ?? 0).toLocaleString("es-CR"); // sin símbolo

export default function IncomeTotals({ totals, loading }: Props) {
  if (loading) return null;
  if (!totals) return null;

  return (
    <div className="mt-4 space-y-3">
      {/* Total por subtipo de ingreso */}
      {totals.byIncomeSubType.map((x) => (
        <div
          key={x.incomeSubTypeId}
          className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <span className="font-medium">
            Total de ingreso — {x.incomeSubTypeName}
          </span>
          <span className="font-bold">{fmt(x.total)}</span>
        </div>
      ))}

      {/* Total por departamento */}
      {totals.byDepartment.map((x) => (
        <div
          key={x.departmentId}
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <span className="font-medium">
            Total de Departamentos — {x.departmentName}
          </span>
          <span className="font-bold">{fmt(x.total)}</span>
        </div>
      ))}

      {/* Global */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
        <span className="font-semibold">Total</span>
        <span className="font-extrabold">{fmt(totals.grandTotal)}</span>
      </div>
    </div>
  );
}
