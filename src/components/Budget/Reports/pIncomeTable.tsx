import { crc } from "../../../utils/currency";


export type IncomeRow = {
  incomeSubTypeId: number;
  name: string;
  real: number;
  projected: number;
  difference: number;
};

export default function IncomeRowsTable({ rows }: { rows: IncomeRow[] }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow">
      <div className="px-6 py-4 text-sm font-medium text-gray-700">Detalle por subtipo</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Subtipo de ingreso</th>
              <th className="px-6 py-3 text-right">Real</th>
              <th className="px-6 py-3 text-right">Proyectado</th>
              <th className="px-6 py-3 text-right">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-400" colSpan={4}>
                  Sin resultados
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.incomeSubTypeId} className="border-t">
                <td className="px-6 py-3">{r.name}</td>
                <td className="px-6 py-3 text-right">{crc(r.real)}</td>
                <td className="px-6 py-3 text-right">{crc(r.projected)}</td>
                <td className={`px-6 py-3 text-right ${
                  r.difference >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {crc(r.difference)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
