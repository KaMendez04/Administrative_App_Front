import type { SpendTableRow } from "../../../models/Budget/reports/spend";

type Props = { rows: SpendTableRow[]; loading?: boolean };

const fmt = (n: number) =>
  Number(n ?? 0).toLocaleString("es-CR"); // sin símbolo

export default function SpendTable({ rows, loading }: Props) {
  if (loading) return <div className="p-6 text-gray-500">Cargando…</div>;
  if (!rows?.length) return <div className="p-6 text-gray-500">Sin resultados</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-2">Departamento</th>
            <th className="px-4 py-2">Gasto</th>
            <th className="px-4 py-2">Tipo de gasto</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2 text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.department} className="bg-white/70 rounded-xl shadow-sm">
              <td className="px-4 py-2">{r.department}</td>
              <td className="px-4 py-2">{r.spend}</td>
              <td className="px-4 py-2">{r.spendType}</td>
              <td className="px-4 py-2">{r.date}</td>
              <td className="px-4 py-2 text-right font-medium">{fmt(r.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
