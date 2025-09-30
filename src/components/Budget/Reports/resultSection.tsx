import type { IncomeRow } from "./pIncomeTable";
import IncomeRowsTable from "./pIncomeTable";
import TotalsCards from "./totalCardPIncome";


export default function ResultsSection({
  loading,
  totals,
  rows,
}: {
  loading: boolean;
  totals: { real: number; projected: number; difference: number } | undefined;
  rows: IncomeRow[] | undefined;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 p-6 text-gray-500">
        Cargando reporte…
      </div>
    );
  }

  return (
    <>
      <TotalsCards totals={totals ?? { real: 0, projected: 0, difference: 0 }} />
      <IncomeRowsTable rows={rows ?? []} />
    </>
  );
}
