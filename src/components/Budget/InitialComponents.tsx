import { TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import type { Row } from "../../models/Budget/initialType";


const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);


export function StatCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number;
  color: "red" | "green" | "blue";
  icon: "down" | "up" | "bars";
}) {
  const palette =
    color === "red"
      ? { text: "text-red-600", ring: "ring-red-100", icon: "text-red-500" }
      : color === "green"
      ? { text: "text-green-600", ring: "ring-green-100", icon: "text-green-500" }
      : { text: "text-blue-600", ring: "ring-blue-100", icon: "text-blue-500" };

  return (
    <div className={`rounded-2xl bg-white ring-1 ${palette.ring} shadow-sm p-5`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon === "down" && <TrendingDown className={`h-5 w-5 ${palette.icon}`} />}
        {icon === "up" && <TrendingUp className={`h-5 w-5 ${palette.icon}`} />}
        {icon === "bars" && <BarChart3 className={`h-5 w-5 ${palette.icon}`} />}
      </div>
      <div className={`mt-2 text-3xl font-semibold tracking-wide ${palette.text}`}>
        {crc(value)}
      </div>
    </div>
  );
}


export function DiffBadge({ value, context }: { value: number; context: 'income' | 'spend' }) {
  // Para ingresos: real < proyección = malo (rojo), real >= proyección = bueno (verde)
  // Para egresos: real < proyección = bueno (verde), real >= proyección = malo (rojo)
  let isGood: boolean;
  
  if (context === 'income') {
    // Para ingresos: queremos que los reales sean >= proyección
    isGood = value >= 0; // value = projected - real, entonces si value <= 0 significa real >= projected
  } else {
    // Para egresos: queremos que los reales sean <= proyección
    isGood = value <= 0; // value = projected - real, entonces si value >= 0 significa real <= projected
  }
  
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isGood ? "bg-green-50 text-green-700 ring-1 ring-green-100" : "bg-red-50 text-red-700 ring-1 ring-red-100",
      ].join(" ")}
    >
      {crc(value)}
    </span>
  );
}


export function DataTable({
  title,
  rows,
  realLabel,
  projLabel,
  totalReal,
  totalProjected,
  totalDiff,
  context = 'income', // Añadimos context con valor por defecto
}: {
  title: string;
  rows: Row[];
  realLabel: string;
  projLabel: string;
  /** Totales ya calculados por el backend (o preprocesados en el hook/servicio) */
  totalReal: number;
  totalProjected: number;
  /** totalProjected - totalReal (o el valor que defina tu back) */
  totalDiff: number;
  /** Contexto para determinar el color de las diferencias */
  context?: 'income' | 'spend';
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>
      <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-5 py-3 font-medium">Departamentos</th>
              <th className="px-5 py-3 font-medium">{realLabel}</th>
              <th className="px-5 py-3 font-medium">{projLabel}</th>
              <th className="px-5 py-3 font-medium">Diferencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50/60">
                <td className="px-5 py-3 text-gray-900">{r.department}</td>
                <td className="px-5 py-3">{crc(r.spent)}</td>
                <td className="px-5 py-3">{crc(r.projected)}</td>
                <td className="px-5 py-3">
                  {/* La diferencia por fila puede venir del back; si la necesitas por fila, añade el campo en Row */}
                  <DiffBadge value={r.spent - r.projected} context={context} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-gray-500" colSpan={4}>
                  Sin datos por ahora.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr className="text-sm font-semibold text-gray-800">
              <td className="px-5 py-3">Totales</td>
              <td className="px-5 py-3">{crc(totalReal)}</td>
              <td className="px-5 py-3">{crc(totalProjected)}</td>
              <td className="px-5 py-3">
                <DiffBadge value={totalDiff} context={context} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}