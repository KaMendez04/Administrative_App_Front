import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { useDepartments, usePIncomeSubTypes, usePIncomeTypes } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import type { CreatePIncomeDTO } from "../../../models/Budget/incomeProjectionType";
import { useCreatePIncomeEntry } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dept = useDepartments();
  const types = usePIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);
  const subTypes = usePIncomeSubTypes(typeof typeId === "number" ? typeId : undefined);

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

  const createIncome = useCreatePIncomeEntry();

  async function onSubmit() {
    setErrors({});

    if (!departmentId) return setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
    if (!typeId) return setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
    if (!subTypeId) return setErrors((e) => ({ ...e, subTypeId: "Selecciona un sub-tipo" }));
    if (!amountStr || amount <= 0) return setErrors((e) => ({ ...e, amount: "Monto requerido" }));

    const payload: CreatePIncomeDTO = {
      pIncomeSubTypeId: Number(subTypeId),
      amount, // el service lo serializa a string con 2 decimales
    };

    try {
      const res = await createIncome.mutate(payload);
      if ("setValue" in money && typeof (money as any).setValue === "function") {
        (money as any).setValue("");
      }
      onSuccess?.(res.id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo registrar el gasto" }));
    }
  }

  return (
    <div className="space-y-4">
      {/* Departamento */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Departamento</label>
        <select
          className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : "")}
          disabled={disabled}
        >
          <option value="">Seleccione…</option>
          {departmentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.departmentId && <p className="text-xs text-red-600">{errors.departmentId}</p>}
      </div>

      {/* Tipo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Tipo</label>
        <select
          className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : "")}
          disabled={!departmentId || disabled}
        >
          <option value="">{!departmentId ? "Seleccione un departamento…" : "Seleccione…"}</option>
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
      </div>

      {/* Subtipo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">Subtipo</label>
        <select
          className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={subTypeId}
          onChange={(e) => setSubTypeId(e.target.value ? Number(e.target.value) : "")}
          disabled={!typeId || disabled}
        >
          <option value="">{!typeId ? "Seleccione un tipo…" : "Seleccione…"}</option>
          {subTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.subTypeId && <p className="text-xs text-red-600">{errors.subTypeId}</p>}
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
        disabled={disabled || !departmentId || !typeId || !subTypeId || !amountStr || amount <= 0}
        className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
        Registrar proyección de ingreso
      </button>

      {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
    </div>
  );
}
