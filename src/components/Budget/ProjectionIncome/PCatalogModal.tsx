import { useEffect, useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { useDepartments, useIncomeTypes } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";
import { useCreateDepartment, useCreateIncomeSubType, useCreateIncomeType } from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";


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
  onAccept,
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
  const types = useIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);

  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );
  const typeOptions = useMemo(
    () => (types.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [types.data]
  );

  // defaults / autoselección
  useEffect(() => {
    if (defaultDepartmentId) setDepartmentId(defaultDepartmentId);
  }, [defaultDepartmentId]);
  useEffect(() => {
    if (defaultIncomeTypeId) setTypeId(defaultIncomeTypeId);
  }, [defaultIncomeTypeId]);

  useEffect(() => {
    if (departmentId === "" && (dept.data?.length ?? 0) > 0) {
      setDepartmentId(dept.data[0].id);
    }
  }, [dept.data, departmentId]);

  useEffect(() => {
    if (typeof departmentId === "number" && typeId === "" && (types.data?.length ?? 0) > 0) {
      setTypeId(types.data[0].id);
    }
  }, [departmentId, types.data, typeId]);

  // mutations
  const mCreateDept = useCreateDepartment();
  const mCreateType = useCreateIncomeType();
  const mCreateSub = useCreateIncomeSubType();

  // handlers creación
  async function handleCreateDepartment() {
    setErrors((e) => ({ ...e, dept: "" }));
    if (!newDepartment.trim()) {
      setErrors((e) => ({ ...e, dept: "Escribe el nombre del departamento" }));
      return;
    }
    await mCreateDept.mutate({ name: newDepartment.trim() });
    setNewDepartment("");
    // Si tus hooks de catálogo exponen refetch, puedes llamar dept.refetch?.()
  }

  async function handleCreateType() {
    setErrors((e) => ({ ...e, type: "" }));
    if (!newType.trim()) {
      setErrors((e) => ({ ...e, type: "Escribe el nombre del tipo" }));
      return;
    }
    if (!departmentId) {
      setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
      return;
    }
    await mCreateType.mutate({
      name: newType.trim(),
      departmentId: Number(departmentId),
    });
    setNewType("");
    // types.refetch?.()
  }

  async function handleCreateSubType() {
    setErrors((e) => ({ ...e, subType: "" }));
    if (!newSubType.trim()) {
      setErrors((e) => ({ ...e, subType: "Escribe el nombre del subtipo" }));
      return;
    }
    if (!typeId) {
      setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
      return;
    }
    // ⚠️ Importante: aquí NO va amount ni date. Solo { name, incomeTypeId }
    await mCreateSub.mutate({
      name: newSubType.trim(),
      incomeTypeId: Number(typeId),
    });
    setNewSubType("");
    // subTypes.refetch?.()
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
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
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

              <input
                className="w-64 rounded-xl border border-gray-200 px-3 py-2"
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
            {errors.departmentId && <p className="text-xs text-red-600">{errors.departmentId}</p>}
            {errors.dept && <p className="text-xs text-red-600">{errors.dept}</p>}
          </section>

          {/* Tipo */}
          <section className="grid gap-2">
            <label className="text-sm font-medium text-gray-800">Tipo de ingreso</label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : "")}
                disabled={!departmentId}
              >
                <option value="">Seleccione…</option>
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                className="w-64 rounded-xl border border-gray-200 px-3 py-2"
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
            {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
            {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
          </section>

          {/* Subtipo */}
<section className="grid gap-2">
  <label className="text-sm font-medium text-gray-800">Subtipo</label>
  <div className="flex gap-2">
    <input
      className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
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
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onAccept?.();
              onClose();
            }}
            className="rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:opacity-90"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
