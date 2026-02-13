import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { CustomSelect } from "../../CustomSelect";
import { useIncomeSubTypes } from "../../../hooks/Budget/income/useIncomeCatalog";
import { useUpdateIncome } from "../../../hooks/Budget/income/useIncomeMutation";

type Props = {
  open: boolean;
  onClose: () => void;
  income: null | {
    id: number;
    amount: string;
    date: string;
    incomeTypeId: number | null;
    incomeSubTypeId: number;
  };
};

export default function EditIncomeModal({ open, onClose, income }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // bloquear scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC
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
  const amountNum = parseCR(amountStr || "") ?? 0;

  const [subTypeId, setSubTypeId] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // subtypes del type actual (para poder cambiar de subtipo sin meternos con type/depto)
  const subTypes = useIncomeSubTypes(typeof income?.incomeTypeId === "number" ? income.incomeTypeId : undefined);
  const subTypeOptions = useMemo(
    () => (subTypes.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypes.data]
  );

  // al abrir: precargar valores
  useEffect(() => {
    if (!open || !income) return;

    setErrors({});
    setSubTypeId(income.incomeSubTypeId);
    setDate(income.date);

    // set money
    if ("setValue" in money && typeof (money as any).setValue === "function") {
      // mostramos el amount como venía (string con decimales)
      (money as any).setValue(String(income.amount ?? ""));
    }
  }, [open, income]);

  const mUpdate = useUpdateIncome();

  async function onSave() {
    if (!income) return;

    setErrors({});

    if (!amountStr || amountNum <= 0) {
      return setErrors((e) => ({ ...e, amount: "Monto requerido" }));
    }
    if (!date) {
      return setErrors((e) => ({ ...e, date: "Fecha requerida" }));
    }
    if (!subTypeId) {
      return setErrors((e) => ({ ...e, subTypeId: "Subtipo requerido" }));
    }

    try {
      await mUpdate.mutate({
        id: income.id,
        amount: amountNum,
        date,
        incomeSubTypeId: Number(subTypeId),
      });

      onClose();
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el ingreso" }));
    }
  }

  if (!open || !mounted || !income) return null;

  const ui = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      <div className="relative z-[1001] w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Editar ingreso</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-4 md:p-6">
          {/* Subtipo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#33361D]">Subtipo</label>
            <CustomSelect
              value={subTypeId}
              onChange={(v) => setSubTypeId(v ? Number(v) : "")}
              options={subTypeOptions}
              placeholder="Seleccione…"
              disabled={!income.incomeTypeId}
            />
            {errors.subTypeId && <p className="text-xs text-red-600">{errors.subTypeId}</p>}
            {!income.incomeTypeId && (
              <p className="text-xs text-gray-500">
                Este ingreso no trae incomeType en la respuesta. Si querés permitir cambio de subtipo aquí, hay que
                incluir la relación en el GET.
              </p>
            )}
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#33361D]">Fecha</label>
            <input
              type="date"
              className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
          </div>

          {/* Monto */}
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
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            disabled={mUpdate.loading}
            className="rounded-xl bg-[#6B7A3A] px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
