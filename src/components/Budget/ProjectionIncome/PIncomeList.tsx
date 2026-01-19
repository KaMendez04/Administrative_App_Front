import { Pencil } from "lucide-react";
import { useState } from "react";
import { usePIncomesList } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import EditPIncomeModal from "./EditPIncomeModal";

function formatMoneyCR(v: string | number) {
  const n = Number(v ?? 0);
  return n.toLocaleString("es-CR", { style: "currency", currency: "CRC" });
}

export default function PIncomeList() {
  const q = usePIncomesList();
  const [editing, setEditing] = useState<null | {
    id: number;
    amount: string;
    pIncomeTypeId: number;
    pIncomeSubTypeId: number;
  }>(null);

  if (q.loading) return <p className="text-sm text-gray-500">Cargando proyecciones…</p>;
  if (q.error) return <p className="text-sm text-red-600">{q.error}</p>;

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">Proyecciones registradas</h3>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr className="border-b">
                <th className="py-2">Subtipo</th>
                <th className="py-2">Monto</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {(q.data ?? []).map((row: any) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="py-2">{row?.pIncomeSubType?.name ?? "-"}</td>
                  <td className="py-2">{formatMoneyCR(row.amount)}</td>
                  <td className="py-2 text-right">
                    <button
                      className="inline-flex items-center gap-2 rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90"
                      onClick={() =>
                        setEditing({
                          id: row.id,
                          amount: row.amount,
                          pIncomeTypeId: row?.pIncomeSubType?.pIncomeType?.id,
                          pIncomeSubTypeId: row?.pIncomeSubType?.id,
                        })
                      }
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}

              {(!q.data || q.data.length === 0) && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={3}>
                    No hay proyecciones aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditPIncomeModal
        open={!!editing}
        onClose={() => setEditing(null)}
        income={editing}
      />
    </>
  );
}
