
type Props = {
  title?: string;
  budgetYear: number;
  setBudgetYear: (y: number) => void;
  totalCalculated: number;
  colones: Intl.NumberFormat;
};

export default function ProjectionHeader({
  title = "Proyección",
  budgetYear,
  setBudgetYear,
  totalCalculated,
  colones,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* Año */}
        <div className="flex items-center gap-2">
          <label htmlFor="year" className="text-sm text-gray-600">
            Año
          </label>
          <input
            id="year"
            type="number"
            value={budgetYear}
            onChange={(e) => setBudgetYear(Number(e.target.value))}
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Total */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Monto total</span>
            <span className="text-base font-medium text-gray-900">
              {colones.format(totalCalculated)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
