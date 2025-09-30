import type { SpendTableRow } from "../../../models/Budget/reports/spend";

type Props = { rows: SpendTableRow[]; loading?: boolean };

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export default function SpendTable({ rows, loading }: Props) {
  if (loading) return <div className="p-6 text-gray-400 font-medium">Cargando…</div>;
  if (!rows?.length) return <div className="p-6 text-center text-gray-400 font-medium">Sin resultados</div>;

  return (
    <div className="overflow-x-auto">
      <div className="bg-[#EAEFE0] px-4 py-3">
        <div className="grid grid-cols-5 gap-4 text-sm font-bold text-[#33361D]">
          <div>Departamento</div>
          <div>Tipo</div>
          <div>Subtipo</div>
          <div>Fecha</div>
          <div className="text-right">Monto</div>
        </div>
      </div>
      <div className="bg-white">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition rounded-t-lg"
          >
            <div className="font-medium">{r.department}</div>
            <div className="font-medium">{r.spendType}</div>
            <div className="font-medium">{r.spendSubType}</div>
            <div className="font-medium">
              {r.date
                ? new Date(r.date).toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "—"}
            </div>
            <div className="text-right font-bold text-[#5B732E]">{crc(r.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
