import { crc } from "../../../utils/crcDateUtil";


export default function TotalsCards({
  totals,
}: { totals: { real: number; projected: number; difference: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Total ingresos (Reales)</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{crc(totals.real)}</div>
      </div>
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Total ingresos (Proyectados)</div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{crc(totals.projected)}</div>
      </div>
      <div className="rounded-2xl bg-white ring-1 ring-gray-100 shadow p-5">
        <div className="text-gray-500 text-sm">Diferencia (Proj - Real)</div>
        <div className={`mt-2 text-2xl font-bold ${
          totals.difference >= 0 ? "text-green-600" : "text-red-600"
        }`}>
          {crc(totals.difference)}
        </div>
      </div>
    </div>
  );
}
