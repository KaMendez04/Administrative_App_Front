import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  useDepartments,
  useSpendSubTypes,
  useSpendTypes,
  usePSpendTypes,
  usePSpendSubTypes,
} from "../../../hooks/Budget/spend/useSpendCatalog";
import { useCreateSpendEntry, useEnsureSpendSubTypeFromProjection } from "../../../hooks/Budget/spend/useSpendMutation";
import type { CreateSpendDTO } from "../../../models/Budget/SpendType";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { CustomSelect } from "../../CustomSelect";

type Props = {
  onSuccess?: (createdId: number) => void;
  disabled?: boolean;
  fiscalYearId?: number; // opcional si ya lo tenés en UI
};

function parseSelectValue(v: string) {
  const [origin, idStr] = v.split(":");
  return { origin, id: Number(idStr) };
}

export default function SpendForm({ onSuccess, disabled, fiscalYearId }: Props) {
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeValue, setTypeValue] = useState<string>("");     // "r:ID" | "p:ID"
  const [subTypeValue, setSubTypeValue] = useState<string>(""); // "r:ID" | "p:ID"

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
  const typesR = useSpendTypes(typeof departmentId === "number" ? departmentId : undefined);
  const typesP = usePSpendTypes(typeof departmentId === "number" ? departmentId : undefined, fiscalYearId);

  const parsedType = useMemo(() => (typeValue ? parseSelectValue(typeValue) : null), [typeValue]);

  // Subtypes: reales o proyección según el tipo seleccionado
  const subTypesR = useSpendSubTypes(parsedType?.origin === "r" ? parsedType.id : undefined);

  const subTypesP = usePSpendSubTypes(
    parsedType?.origin === "p"
      ? {
          departmentId: typeof departmentId === "number" ? departmentId : undefined,
          typeId: parsedType.id, // pSpendTypeId
          fiscalYearId,
        }
      : undefined
  );

  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  const typeOptions = useMemo(() => {
    const r = (typesR.data ?? []).map((t) => ({ label: t.name, value: `r:${t.id}` }));
    const p = (typesP.data ?? []).map((t) => ({
  label: t.name,
  value: `p:${t.id}`,
  }));
    return [...r, ...p];
  }, [typesR.data, typesP.data]);

  const subTypeOptions = useMemo(() => {
    if (!parsedType) return [];
    if (parsedType.origin === "r") {
      return (subTypesR.data ?? []).map((s) => ({ label: s.name, value: `r:${s.id}` }));
    }
    return (subTypesP.data ?? []).map((s) => ({
    label: s.name,
    value: `p:${s.id}`,
  }));
  }, [parsedType, subTypesR.data, subTypesP.data]);

  useEffect(() => {
    setTypeValue("");
    setSubTypeValue("");
  }, [departmentId]);

  useEffect(() => {
    setSubTypeValue("");
  }, [typeValue]);

  const createSpend = useCreateSpendEntry();
  const ensureSubType = useEnsureSpendSubTypeFromProjection();

  async function onSubmit() {
    setErrors({});

    if (!departmentId) return setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
    if (!typeValue) return setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
    if (!subTypeValue) return setErrors((e) => ({ ...e, subTypeId: "Selecciona un sub-tipo" }));
    if (!amountStr || amount <= 0) return setErrors((e) => ({ ...e, amount: "Monto requerido" }));
    if (!date) return setErrors((e) => ({ ...e, date: "Fecha requerida" }));

    let spendSubTypeId: number;

    const st = parseSelectValue(subTypeValue);
    if (st.origin === "r") {
      spendSubTypeId = st.id;
    } else {
      // viene de proyección -> ensure
      const real = await ensureSubType.mutate(st.id);
      spendSubTypeId = Number(real.id);
    }

    const payload: CreateSpendDTO = {
      spendSubTypeId,
      amount,
      date,
    };

    try {
      const res = await createSpend.mutate(payload);

      if ("setValue" in money && typeof (money as any).setValue === "function") {
        (money as any).setValue("");
      }
      setDepartmentId("");
      setTypeValue("");
      setSubTypeValue("");

      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);

      onSuccess?.(res.id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo registrar el egreso" }));
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {/* Departamento */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#33361D]">Departamento</label>
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
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#33361D]">Tipo</label>
        <CustomSelect
          value={typeValue}
          onChange={(value) => setTypeValue(value ? String(value) : "")}
          options={typeOptions}
          placeholder={!departmentId ? "Seleccione un departamento…" : "Seleccione…"}
          disabled={!departmentId || disabled}
        />
        {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
      </div>

      {/* Subtipo */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#33361D]">Subtipo</label>
        <CustomSelect
          value={subTypeValue}
          onChange={(value) => setSubTypeValue(value ? String(value) : "")}
          options={subTypeOptions}
          placeholder={!typeValue ? "Seleccione un tipo…" : "Seleccione…"}
          disabled={!typeValue || disabled}
        />
        {errors.subTypeId && <p className="text-xs text-red-600">{errors.subTypeId}</p>}
      </div>

      {/* Fecha */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#33361D]">Fecha</label>
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
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#33361D]">Monto</label>
        <input
          className="rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="₡0,00"
          value={amountStr}
          onChange={(e) => (money as any).handleInput?.(e)}
          disabled={disabled}
        />
        {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={onSubmit}
          disabled={disabled || !departmentId || !typeValue || !subTypeValue || !amountStr || amount <= 0 || !date}
          className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Registrar egreso
        </button>
        {errors.api && <p className="text-xs text-red-600 mt-3">{errors.api}</p>}
      </div>
    </div>
  );
}
