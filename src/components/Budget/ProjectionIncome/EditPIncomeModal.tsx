import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CustomSelect } from "../../CustomSelect";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { usePIncomeSubTypes } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import { useUpdatePIncome } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";

type Props = {
  open: boolean;
  onClose: () => void;
  income: {
    id: number;
    amount: string;
    pIncomeTypeId: number;
    pIncomeSubTypeId: number;
  } | null;
};

export default function EditPIncomeModal({ open, onClose, income }: Props) {
  const money = useMoneyInput(income?.amount ?? "");
  const amountStr = (money as any).value ?? "";
  const amount = parseCR(amountStr || "") ?? 0;

  const [subTypeId, setSubTypeId] = useState<number | "">("");

  const subTypes = usePIncomeSubTypes(income?.pIncomeTypeId);
  const update = useUpdatePIncome();

  useEffect(() => {
    if (!open || !income) return;
    setSubTypeId(income.pIncomeSubTypeId);
    (money as any).setValue?.(income.amount);
  }, [open, income]);

  async function onSave() {
    if (!income) return;

    await update.mutate({
      id: income.id,
      amount,
      pIncomeSubTypeId: Number(subTypeId),
    });

    onClose();
  }

  if (!open || !income) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Editar proyección</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <CustomSelect
            value={subTypeId}
            onChange={(v) => setSubTypeId(v ? Number(v) : "")}
            options={(subTypes.data ?? []).map((s) => ({
              label: s.name,
              value: s.id,
            }))}
            placeholder="Subtipo…"
          />

          <input
            className="w-full rounded-xl border px-3 py-2"
            value={amountStr}
            onChange={(e) => (money as any).handleInput?.(e)}
          />
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-[#6B7A3A] px-4 py-2 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
