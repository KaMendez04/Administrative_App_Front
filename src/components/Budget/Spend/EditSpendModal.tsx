import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { CustomSelect } from "../../CustomSelect";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { useSpendSubTypes } from "../../../hooks/Budget/spend/useSpendCatalog";
import { useUpdateSpend } from "../../../hooks/Budget/spend/useSpendMutation";

type Props = {
  open: boolean;
  onClose: () => void;
  spend: null | {
    id: number;
    amount: string;
    spendTypeId?: number;
    spendSubTypeId?: number;
  };
};

export default function EditSpendModal({ open, onClose, spend }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const money = useMoneyInput("");
  const amountStr: string = ((money as any).value ?? "") as string;
  const amount = parseCR(amountStr || "") ?? 0;

  const [subTypeId, setSubTypeId] = useState<number | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !spend) return;

    setErrors({});
    setSubTypeId(spend.spendSubTypeId ?? "");

    if ("setValue" in money && typeof (money as any).setValue === "function") {
      (money as any).setValue(String(spend.amount ?? ""));
    }
  }, [open, spend?.id]);

  const subTypes = useSpendSubTypes(
    typeof spend?.spendTypeId === "number" ? spend.spendTypeId : undefined
  );

  const subTypeOptions = useMemo(
    () => (subTypes.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypes.data]
  );

  const update = useUpdateSpend();

  async function onSave() {
    setErrors({});
    if (!spend?.id) return;

    if (!subTypeId) return setErrors((e) => ({ ...e, subTypeId: "Selecciona un subtipo" }));
    if (!amountStr || amount <= 0) return setErrors((e) => ({ ...e, amount: "Monto requerido" }));

    try {
      await update.mutate({
        id: spend.id,
        amount,
        spendSubTypeId: Number(subTypeId),
      });
      onClose();
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar" }));
    }
  }

  if (!open || !mounted || !spend) return null;

  const ui = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      <div className="relative z-[1001] w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Editar egreso</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-4 md:p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#33361D]">Subtipo</label>
            <CustomSelect
              value={subTypeId}
              onChange={(v) => setSubTypeId(v ? Number(v) : "")}
              options={subTypeOptions}
              placeholder="Seleccione…"
            />
            {errors.subTypeId && <p className="text-xs text-red-600">{errors.subTypeId}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#33361D]">Monto</label>
            <input
              className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
              placeholder="₡0,00"
              value={amountStr}
              onChange={(e) => (money as any).handleInput?.(e)}
            />
            {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
          </div>

          {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t p-4 md:p-5">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onSave} className="rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
