import { useEffect, useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { useDepartments, usePIncomeTypes } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import { useCreateDepartment, useCreateIncomeSubType, useCreateIncomeType } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";
import type { PIncomeType } from "../../../models/Budget/incomeProjectionType";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultDepartmentId?: number;
  defaultIncomeTypeId?: number;
  onAccept?: () => void;
};

export default function CatalogModal({
  open,
  onClose,
  defaultDepartmentId,
  defaultIncomeTypeId,
}: Props) {
  // selección actual
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");

  // inputs de creación
  const [newDepartment, setNewDepartment] = useState("");
  const [newType, setNewType] = useState("");
  const [newSubType, setNewSubType] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // queries
  const dept = useDepartments();
  const types = usePIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);

  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );
  const typeOptions = useMemo(
    () => (types.data ?? []).map((t: PIncomeType) => ({ label: t.name, value: t.id })),
    [types.data]
  );

  // inicialización al abrir (sin autoselección)
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setNewDepartment("");
    setNewType("");
    setNewSubType("");
    if (defaultDepartmentId) {
      setDepartmentId(defaultDepartmentId);
      setTypeId(defaultIncomeTypeId ?? "");
    } else {
      setDepartmentId("");
      setTypeId("");
    }
  }, [open, defaultDepartmentId, defaultIncomeTypeId]);

  // cascada
  useEffect(() => {
    setTypeId("");
    setNewSubType("");
  }, [departmentId]);

  useEffect(() => {
    setNewSubType("");
  }, [typeId]);

  // mutations
  const mCreateDept = useCreateDepartment();
  const mCreateType = useCreateIncomeType();
  const mCreateSub = useCreateIncomeSubType();

  // handlers creación
  async function handleCreateDepartment() {
    setErrors((e) => ({ ...e, dept: "", api: "" }));
    if (!newDepartment.trim()) {
      setErrors((e) => ({ ...e, dept: "Escribe el nombre del departamento" }));
      return;
    }
    try {
      const created = await mCreateDept.mutate({ name: newDepartment.trim() });
      setNewDepartment("");
      if ((created as any)?.id) setDepartmentId((created as any).id); // autoselecciono el nuevo
      // dept.refetch?.()
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el departamento" }));
    }
  }

  async function handleCreateType() {
    setErrors((e) => ({ ...e, type: "", api: "" }));
    if (!newType.trim()) {
      setErrors((e) => ({ ...e, type: "Escribe el nombre del tipo" }));
      return;
    }
    if (!departmentId) {
      setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
      return;
    }
    try {
      const created = await mCreateType.mutate({
        name: newType.trim(),
        departmentId: Number(departmentId),
      });
      setNewType("");
      if ((created as any)?.id) setTypeId((created as any).id); // autoselecciono el nuevo
      // types.refetch?.()
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el tipo" }));
    }
  }

  async function handleCreateSubType() {
    setErrors((e) => ({ ...e, subType: "", api: "" }));
    if (!newSubType.trim()) {
      setErrors((e) => ({ ...e, subType: "Escribe el nombre del subtipo" }));
      return;
    }
    if (!typeId) {
      setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
      return;
    }
    try {
      await mCreateSub.mutate({
        name: newSubType.trim(),
        pIncomeTypeId: Number(typeId),
      });
      setNewSubType("");
      // subTypes.refetch?.()
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el subtipo" }));
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Catálogo de Ingresos</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-4 md:p-6">
          {/* Departamento */}
          <section className="grid gap-2">
            <label className="text-sm font-medium text-gray-800">Departamento</label>
            <div className="flex flex-col gap-2 md:flex-row">
              <select
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">Seleccione…</option>
                {departmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex w-full gap-2 md:w-auto">
                <input
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Nuevo departamento"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleCreateDepartment}
                  disabled={mCreateDept.loading || !newDepartment.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  title="Crear departamento"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>
            </div>
            {errors.departmentId && <p className="text-xs text-red-600">{errors.departmentId}</p>}
            {errors.dept && <p className="text-xs text-red-600">{errors.dept}</p>}
          </section>

          {/* Tipo */}
          <section className="grid gap-2">
            <label className="text-sm font-medium text-gray-800">Tipo de ingreso</label>
            <div className="flex flex-col gap-2 md:flex-row">
              <select
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : "")}
                disabled={!departmentId}
              >
                <option value="">{!departmentId ? "Seleccione un departamento…" : "Seleccione…"}</option>
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex w-full gap-2 md:w-auto">
                <input
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                  placeholder="Nuevo tipo"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  disabled={!departmentId}
                />
                <button
                  type="button"
                  onClick={handleCreateType}
                  disabled={mCreateType.loading || !newType.trim() || !departmentId}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  title="Crear tipo"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>
            </div>
            {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
            {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
          </section>

          {/* Subtipo */}
          <section className="grid gap-2">
            <label className="text-sm font-medium text-gray-800">Subtipo</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                placeholder="Nuevo subtipo"
                value={newSubType}
                onChange={(e) => setNewSubType(e.target.value)}
                disabled={!typeId}
              />
              <button
                type="button"
                onClick={handleCreateSubType}
                disabled={mCreateSub.loading || !newSubType.trim() || !typeId}
                className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                title="Crear subtipo"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>
            {errors.subType && <p className="text-xs text-red-600">{errors.subType}</p>}
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t p-4 md:p-5">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
