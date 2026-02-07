// CatalogModal.tsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import {
  useDepartments,
  useIncomeTypes,
  useIncomeSubTypes,
} from "../../../hooks/Budget/income/useIncomeCatalog";
import {
  useCreateDepartment,
  useCreateIncomeType,
  useCreateIncomeSubType,
  useUpdateDepartment,
  useUpdateIncomeType,
  useUpdateIncomeSubType,
} from "../../../hooks/Budget/income/useIncomeMutation";
import { CustomSelect } from "../../CustomSelect";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Bloqueo scroll
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

  // ===== CREATE state =====
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");

  const [newDepartment, setNewDepartment] = useState("");
  const [newType, setNewType] = useState("");
  const [newSubType, setNewSubType] = useState("");

  // ===== EDIT state =====
  const [editDepartmentId, setEditDepartmentId] = useState<number | "">("");
  const [editDepartmentName, setEditDepartmentName] = useState("");

  const [editTypeDepartmentId, setEditTypeDepartmentId] = useState<number | "">("");
  const [editTypeId, setEditTypeId] = useState<number | "">("");
  const [editTypeName, setEditTypeName] = useState("");

  const [editSubTypeDepartmentId, setEditSubTypeDepartmentId] = useState<number | "">("");
  const [editSubTypeTypeId, setEditSubTypeTypeId] = useState<number | "">("");
  const [editSubTypeId, setEditSubTypeId] = useState<number | "">("");
  const [editSubTypeName, setEditSubTypeName] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== Queries base =====
  const dept = useDepartments();
  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  // ===== CREATE Queries =====
  const typesCreate = useIncomeTypes(typeof departmentId === "number" ? departmentId : undefined);
  const typeOptionsCreate = useMemo(
    () => (typesCreate.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [typesCreate.data]
  );

  // ===== EDIT Queries =====
  const typesEdit = useIncomeTypes(
    mode === "edit" && typeof editTypeDepartmentId === "number" ? editTypeDepartmentId : undefined
  );
  const typeOptionsEdit = useMemo(
    () => (typesEdit.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [typesEdit.data]
  );

  const typesEditForSub = useIncomeTypes(
    mode === "edit" && typeof editSubTypeDepartmentId === "number" ? editSubTypeDepartmentId : undefined
  );
  const typeOptionsEditForSub = useMemo(
    () => (typesEditForSub.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [typesEditForSub.data]
  );

  const subTypesEdit = useIncomeSubTypes(
    mode === "edit" && typeof editSubTypeTypeId === "number" ? editSubTypeTypeId : undefined
  );
  const subTypeOptionsEdit = useMemo(
    () => (subTypesEdit.data ?? []).map((s) => ({ label: s.name, value: s.id })),
    [subTypesEdit.data]
  );

  // ===== Reset al abrir (create/edit) =====
  useEffect(() => {
    if (!open) return;

    setErrors({});

    // create
    setNewDepartment("");
    setNewType("");
    setNewSubType("");
    setDepartmentId("");
    setTypeId("");

    // edit
    setEditDepartmentId("");
    setEditDepartmentName("");
    setEditTypeDepartmentId("");
    setEditTypeId("");
    setEditTypeName("");
    setEditSubTypeDepartmentId("");
    setEditSubTypeTypeId("");
    setEditSubTypeId("");
    setEditSubTypeName("");

    // defaults SOLO aplican a create (como lo manejás en spend)
    if (mode === "create" && defaultDepartmentId) {
      setDepartmentId(defaultDepartmentId);
      setTypeId(defaultIncomeTypeId ?? "");
    }
  }, [open, mode, defaultDepartmentId, defaultIncomeTypeId]);

  // ===== Cascada CREATE =====
  useEffect(() => {
    if (mode !== "create") return;
    setTypeId("");
    setNewSubType("");
  }, [departmentId, mode]);

  useEffect(() => {
    if (mode !== "create") return;
    setNewSubType("");
  }, [typeId, mode]);

  // ===== Cascada EDIT =====
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
  const mCreateType = useCreateIncomeType();
  const mCreateSub = useCreateIncomeSubType();

  const mUpdateDept = useUpdateDepartment();
  const mUpdateType = useUpdateIncomeType();
  const mUpdateSubType = useUpdateIncomeSubType();

  // ===== CREATE handlers =====
  async function handleCreateDepartment() {
    setErrors((e) => ({ ...e, dept: "", api: "" }));
    if (!newDepartment.trim()) {
      setErrors((e) => ({ ...e, dept: "Escribe el nombre del departamento" }));
      return;
    }

    try {
      const created = await mCreateDept.mutate({ name: newDepartment.trim() });
      setNewDepartment("");
      const id = (created as any)?.id;
      if (id) setDepartmentId(id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el departamento" }));
    }
  }

  async function handleCreateType() {
    setErrors((e) => ({ ...e, type: "", api: "" }));
    if (!newType.trim()) return setErrors((e) => ({ ...e, type: "Escribe el nombre del tipo" }));
    if (!departmentId) return setErrors((e) => ({ ...e, departmentId: "Selecciona un departamento" }));

    try {
      const created = await mCreateType.mutate({
        name: newType.trim(),
        departmentId: Number(departmentId),
      });
      setNewType("");
      const id = (created as any)?.id;
      if (id) setTypeId(id);
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el tipo" }));
    }
  }

  async function handleCreateSubType() {
    setErrors((e) => ({ ...e, subType: "", api: "" }));
    if (!newSubType.trim()) return setErrors((e) => ({ ...e, subType: "Escribe el nombre del subtipo" }));
    if (!typeId) return setErrors((e) => ({ ...e, typeId: "Selecciona un tipo" }));

    try {
      await mCreateSub.mutate({
        name: newSubType.trim(),
        incomeTypeId: Number(typeId),
      });
      setNewSubType("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el subtipo" }));
    }
  }

  // ===== EDIT handlers =====
  async function handleUpdateDepartment() {
    setErrors((e) => ({ ...e, editDept: "", api: "" }));

    if (!editDepartmentId) return setErrors((e) => ({ ...e, editDept: "Selecciona un departamento" }));
    if (!editDepartmentName.trim()) return setErrors((e) => ({ ...e, editDept: "Escribe el nuevo nombre" }));

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
    if (!editTypeName.trim()) return setErrors((e) => ({ ...e, editType: "Escribe el nuevo nombre" }));

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
    if (!editSubTypeName.trim()) return setErrors((e) => ({ ...e, editSubType: "Escribe el nuevo nombre" }));

    try {
      await mUpdateSubType.mutate({
        id: Number(editSubTypeId),
        name: editSubTypeName.trim(),
        incomeTypeId: Number(editSubTypeTypeId),
      });
      setEditSubTypeName("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el subtipo" }));
    }
  }

  if (!open || !mounted) return null;

  const modalUI = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-[1001] w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Editar catálogo de Ingresos" : "Catálogo de Ingresos"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-4 md:p-6">
          {/* ===================== CREATE ===================== */}
          {mode === "create" && (
            <>
              {/* Departamento (create) */}
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Departamento</label>

                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex-1">
                    <CustomSelect
                      value={departmentId}
                      onChange={(value) => setDepartmentId(value ? Number(value) : "")}
                      options={departmentOptions}
                      placeholder="Seleccione…"
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
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </button>
                  </div>
                </div>

                {errors.departmentId && <p className="text-xs text-red-600">{errors.departmentId}</p>}
                {errors.dept && <p className="text-xs text-red-600">{errors.dept}</p>}
              </section>

              {/* Tipo (create) */}
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Tipo de Ingresos</label>

                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex-1">
                    <CustomSelect
                      value={typeId}
                      onChange={(value) => setTypeId(value ? Number(value) : "")}
                      options={typeOptionsCreate}
                      placeholder={!departmentId ? "Seleccione un departamento…" : "Seleccione…"}
                      disabled={!departmentId}
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
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </button>
                  </div>
                </div>

                {errors.typeId && <p className="text-xs text-red-600">{errors.typeId}</p>}
                {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
              </section>

              {/* Subtipo (create) */}
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
                  >
                    <Plus className="h-4 w-4" /> Agregar
                  </button>
                </div>

                {errors.subType && <p className="text-xs text-red-600">{errors.subType}</p>}
              </section>
            </>
          )}

          {/* ===================== EDIT ===================== */}
          {mode === "edit" && (
            <>
              {/* Editar Departamento */}
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Editar Departamento</label>

                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex-1">
                    <CustomSelect
                      value={editDepartmentId}
                      onChange={(value) => setEditDepartmentId(value ? Number(value) : "")}
                      options={departmentOptions}
                      placeholder="Seleccione…"
                    />
                  </div>

                  <div className="flex w-full gap-2 md:w-auto">
                    <input
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
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
                    >
                      Guardar
                    </button>
                  </div>
                </div>

                {errors.editDept && <p className="text-xs text-red-600">{errors.editDept}</p>}
              </section>

              {/* Editar Tipo */}
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Editar Tipo</label>

                <div className="grid gap-2 md:grid-cols-3">
                  <CustomSelect
                    value={editTypeDepartmentId}
                    onChange={(value) => setEditTypeDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Departamento…"
                  />

                  <CustomSelect
                    value={editTypeId}
                    onChange={(value) => setEditTypeId(value ? Number(value) : "")}
                    options={typeOptionsEdit}
                    placeholder={!editTypeDepartmentId ? "Seleccione depto…" : "Tipo…"}
                    disabled={!editTypeDepartmentId}
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
                      Guardar
                    </button>
                  </div>
                </div>

                {errors.editType && <p className="text-xs text-red-600">{errors.editType}</p>}
              </section>

              {/* Editar Subtipo */}
              <section className="grid gap-2">
                <label className="text-sm font-medium text-gray-800">Editar Subtipo</label>

                <div className="grid gap-2 md:grid-cols-3">
                  <CustomSelect
                    value={editSubTypeDepartmentId}
                    onChange={(value) => setEditSubTypeDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Departamento…"
                  />

                  <CustomSelect
                    value={editSubTypeTypeId}
                    onChange={(value) => setEditSubTypeTypeId(value ? Number(value) : "")}
                    options={typeOptionsEditForSub}
                    placeholder={!editSubTypeDepartmentId ? "Seleccione depto…" : "Tipo…"}
                    disabled={!editSubTypeDepartmentId}
                  />

                  <CustomSelect
                    value={editSubTypeId}
                    onChange={(value) => setEditSubTypeId(value ? Number(value) : "")}
                    options={subTypeOptionsEdit}
                    placeholder={!editSubTypeTypeId ? "Seleccione tipo…" : "Subtipo…"}
                    disabled={!editSubTypeTypeId}
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
                    Guardar
                  </button>
                </div>

                {errors.editSubType && <p className="text-xs text-red-600">{errors.editSubType}</p>}
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

  return createPortal(modalUI, document.body);
}
