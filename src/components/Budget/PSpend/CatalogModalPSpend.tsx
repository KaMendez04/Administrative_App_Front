import { useEffect, useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { CustomSelect } from "../../CustomSelect";

import {
  useDepartments,
  usePSpendTypes,
  usePSpendSubTypes,
} from "../../../hooks/Budget/pSpend/usePSpendCatalog";

import {
  useCreateDepartment,
  useCreatePSpendType,
  useCreatePSpendSubType,
  useUpdateDepartment,       
  useUpdatePSpendType,
  useUpdatePSpendSubType,
} from "../../../hooks/Budget/pSpend/usePSpendMutation";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  defaultDepartmentId?: number;
  defaultPSpendTypeId?: number;
};

export default function CatalogModalPSpend({
  open,
  onClose,
  mode = "create",
  defaultDepartmentId,
  defaultPSpendTypeId,
}: Props) {
  // ===== EDIT: Departamento =====
  const [editDepartmentId, setEditDepartmentId] = useState<number | "">("");
  const [editDepartmentName, setEditDepartmentName] = useState("");

  // ===== EDIT: Tipo =====
  const [editTypeDepartmentId, setEditTypeDepartmentId] = useState<number | "">("");
  const [editTypeId, setEditTypeId] = useState<number | "">("");
  const [editTypeName, setEditTypeName] = useState("");

  // ===== EDIT: Subtipo =====
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

  // ===== Queries =====
  const dept = useDepartments();
  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  // create -> types por departmentId
  const types = usePSpendTypes(
    mode === "create" && typeof departmentId === "number" ? departmentId : undefined
  );
  const typeOptions = useMemo(
    () => (types.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [types.data]
  );

  // edit -> types por editTypeDepartmentId
  const editTypes = usePSpendTypes(
    mode === "edit" && typeof editTypeDepartmentId === "number" ? editTypeDepartmentId : undefined
  );
  const editTypeOptions = useMemo(
    () => (editTypes.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [editTypes.data]
  );

  // edit subtipo -> types por editSubTypeDepartmentId
  const editSubTypesTypes = usePSpendTypes(
    mode === "edit" && typeof editSubTypeDepartmentId === "number" ? editSubTypeDepartmentId : undefined
  );
  const editSubTypesTypeOptions = useMemo(
    () => (editSubTypesTypes.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [editSubTypesTypes.data]
  );

  // edit subtipo -> subtypes por editSubTypeTypeId
  const subTypesEdit = usePSpendSubTypes(
    mode === "edit" && typeof editSubTypeTypeId === "number" ? editSubTypeTypeId : undefined
  );
  const editSubTypeOptions = useMemo(
    () => (subTypesEdit.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypesEdit.data]
  );

  // ===== Reset al abrir =====
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
    setEditSubTypeDepartmentId("");
    setEditSubTypeTypeId("");
    setEditSubTypeId("");
    setEditSubTypeName("");

    if (mode === "create" && defaultDepartmentId) {
      setDepartmentId(defaultDepartmentId);
      setTypeId(defaultPSpendTypeId ?? "");
    }
  }, [open, mode, defaultDepartmentId, defaultPSpendTypeId]);

  // ===== Cascada (create) =====
  useEffect(() => {
    if (mode !== "create") return;
    setTypeId("");
    setNewSubType("");
  }, [departmentId, mode]);

  useEffect(() => {
    if (mode !== "create") return;
    setNewSubType("");
  }, [typeId, mode]);

  // ===== Cascada (edit) =====
  useEffect(() => {
    if (mode !== "edit") return;
    setEditTypeId("");
    setEditTypeName("");
  }, [editTypeDepartmentId, mode]);

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
  const mCreateType = useCreatePSpendType();
  const mCreateSub = useCreatePSpendSubType();

  const mUpdateDept = useUpdateDepartment(); // ✅ ACTIVO
  const mUpdateType = useUpdatePSpendType();
  const mUpdateSubType = useUpdatePSpendSubType();

  // ===== CREATE handlers =====
  async function handleCreateDepartment() {
    setErrors((e) => ({ ...e, dept: "", api: "" }));
    if (!newDepartment.trim()) {
      setErrors((e) => ({ ...e, dept: "Escribe el nombre del departamento" }));
      return;
    }
    if (mCreateDept.loading) return;

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
    if (!newType.trim()) return setErrors((e) => ({ ...e, type: "Escribe el nombre del tipo" }));
    if (!departmentId) return setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));
    if (mCreateType.loading) return;

    try {
      const created = await mCreateType.mutate({
        name: newType.trim(),
        departmentId: Number(departmentId),
      });
      setNewType("");
      if ((created as any)?.id) setTypeId((created as any).id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el tipo (proyección)" }));
    }
  }

  async function handleCreateSubType() {
    setErrors((e) => ({ ...e, subType: "", api: "" }));
    if (!newSubType.trim()) return setErrors((e) => ({ ...e, subType: "Escribe el nombre del subtipo" }));
    if (!typeId) return setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));
    if (mCreateSub.loading) return;

    try {
      await mCreateSub.mutate({
        name: newSubType.trim(),
        pSpendTypeId: Number(typeId),
      });
      setNewSubType("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el subtipo (proyección)" }));
    }
  }

  // ===== EDIT handlers =====
  async function handleUpdateDepartment() {
    setErrors((e) => ({ ...e, editDept: "", api: "" }));

    if (!editDepartmentId) return setErrors((e) => ({ ...e, editDept: "Selecciona un departamento" }));
    if (!editDepartmentName.trim()) return setErrors((e) => ({ ...e, editDept: "Escribe el nuevo nombre" }));
    if (mUpdateDept.loading) return;

    try {
      await mUpdateDept.mutate({ id: Number(editDepartmentId), name: editDepartmentName.trim() });
      setEditDepartmentName("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el departamento" }));
    }
  }

  async function handleUpdateType() {
    setErrors((e) => ({ ...e, editType: "", api: "" }));

    if (!editTypeDepartmentId) return setErrors((e) => ({ ...e, editType: "Selecciona un departamento" }));
    if (!editTypeId) return setErrors((e) => ({ ...e, editType: "Selecciona un tipo" }));
    if (!editTypeName.trim()) return setErrors((e) => ({ ...e, editType: "Escribe el nuevo nombre del tipo" }));

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

  async function handleUpdateSubType() {
    setErrors((e) => ({ ...e, editSubType: "", api: "" }));

    if (!editSubTypeDepartmentId) return setErrors((e) => ({ ...e, editSubType: "Selecciona un departamento" }));
    if (!editSubTypeTypeId) return setErrors((e) => ({ ...e, editSubType: "Selecciona un tipo" }));
    if (!editSubTypeId) return setErrors((e) => ({ ...e, editSubType: "Selecciona un subtipo" }));
    if (!editSubTypeName.trim()) return setErrors((e) => ({ ...e, editSubType: "Escribe el nuevo nombre del subtipo" }));

    try {
      await mUpdateSubType.mutate({
        id: Number(editSubTypeId),
        name: editSubTypeName.trim(),
        pSpendTypeId: Number(editSubTypeTypeId),
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
          <h2 className="text-lg font-semibold text-gray-900">Catálogo de Proyección de Egresos</h2>
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
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="Nuevo departamento"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    disabled={mCreateDept.loading}
                  />
                  <button
                    type="button"
                    onClick={handleCreateDepartment}
                    disabled={mCreateDept.loading || !newDepartment.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    {mCreateDept.loading ? "Creando..." : "Agregar"}
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
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="Nuevo nombre"
                    value={editDepartmentName}
                    onChange={(e) => setEditDepartmentName(e.target.value)}
                    disabled={!editDepartmentId || mUpdateDept.loading}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateDepartment}
                    disabled={mUpdateDept.loading || !editDepartmentId || !editDepartmentName.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {mUpdateDept.loading ? "Guardando..." : "Guardar"}
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
              <label className="text-sm font-medium text-gray-800">Editar Tipo (Proyección)</label>

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
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 disabled:bg-gray-100"
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
                  >
                    {mUpdateType.loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>

              {errors.editType && <p className="text-xs text-red-600">{errors.editType}</p>}
            </section>
          )}

          {/* ===== EDIT: Subtipo ===== */}
          {mode === "edit" && (
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Editar Subtipo (Proyección)</label>

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
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 disabled:bg-gray-100"
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
                >
                  {mUpdateSubType.loading ? "Guardando..." : "Guardar"}
                </button>
              </div>

              {errors.editSubType && <p className="text-xs text-red-600">{errors.editSubType}</p>}
            </section>
          )}

          {/* ===== CREATE: Tipo + Subtipo ===== */}
          {mode === "create" && (
            <>
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Tipo (Proyección)</label>
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
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 disabled:bg-gray-100"
                      placeholder="Nuevo tipo"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      disabled={!departmentId || mCreateType.loading}
                    />
                    <button
                      type="button"
                      onClick={handleCreateType}
                      disabled={mCreateType.loading || !newType.trim() || !departmentId}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      {mCreateType.loading ? "Creando..." : "Agregar"}
                    </button>
                  </div>
                </div>
                {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
                {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
              </section>

              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Subtipo (Proyección)</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 disabled:bg-gray-100"
                    placeholder="Nuevo subtipo"
                    value={newSubType}
                    onChange={(e) => setNewSubType(e.target.value)}
                    disabled={!typeId || mCreateSub.loading}
                  />
                  <button
                    type="button"
                    onClick={handleCreateSubType}
                    disabled={mCreateSub.loading || !newSubType.trim() || !typeId}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    {mCreateSub.loading ? "Creando..." : "Agregar"}
                  </button>
                </div>
                {errors.subType && <p className="text-xs text-red-600">{errors.subType}</p>}
              </section>
            </>
          )}

          {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
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
