import type { ExtraRow } from "../../../models/Budget/reports/extra";

const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

export default function ExtraTable({ rows, loading }: { rows: ExtraRow[]; loading?: boolean }) {
  return (
    <div className="bg-white overflow-hidden rounded-2xl shadow-sm">
      {/* Encabezado estilo IncomeReportPage */}
      <div className="bg-[#EAEFE0] px-4 py-3">
        <div className="grid grid-cols-5 gap-4 text-sm font-bold text-[#33361D]">
          <div>Concepto</div>
          <div>Fecha</div>
          <div className="text-right">Monto</div>
          <div className="text-right">Usado</div>
          <div className="text-right">Restante</div>
        </div>
      </div>

      {/* Filas */}
      <div className="bg-white">
        {loading && (
          <div className="py-10 text-center text-gray-400">Cargando…</div>
        )}

        {!loading && rows.length === 0 && (
          <div className="py-10 text-center text-gray-400">Sin resultados</div>
        )}

        {!loading && rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-5 gap-4 px-4 py-3 text-sm text-[#33361D] hover:bg-[#F8F9F3] transition"
          >
            <div className="font-medium">{r.name ?? "—"}</div>
            <div>{r.date ?? "—"}</div>
            <div className="text-right font-bold text-[#5B732E]">{crc(r.amount)}</div>
            <div className="text-right">{crc(r.used)}</div>
            <div className="text-right font-bold text-[#C19A3D]">{crc(r.remaining)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
