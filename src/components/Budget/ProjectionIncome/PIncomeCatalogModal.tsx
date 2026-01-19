import { useEffect, useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { CustomSelect } from "../../CustomSelect";
import type { PIncomeType } from "../../../models/Budget/incomeProjectionType";

import {
  useDepartments,
  usePIncomeTypes,
  usePIncomeSubTypes, // ✅ NUEVO (Paso 3)
} from "../../../hooks/Budget/projectionIncome/useIncomeProjectionCatalog";

import {
  useCreateDepartment,
  useCreateIncomeSubType,
  useCreateIncomeType,
  useUpdateDepartment,
  useUpdateIncomeType,
  useUpdateIncomeSubType, // ✅ NUEVO (Paso 3)
} from "../../../hooks/Budget/projectionIncome/useIncomeProjectionMutations";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  defaultDepartmentId?: number;
  defaultIncomeTypeId?: number;
};

export default function CatalogModal({
  open,
  onClose,
  mode = "create",
  defaultDepartmentId,
  defaultIncomeTypeId,
}: Props) {
  // ===== EDIT: Departamento =====
  const [editDepartmentId, setEditDepartmentId] = useState<number | "">("");
  const [editDepartmentName, setEditDepartmentName] = useState("");

  // ===== EDIT: Tipo =====
  const [editTypeDepartmentId, setEditTypeDepartmentId] = useState<number | "">("");
  const [editTypeId, setEditTypeId] = useState<number | "">("");
  const [editTypeName, setEditTypeName] = useState("");

  // ===== EDIT: Subtipo (Paso 3) =====
  const [editSubTypeDepartmentId, setEditSubTypeDepartmentId] = useState<number | "">("");
  const [editSubTypeTypeId, setEditSubTypeTypeId] = useState<number | "">("");
  const [editSubTypeId, setEditSubTypeId] = useState<number | "">("");
  const [editSubTypeName, setEditSubTypeName] = useState("");

  // ===== CREATE: selección actual =====
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");

  // ===== CREATE: inputs =====
  const [newDepartment, setNewDepartment] = useState("");
  const [newType, setNewType] = useState("");
  const [newSubType, setNewSubType] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== Queries base =====
  const dept = useDepartments();

  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  // ===== CREATE: tipos dependen de departmentId =====
  const types = usePIncomeTypes(
    mode === "create" && typeof departmentId === "number" ? departmentId : undefined
  );

  const typeOptions = useMemo(
    () => (types.data ?? []).map((t: PIncomeType) => ({ label: t.name, value: t.id })),
    [types.data]
  );

  // ===== EDIT: tipos dependen de editTypeDepartmentId =====
  const editTypes = usePIncomeTypes(
    mode === "edit" && typeof editTypeDepartmentId === "number" ? editTypeDepartmentId : undefined
  );

  const editTypeOptions = useMemo(
    () => (editTypes.data ?? []).map((t: PIncomeType) => ({ label: t.name, value: t.id })),
    [editTypes.data]
  );

  // ===== EDIT (Paso 3): Tipos para editar Subtipo dependen de editSubTypeDepartmentId =====
  const editSubTypesTypes = usePIncomeTypes(
    mode === "edit" && typeof editSubTypeDepartmentId === "number" ? editSubTypeDepartmentId : undefined
  );

  const editSubTypesTypeOptions = useMemo(
    () => (editSubTypesTypes.data ?? []).map((t: PIncomeType) => ({ label: t.name, value: t.id })),
    [editSubTypesTypes.data]
  );

  // ===== EDIT (Paso 3): Subtipos dependen de editSubTypeTypeId =====
  const subTypesEdit = usePIncomeSubTypes(
    mode === "edit" && typeof editSubTypeTypeId === "number" ? editSubTypeTypeId : undefined
  );

  const editSubTypeOptions = useMemo(
    () => (subTypesEdit.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypesEdit.data]
  );

  // ===== Inicialización al abrir =====
  useEffect(() => {
    if (!open) return;

    setErrors({});
    setNewDepartment("");
    setNewType("");
    setNewSubType("");

    // reset create
    setDepartmentId("");
    setTypeId("");

    // reset edit
    setEditDepartmentId("");
    setEditDepartmentName("");
    setEditTypeDepartmentId("");
    setEditTypeId("");
    setEditTypeName("");

    // ✅ reset edit Subtipo (Paso 3)
    setEditSubTypeDepartmentId("");
    setEditSubTypeTypeId("");
    setEditSubTypeId("");
    setEditSubTypeName("");

    // modo create: si vienen defaults, se aplican
    if (mode === "create" && defaultDepartmentId) {
      setDepartmentId(defaultDepartmentId);
      setTypeId(defaultIncomeTypeId ?? "");
    }
  }, [open, mode, defaultDepartmentId, defaultIncomeTypeId]);

  // ===== Cascada (solo create) =====
  useEffect(() => {
    if (mode !== "create") return;
    setTypeId("");
    setNewSubType("");
  }, [departmentId, mode]);

  useEffect(() => {
    if (mode !== "create") return;
    setNewSubType("");
  }, [typeId, mode]);

  // ===== Cascada (solo edit) =====
  useEffect(() => {
    if (mode !== "edit") return;
    setEditTypeId("");
    setEditTypeName("");
  }, [editTypeDepartmentId, mode]);

  // ===== Cascada (solo edit) Paso 3 (Subtipo) =====
  useEffect(() => {
    if (mode !== "edit") return;
    setEditSubTypeTypeId("");
    setEditSubTypeId("");
    setEditSubTypeName("");
  }, [editSubTypeDepartmentId, mode]);

  useEffect(() => {
    if (mode !== "edit") return;
    setEditSubTypeId("");
    setEditSubTypeName("");
  }, [editSubTypeTypeId, mode]);

  // ===== Mutations =====
  const mCreateDept = useCreateDepartment();
  const mCreateType = useCreateIncomeType();
  const mCreateSub = useCreateIncomeSubType();

  const mUpdateDept = useUpdateDepartment();
  const mUpdateType = useUpdateIncomeType();
  const mUpdateSubType = useUpdateIncomeSubType(); // ✅ Paso 3

  // ===== Handlers CREATE =====
  async function handleCreateDepartment() {
    setErrors((e) => ({ ...e, dept: "", api: "" }));
    if (!newDepartment.trim()) {
      setErrors((e) => ({ ...e, dept: "Escribe el nombre del departamento" }));
      return;
    }
    try {
      const created = await mCreateDept.mutate({ name: newDepartment.trim() });
      setNewDepartment("");
      if ((created as any)?.id) setDepartmentId((created as any).id);
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
      if ((created as any)?.id) setTypeId((created as any).id);
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
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el subtipo" }));
    }
  }

  // ===== Handlers EDIT =====
  async function handleUpdateDepartment() {
    setErrors((e) => ({ ...e, editDept: "", api: "" }));

    if (!editDepartmentId) {
      setErrors((e) => ({ ...e, editDept: "Selecciona un departamento a editar" }));
      return;
    }
    if (!editDepartmentName.trim()) {
      setErrors((e) => ({ ...e, editDept: "Escribe el nuevo nombre" }));
      return;
    }

    try {
      await mUpdateDept.mutate({ id: Number(editDepartmentId), name: editDepartmentName.trim() });
      setEditDepartmentName("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el departamento" }));
    }
  }

  async function handleUpdateType() {
    setErrors((e) => ({ ...e, editType: "", api: "" }));

    if (!editTypeDepartmentId) {
      setErrors((e) => ({ ...e, editType: "Selecciona un departamento" }));
      return;
    }
    if (!editTypeId) {
      setErrors((e) => ({ ...e, editType: "Selecciona un tipo" }));
      return;
    }
    if (!editTypeName.trim()) {
      setErrors((e) => ({ ...e, editType: "Escribe el nuevo nombre del tipo" }));
      return;
    }

    try {
      await mUpdateType.mutate({
        id: Number(editTypeId),
        name: editTypeName.trim(),
        departmentId: Number(editTypeDepartmentId),
      });
      setEditTypeName("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el tipo" }));
    }
  }

  // ✅ Paso 3: handler editar subtipo
  async function handleUpdateSubType() {
    setErrors((e) => ({ ...e, editSubType: "", api: "" }));

    if (!editSubTypeDepartmentId) {
      setErrors((e) => ({ ...e, editSubType: "Selecciona un departamento" }));
      return;
    }
    if (!editSubTypeTypeId) {
      setErrors((e) => ({ ...e, editSubType: "Selecciona un tipo" }));
      return;
    }
    if (!editSubTypeId) {
      setErrors((e) => ({ ...e, editSubType: "Selecciona un subtipo" }));
      return;
    }
    if (!editSubTypeName.trim()) {
      setErrors((e) => ({ ...e, editSubType: "Escribe el nuevo nombre del subtipo" }));
      return;
    }

    try {
      await mUpdateSubType.mutate({
        id: Number(editSubTypeId),
        name: editSubTypeName.trim(),
        pIncomeTypeId: Number(editSubTypeTypeId),
      });
      setEditSubTypeName("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el subtipo" }));
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">Catálogo de Ingresos</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-4 md:p-6">
          {/* ===== Departamento ===== */}
          <section className="grid gap-2">
            <label className="text-sm font-medium text-gray-800">
              {mode === "edit" ? "Editar Departamento" : "Departamento"}
            </label>

            {mode === "create" && (
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex-1">
                  <CustomSelect
                    value={departmentId}
                    onChange={(value) => setDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Seleccione…"
                    zIndex={60}
                  />
                </div>

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
            )}

            {mode === "edit" && (
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex-1">
                  <CustomSelect
                    value={editDepartmentId}
                    onChange={(value) => setEditDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Seleccione…"
                    zIndex={60}
                  />
                </div>

                <div className="flex w-full gap-2 md:w-auto">
                  <input
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
                    placeholder="Nuevo nombre"
                    value={editDepartmentName}
                    onChange={(e) => setEditDepartmentName(e.target.value)}
                    disabled={!editDepartmentId}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateDepartment}
                    disabled={mUpdateDept.loading || !editDepartmentId || !editDepartmentName.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                    title="Guardar cambios"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {errors.departmentId && <p className="text-xs text-red-600">{errors.departmentId}</p>}
            {errors.dept && <p className="text-xs text-red-600">{errors.dept}</p>}
            {errors.editDept && <p className="text-xs text-red-600">{errors.editDept}</p>}
          </section>

          {/* ===== EDIT: Tipo ===== */}
          {mode === "edit" && (
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Editar Tipo de ingreso</label>

              <div className="grid gap-2 md:grid-cols-3">
                <CustomSelect
                  value={editTypeDepartmentId}
                  onChange={(value) => setEditTypeDepartmentId(value ? Number(value) : "")}
                  options={departmentOptions}
                  placeholder="Departamento…"
                  zIndex={60}
                />

                <CustomSelect
                  value={editTypeId}
                  onChange={(value) => setEditTypeId(value ? Number(value) : "")}
                  options={editTypeOptions}
                  placeholder={!editTypeDepartmentId ? "Seleccione depto…" : "Tipo…"}
                  disabled={!editTypeDepartmentId}
                  zIndex={60}
                />

                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                    placeholder="Nuevo nombre"
                    value={editTypeName}
                    onChange={(e) => setEditTypeName(e.target.value)}
                    disabled={!editTypeId}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateType}
                    disabled={mUpdateType.loading || !editTypeDepartmentId || !editTypeId || !editTypeName.trim()}
                    className="inline-flex items-center rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                    title="Guardar cambios"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {errors.editType && <p className="text-xs text-red-600">{errors.editType}</p>}
            </section>
          )}

          {/* ✅ ===== EDIT: Subtipo (Paso 3) ===== */}
          {mode === "edit" && (
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Editar Subtipo</label>

              <div className="grid gap-2 md:grid-cols-3">
                <CustomSelect
                  value={editSubTypeDepartmentId}
                  onChange={(value) => setEditSubTypeDepartmentId(value ? Number(value) : "")}
                  options={departmentOptions}
                  placeholder="Departamento…"
                  zIndex={60}
                />

                <CustomSelect
                  value={editSubTypeTypeId}
                  onChange={(value) => setEditSubTypeTypeId(value ? Number(value) : "")}
                  options={editSubTypesTypeOptions}
                  placeholder={!editSubTypeDepartmentId ? "Seleccione depto…" : "Tipo…"}
                  disabled={!editSubTypeDepartmentId}
                  zIndex={60}
                />

                <CustomSelect
                  value={editSubTypeId}
                  onChange={(value) => setEditSubTypeId(value ? Number(value) : "")}
                  options={editSubTypeOptions}
                  placeholder={!editSubTypeTypeId ? "Seleccione tipo…" : "Subtipo…"}
                  disabled={!editSubTypeTypeId}
                  zIndex={60}
                />
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                  placeholder="Nuevo nombre del subtipo"
                  value={editSubTypeName}
                  onChange={(e) => setEditSubTypeName(e.target.value)}
                  disabled={!editSubTypeId}
                />
                <button
                  type="button"
                  onClick={handleUpdateSubType}
                  disabled={
                    mUpdateSubType.loading ||
                    !editSubTypeDepartmentId ||
                    !editSubTypeTypeId ||
                    !editSubTypeId ||
                    !editSubTypeName.trim()
                  }
                  className="inline-flex items-center rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  title="Guardar cambios"
                >
                  Guardar
                </button>
              </div>

              {errors.editSubType && <p className="text-xs text-red-600">{errors.editSubType}</p>}
            </section>
          )}

          {/* ===== CREATE: Tipo + Subtipo (solo create) ===== */}
          {mode === "create" && (
            <>
              {/* Tipo */}
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Tipo de ingreso</label>
                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex-1">
                    <CustomSelect
                      value={typeId}
                      onChange={(value) => setTypeId(value ? Number(value) : "")}
                      options={typeOptions}
                      placeholder={!departmentId ? "Seleccione un departamento…" : "Seleccione…"}
                      disabled={!departmentId}
                      zIndex={60}
                    />
                  </div>

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
            </>
          )}

          {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t p-4 md:p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
