import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useDepartments, useIncomeProjectionSubTypes, useIncomeProjectionTypes } from "../../../hooks/Budget/useIncomeProjectionCatalog";
import { parseCR, useProjectionMoneyInput } from "../../../hooks/Budget/useProjectionMoneyInput";
import { useCreateIncomeProjection } from "../../../hooks/Budget/useIncomeProjectionMutations";
import type { IncomeProjectionCreateDTO } from "../../../models/Budget/incomeProjectionType";
import { projectionSchema } from "../../../schemas/incomeProjection. schemas";



type Props = {
  onSuccess?: (createdId: number) => void;
  disabled?: boolean;
};

export default function IncomeProjectionForm({ onSuccess, disabled }: Props) {
  // Local form state
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [subTypeId, setSubTypeId] = useState<number | "">("");
  const [detail, setDetail] = useState<string>("");
  const [amountStr, setAmountStr] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});


  const dept = useDepartments();
  const types = useIncomeProjectionTypes(typeof departmentId === "number" ? departmentId : undefined);
  const subTypes = useIncomeProjectionSubTypes(typeof typeId === "number" ? typeId : undefined);


  const { handleInput } = useProjectionMoneyInput();


  const createProjection = useCreateIncomeProjection();

  // Options
  const departmentOptions = useMemo(
    () => (dept.data ?? []).map(d => ({ label: d.name, value: d.id })),
    [dept.data]
  );
  const typeOptions = useMemo(
    () => (types.data ?? []).map(t => ({ label: t.name, value: t.id })),
    [types.data]
  );
  const subTypeOptions = useMemo(
    () => (subTypes.data ?? []).map(s => ({ label: s.name, value: s.id })),
    [subTypes.data]
  );

  // Handlers encadenados
  const onDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value ? Number(e.target.value) : "";
    setDepartmentId(v);
    setTypeId("");
    setSubTypeId("");
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value ? Number(e.target.value) : "";
    setTypeId(v);
    setSubTypeId("");
  };

  const onSubTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value ? Number(e.target.value) : "";
    setSubTypeId(v);
  };

  // Submit
  const onSubmit = async () => {
    setErrors({});
    const amount = parseCR(amountStr);

    const payload: IncomeProjectionCreateDTO = {
      departmentId: departmentId as number,
      incomeProjectionTypeId: typeId as number,
      incomeProjectionSubTypeId: subTypeId as number,
      amount,
      detail: detail?.trim() ? detail.trim() : undefined,
    };

    const parsed = projectionSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        const path = iss.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = iss.message;
      });
      if (!amount) fieldErrors["amount"] = "Required";
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await createProjection.mutate(payload);
      // limpiar
      setDepartmentId("");
      setTypeId("");
      setSubTypeId("");
      setAmountStr("");
      setDetail("");
      onSuccess?.(res.id);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        api: err?.message || "Error al crear la proyección",
      }));
    }
  };

  const isSubmitting = createProjection.loading || !!disabled;

  return (
    <div className="mt-8 grid grid-cols-1 gap-6">
      {/* Departamento */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">Departamento</label>
          {errors.departmentId && <span className="text-xs text-red-600">{errors.departmentId}</span>}
        </div>
        <select
          value={departmentId}
          onChange={onDepartmentChange}
          disabled={dept.loading || isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
        >
          <option value="">Selecciona un departamento</option>
          {departmentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {dept.error && <p className="mt-1 text-xs text-red-600">No se pudo cargar departamentos.</p>}
      </div>

      {/* Tipo */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">Tipo</label>
          {errors.incomeProjectionTypeId && (
            <span className="text-xs text-red-600">{errors.incomeProjectionTypeId}</span>
          )}
        </div>
        <select
          value={typeId}
          onChange={onTypeChange}
          disabled={!departmentId || types.loading || isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40 disabled:bg-gray-50"
        >
          <option value="">Selecciona un tipo</option>
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {types.error && <p className="mt-1 text-xs text-red-600">No se pudo cargar tipos.</p>}
      </div>

      {/* SubTipo */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">SubTipo</label>
          {errors.incomeProjectionSubTypeId && (
            <span className="text-xs text-red-600">{errors.incomeProjectionSubTypeId}</span>
          )}
        </div>
        <select
          value={subTypeId}
          onChange={onSubTypeChange}
          disabled={!typeId || subTypes.loading || isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40 disabled:bg-gray-50"
        >
          <option value="">Selecciona un subtipo</option>
          {subTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {subTypes.error && <p className="mt-1 text-xs text-red-600">No se pudo cargar subtipos.</p>}
      </div>

      {/* Monto */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">Monto</label>
          {errors.amount && <span className="text-xs text-red-600">{errors.amount}</span>}
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₡</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={15}
            placeholder="0"
            value={amountStr}
            onInput={(e) => {
              handleInput(e);
              setAmountStr(e.currentTarget.value);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-3 text-gray-900 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
            disabled={isSubmitting}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">Máx. 15 caracteres</p>
      </div>


      {/* Botones */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          disabled
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-500 cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={
            isSubmitting ||
            !departmentId ||
            !typeId ||
            !subTypeId ||
            !parseCR(amountStr)
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Registrar Partida
        </button>
      </div>

      {errors.api && <p className="text-sm text-red-600 mt-2">{errors.api}</p>}
    </div>
  );
}
