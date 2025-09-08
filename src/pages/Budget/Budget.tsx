import { useMemo, useState } from "react";

export type PresupuestoGeneralProps = {
  year?: number;
  total_amount?: number;
  onYearChange?: (year: number) => void;
};

const formatCRC = (value: number) => {
  try {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₡${(value ?? 0).toLocaleString("es-CR")}`;
  }
};

export default function PresupuestoGeneralCard({
  year = new Date().getFullYear(),
  total_amount = 0,
  onYearChange,
}: PresupuestoGeneralProps) {
  const [yearState, setYearState] = useState<number>(year);
  const formatted = useMemo(() => formatCRC(total_amount), [total_amount]);

  // Datos de ejemplo para la tabla
  const historial: Array<{ year: number; total_amount: number }> = [
    { year: 2024, total_amount: 2_100_000 },
    { year: 2023, total_amount: 1_950_000 },
    { year: 2022, total_amount: 1_800_000 },
    { year: 2021, total_amount: 1_650_000 },
  ];

  return (
    <div className="w-full px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 lg:p-10 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900">Presupuesto General</h1>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Año del presupuesto */}
          <div>
            <label
              htmlFor="year"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Año del presupuesto
            </label>
            <input
              id="year"
              type="number"
              inputMode="numeric"
              className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-gray-400"
              value={yearState}
              onChange={(e) => {
                const y = Number(e.target.value || 0);
                setYearState(y);
                onYearChange?.(y);
              }}
            />
          </div>

          {/* Monto total (solo lectura) */}
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Ingresos totales (₡)
            </label>
            <div className="relative">
              <input
                id="amount"
                type="text"
                className="block w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm outline-none"
                value={formatted}
                readOnly
                aria-readonly
                tabIndex={-1}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Calculado automáticamente basado en ingresos registrados
            </p>
          </div>
        </div>

        {/* Tabla de Año y Total Gastado */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Historial de Presupuestos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Registro histórico de años anteriores con totales gastados
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Año
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Total Gastado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {historial.map((item) => (
                  <tr key={item.year}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCRC(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
