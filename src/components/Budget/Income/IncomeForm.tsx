import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { parseCR, useMoneyInput } from "../../../hooks/Budget/useMoneyInput";
import { CustomSelect } from "../../CustomSelect";

import { useDepartments, useIncomeSubTypes, useIncomeTypes } from "../../../hooks/Budget/income/useIncomeCatalog";
import { useCreateIncomeEntry } from "../../../hooks/Budget/income/useIncomeMutation";
import type { CreateIncomeDTO } from "../../../models/Budget/IncomeType";

// 👇 traer proyección para mezclar
import { usePIncomeTypes, usePIncomeSubTypes } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import {
  useEnsureIncomeSubTypeFromProjection,
  useEnsureIncomeTypeFromProjection, // ✅
} from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";

type Props = {
  onSuccess?: (createdId: number) => void;
  disabled?: boolean;
};

type OriginId = `r:${number}` | `p:${number}`;

function parseOriginId(v: string | number | ""): { origin: "r" | "p"; id: number } | null {
  if (!v) return null;
  const s = String(v);
  const [origin, raw] = s.split(":");
  const id = Number(raw);
  if ((origin !== "r" && origin !== "p") || !Number.isFinite(id)) return null;
  return { origin: origin as "r" | "p", id };
}

export default function IncomeForm({ onSuccess, disabled }: Props) {
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeKey, setTypeKey] = useState<OriginId | "">("");
  const [subTypeKey, setSubTypeKey] = useState<OriginId | "">("");

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

  // ===== Queries =====
  const dept = useDepartments();

  // reales
  const realTypes = useIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);

  // proyección (mismo dept)
  const projTypes = usePIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);

  // subtypes dependen del type seleccionado (origen)
  const typeParsed = parseOriginId(typeKey);

  const realSubTypes = useIncomeSubTypes(typeParsed?.origin === "r" ? typeParsed.id : undefined);
  const projSubTypes = usePIncomeSubTypes(typeParsed?.origin === "p" ? typeParsed.id : undefined);

  // ===== Options =====
  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  const typeOptions = useMemo(() => {
    const real = (realTypes.data ?? []).map((t) => ({
      label: t.name,
      value: `r:${t.id}` as OriginId,
    }));

    const proj = (projTypes.data ?? []).map((s) => ({
      label: s.name,
      value: `p:${s.id}` as OriginId,
    }));

    return [...real, ...proj];
  }, [realTypes.data, projTypes.data]);

  const subTypeOptions = useMemo(() => {
    if (!typeParsed) return [];
    if (typeParsed.origin === "r") {
      return (realSubTypes.data ?? []).map((s) => ({
        label: s.name,
        value: `r:${s.id}` as OriginId,
      }));
    }
    // si elegiste TYPE de proyección, aquí vienen subtypes de proyección
    return (projSubTypes.data ?? []).map((s) => ({
      label: s.name, // 👈 opcional: sin "(Proyección)" porque ya se ve arriba
      value: `p:${s.id}` as OriginId,
    }));
  }, [typeParsed, realSubTypes.data, projSubTypes.data]);

  // ===== Cascada =====
  useEffect(() => {
    setTypeKey("");
    setSubTypeKey("");
  }, [departmentId]);

  useEffect(() => {
    setSubTypeKey("");
  }, [typeKey]);

  // ===== Mutations =====
  const createIncome = useCreateIncomeEntry();

  const ensureTypeFromProj = useEnsureIncomeTypeFromProjection(); // ✅
  const ensureSubFromProj = useEnsureIncomeSubTypeFromProjection();

  async function onSubmit() {
    setErrors({});

    if (!departmentId) return setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
    if (!typeKey) return setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
    if (!subTypeKey) return setErrors((e) => ({ ...e, subTypeId: "Selecciona un sub-tipo" }));
    if (!amountStr || amount <= 0) return setErrors((e) => ({ ...e, amount: "Monto requerido" }));
    if (!date) return setErrors((e) => ({ ...e, date: "Fecha requerida" }));

    try {
      const tParsed = parseOriginId(typeKey);
      const sParsed = parseOriginId(subTypeKey);

      if (!tParsed) return setErrors((e) => ({ ...e, typeId: "Tipo inválido" }));
      if (!sParsed) return setErrors((e) => ({ ...e, subTypeId: "Subtipo inválido" }));

      let realIncomeSubTypeId: number;

      // ✅ SOLO AQUÍ creamos (si hace falta) los catálogos reales basados en proyección
      if (sParsed.origin === "p") {
        // 1) asegurar type real desde type proyección (por si el backend lo necesita)
        if (tParsed.origin === "p") {
          await ensureTypeFromProj.mutate(tParsed.id);
        }

        // 2) asegurar subtipo real desde subtipo proyección
        const ensuredSub = await ensureSubFromProj.mutate(sParsed.id);
        realIncomeSubTypeId = Number((ensuredSub as any).id);
      } else {
        realIncomeSubTypeId = sParsed.id;
      }

      const payload: CreateIncomeDTO = {
        incomeSubTypeId: realIncomeSubTypeId,
        amount,
        date,
      };

      const res = await createIncome.mutate(payload);

      // reset UI
      if ("setValue" in money && typeof (money as any).setValue === "function") {
        (money as any).setValue("");
      }
      setDepartmentId("");
      setTypeKey("");
      setSubTypeKey("");

      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);

      onSuccess?.(res.id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo registrar el ingreso" }));
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
          value={typeKey}
          onChange={(value) => setTypeKey(value ? (String(value) as OriginId) : "")}
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
          value={subTypeKey}
          onChange={(value) => setSubTypeKey(value ? (String(value) as OriginId) : "")}
          options={subTypeOptions}
          placeholder={!typeKey ? "Seleccione un tipo…" : "Seleccione…"}
          disabled={!typeKey || disabled}
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
          disabled={disabled || !departmentId || !typeKey || !subTypeKey || !amountStr || amount <= 0 || !date}
          className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Registrar Ingreso
        </button>
        {errors.api && <p className="text-xs text-red-600 mt-3">{errors.api}</p>}
      </div>
    </div>
  );
}
