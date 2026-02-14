import { Pencil, Save, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { usePIncomesList } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import { GenericTable } from "../../GenericTable";
import { useUpdatePIncome } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";

function formatMoneyCR(v: string | number) {
  const n = Number(v ?? 0);
  return n.toLocaleString("es-CR", { style: "currency", currency: "CRC" });
}

// Convierte "₡10 000,50" -> 10000.5
function parseCRCToNumber(input: string) {
  const cleaned = (input ?? "")
    .replace(/[₡\s]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

type Props = {
  subTypeId?: number;
};

type Row = any;

export default function PIncomeList({ subTypeId }: Props) {
  const q = usePIncomesList();
  const mUpdate = useUpdatePIncome();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftAmount, setDraftAmount] = useState<string>("");

  const draftRef = useRef<string>("");

  const rows = useMemo(() => {
    const all = (q.data ?? []) as Row[];
    if (!subTypeId) return all;
    return all.filter(
      (row) => Number(row?.pIncomeSubType?.id) === Number(subTypeId)
    );
  }, [q.data, subTypeId]);

  function startEdit(row: Row) {
    const initial = String(row.amount ?? "");
    setEditingId(row.id);
    setDraftAmount(initial);
    draftRef.current = initial;
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftAmount("");
    draftRef.current = "";
  }

  async function saveEdit(row: Row) {
    const amountNumber = parseCRCToNumber(draftRef.current);

    try {
      await mUpdate.mutate({
        id: row.id,
        amount: amountNumber,
      });
      cancelEdit();
    } catch {
      // error manejado abajo
    }
  }

  const columns = useMemo<ColumnDef<Row, any>[]>(
    () => [
      {
        id: "subtipo",
        header: "Subtipo",
        cell: ({ row }) => row.original?.pIncomeSubType?.name ?? "-",
      },
      {
        id: "monto",
        header: "Monto",
        cell: ({ row }) => {
          const r = row.original;
          const isEditing = editingId === r.id;

          if (!isEditing) return formatMoneyCR(r.amount);

          return (
            <input
              className="w-full max-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#708C3E]"
              value={draftAmount}
              onChange={(e) => {
                // solo números, coma y punto
                const sanitized = e.target.value.replace(/[^0-9.,]/g, "");
                setDraftAmount(sanitized);
                draftRef.current = sanitized;
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelEdit();
                if (e.key === "Enter") saveEdit(r);
              }}
              placeholder="₡0,00"
              inputMode="decimal"
              autoFocus
            />
          );
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const r = row.original;
          const isEditing = editingId === r.id;

          if (isEditing) {
            return (
              // RESPONSIVE: stack en móvil, fila en desktop
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 sm:w-auto"
                  onClick={() => saveEdit(r)}
                  disabled={mUpdate.loading}
                  title="Guardar"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </button>

                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                  onClick={cancelEdit}
                  disabled={mUpdate.loading}
                  title="Cancelar"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              </div>
            );
          }

          return (
            <button
              className="
                inline-flex items-center justify-center
                rounded-lg
                border border-[#6B7A3A]
                bg-[#F8F9F3]
                p-2
                text-[#6B7A3A]
                shadow-sm
                transition-colors
                hover:bg-[#EAEFE0]
              "
              onClick={() => startEdit(r)}
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
          );
        },
      },
    ],
    [editingId, draftAmount, mUpdate.loading]
  );

  if (q.error) return <p className="text-sm text-red-600">{q.error}</p>;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">

      <GenericTable<Row>
        data={rows}
        columns={columns}
        isLoading={q.loading}
      />

      {!q.loading && rows.length === 0 && subTypeId && (
        <p className="mt-3 text-xs text-gray-500">
          No hay proyecciones para este subtipo.
        </p>
      )}

      {mUpdate.error && (
        <p className="mt-3 text-xs text-red-600">{mUpdate.error}</p>
      )}
    </div>
  );
}