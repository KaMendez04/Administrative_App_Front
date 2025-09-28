import type { IncomeRow } from "../../../models/Budget/reports/income";

type Props = { rows: IncomeRow[]; loading?: boolean };

// Formateo de montos
const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

export default function IncomeTable({ rows, loading }: Props) {
  return (
    <div className="bg-white overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-xs tracking-wider text-gray-500">
            <th className="text-left py-3 pl-6 pr-3 bg-gray-50 border-b border-gray-200 rounded-tl-2xl">Departamento</th>
            <th className="text-left py-3 px-3 bg-gray-50 border-b border-gray-200">Ingreso</th>
            <th className="text-left py-3 px-3 bg-gray-50 border-b border-gray-200">Tipo de ingreso</th>
            <th className="text-left py-3 px-3 bg-gray-50 border-b border-gray-200">Fecha</th>
            <th className="text-right py-3 pr-6 pl-3 bg-gray-50 border-b border-gray-200 rounded-tr-2xl">Monto</th>
          </tr>
        </thead>

        <tbody className="text-sm">
          {loading && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-400">Cargando…</td>
            </tr>
          )}

          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-400">Sin resultados</td>
            </tr>
          )}

          {!loading && rows.map((r, i) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className={`py-4 pl-6 pr-3 ${i === rows.length - 1 ? "rounded-bl-2xl" : ""}`}>
                <div className="font-medium text-gray-900">{r.department.name}</div>
              </td>
              <td className="py-4 px-3 text-gray-700">{r.incomeSubType.name}</td>
              <td className="py-4 px-3 text-gray-700">{r.incomeType.name}</td>
              <td className="py-4 px-3 text-gray-700">{r.date ?? "—"}</td>
              <td className={`py-4 pr-6 pl-3 text-right font-medium ${i === rows.length - 1 ? "rounded-br-2xl" : ""}`}>
                {crc(r.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
