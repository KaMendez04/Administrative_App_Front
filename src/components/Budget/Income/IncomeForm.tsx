import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useDepartments, useIncomeSubTypes, useIncomeTypes } from "../../../hooks/Budget/income/useIncomeCatalog";
import { useCreateIncomeEntry } from "../../../hooks/Budget/income/useIncomeMutation";
import type { CreateIncomeDTO } from "../../../models/Budget/IncomeType";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { CustomSelect } from "../../CustomSelect";

type Props = {
  onSuccess?: (createdId: number) => void;
  disabled?: boolean;
};

export default function IncomeForm({ onSuccess, disabled }: Props) {
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [subTypeId, setSubTypeId] = useState<number | "">("");

  const money = useMoneyInput("");
  const amountStr: string = ((money as any).value ?? "") as string;
  const amount = parseCR(amountStr || "") ?? 0;

  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dept = useDepartments();
  const types = useIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);
  const subTypes = useIncomeSubTypes(typeof typeId === "number" ? typeId : undefined);

  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );
  const typeOptions = useMemo(
    () => (types.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [types.data]
  );
  const subTypeOptions = useMemo(
    () => (subTypes.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypes.data]
  );

  // ✅ cascada sin autoselección
  useEffect(() => {
    setTypeId("");
    setSubTypeId("");
  }, [departmentId]);
  useEffect(() => {
    setSubTypeId("");
  }, [typeId]);

  const createIncome = useCreateIncomeEntry();

  async function onSubmit() {
    setErrors({});
    if (!departmentId) return setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
    if (!typeId) return setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
    if (!subTypeId) return setErrors((e) => ({ ...e, subTypeId: "Selecciona un sub-tipo" }));
    if (!amountStr || amount <= 0) return setErrors((e) => ({ ...e, amount: "Monto requerido" }));
    if (!date) return setErrors((e) => ({ ...e, date: "Fecha requerida" }));

    const payload: CreateIncomeDTO = {
      incomeSubTypeId: Number(subTypeId),
      amount,
      date,
    };

    try {
      const res = await createIncome.mutate(payload);
      if ("setValue" in money && typeof (money as any).setValue === "function") {
        (money as any).setValue("");
      }
      onSuccess?.(res.id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo registrar el egreso" }));
    }
  }

  return (
    <div className="space-y-4">
      {/* Departamento */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Departamento</label>
        <CustomSelect
          value={departmentId}
          onChange={(value) => setDepartmentId(value ? Number(value) : "")}
          options={departmentOptions}
          placeholder="Seleccione…"
          disabled={disabled}
        />
        {errors.departmentId && <p className="text-xs text-red-600">{errors.departmentId}</p>}
      </div>

      {/* Tipo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Tipo</label>
        <CustomSelect
          value={typeId}
          onChange={(value) => setTypeId(value ? Number(value) : "")}
          options={typeOptions}
          placeholder={!departmentId ? "Seleccione un departamento…" : "Seleccione…"}
          disabled={!departmentId || disabled}
        />
        {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
      </div>

      {/* Subtipo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Subtipo</label>
        <CustomSelect
          value={subTypeId}
          onChange={(value) => setSubTypeId(value ? Number(value) : "")}
          options={subTypeOptions}
          placeholder={!typeId ? "Seleccione un tipo…" : "Seleccione…"}
          disabled={!typeId || disabled}
        />
        {errors.subTypeId && <p className="text-xs text-red-600">{errors.subTypeId}</p>}
      </div>

      {/* Fecha */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Fecha</label>
        <input
          type="date"
          className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={(() => {
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
          })()}
          disabled={disabled}
        />
        {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
      </div>

      {/* Monto */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Monto</label>
        <input
          className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="₡0,00"
          value={amountStr}
          onChange={(e) => (money as any).handleInput?.(e)}
          disabled={disabled}
        />
        {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
      </div>

      {/* Botón */}
      <button
        onClick={onSubmit}
        disabled={disabled || !departmentId || !typeId || !subTypeId || !amountStr || amount <= 0 || !date}
        className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
        Registrar Ingreso
      </button>

      {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
    </div>
  );
}