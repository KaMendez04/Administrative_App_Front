import { Pencil, Save, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useIncomesList } from "../../../hooks/Budget/income/useIncomeCatalog";
import { GenericTable } from "../../GenericTable";
import { useUpdateIncome } from "../../../hooks/Budget/income/useIncomeMutation";

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

function formatDateCR(value: any) {
  if (!value) return "-";
  const s = String(value).trim();
  if (!s) return "-";

  const pure = s.includes("T") ? s.slice(0, 10) : s;

  // ya viene dd/mm/yyyy
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(pure)) return pure;

  // YYYY-MM-DD -> dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(pure)) {
    const [y, m, d] = pure.split("-");
    return `${d}/${m}/${y}`;
  }

  return pure;
}

function normalizeToDateInput(value: any) {
  const v = String(value ?? "").trim();
  if (!v) return "";

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // ISO
  if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return v.slice(0, 10);

  // dd/mm/yyyy -> yyyy-mm-dd
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const dd = String(m[1]).padStart(2, "0");
    const mm = String(m[2]).padStart(2, "0");
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  return v;
}

type Props = {
  subTypeId?: number;
};

type Row = any;

export default function IncomeList({ subTypeId }: Props) {
  const q = useIncomesList();
  const mUpdate = useUpdateIncome();

  const [editingId, setEditingId] = useState<number | null>(null);

  const [draftAmount, setDraftAmount] = useState<string>("");
  const [draftDate, setDraftDate] = useState<string>("");

  const amountRef = useRef<string>("");
  const dateRef = useRef<string>("");

  const rows = useMemo(() => {
    const all = (q.data ?? []) as Row[];
    if (!subTypeId) return all;

    return all.filter(
      (row) => Number(row?.incomeSubType?.id) === Number(subTypeId)
    );
  }, [q.data, subTypeId]);

  function startEdit(row: Row) {
    const initialAmount = String(row.amount ?? "");
    const initialDate = normalizeToDateInput(row.date);

    setEditingId(row.id);

    setDraftAmount(initialAmount);
    amountRef.current = initialAmount;

    setDraftDate(initialDate);
    dateRef.current = initialDate;
  }

  function cancelEdit() {
    setEditingId(null);

    setDraftAmount("");
    amountRef.current = "";

    setDraftDate("");
    dateRef.current = "";
  }

  async function saveEdit(row: Row) {
    const amountNumber = parseCRCToNumber(amountRef.current);

    const dateValue = (dateRef.current ?? "").trim(); 

    try {
      await mUpdate.mutate({
        id: row.id,
        amount: amountNumber,
        date: dateValue, 
      });
      cancelEdit();
    } catch {
    }
  }

  const columns = useMemo<ColumnDef<Row, any>[]>(
    () => [
      {
        id: "fecha",
        header: "Fecha",
        cell: ({ row }) => {
          const r = row.original;
          const isEditing = editingId === r.id;

          // dd/mm/aaaa en tabla (sin Date())
          if (!isEditing) return formatDateCR(r?.date);

          return (
            <input
              type="date"
              className="w-full max-w-[170px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#708C3E]"
              value={draftDate}
              onChange={(e) => {
                const v = e.target.value; // YYYY-MM-DD
                setDraftDate(v);
                dateRef.current = v;
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelEdit();
                if (e.key === "Enter") saveEdit(r);
              }}
            />
          );
        },
      },
      {
        id: "subtipo",
        header: "Subtipo",
        cell: ({ row }) => row.original?.incomeSubType?.name ?? "-",
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
                const sanitized = e.target.value.replace(/[^0-9.,]/g, "");
                setDraftAmount(sanitized);
                amountRef.current = sanitized;
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
    [editingId, draftAmount, draftDate, mUpdate.loading]
  );

  if (q.error) return <p className="text-sm text-red-600">{q.error}</p>;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">

      <GenericTable<Row> data={rows} columns={columns} isLoading={q.loading} />

      {!q.loading && rows.length === 0 && subTypeId && (
        <p className="mt-3 text-xs text-gray-500">
          No hay ingresos para este subtipo.
        </p>
      )}

      {!q.loading && rows.length === 0 && !subTypeId && (
        <p className="mt-3 text-xs text-gray-500">No hay ingresos aún.</p>
      )}

      {mUpdate.error && (
        <p className="mt-3 text-xs text-red-600">{mUpdate.error}</p>
      )}
    </div>
  );
}
