import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { CustomSelect } from "../../CustomSelect";

import {
  useDepartments,
  useSpendTypes,
  useSpendSubTypes,
} from "../../../hooks/Budget/spend/useSpendCatalog";

import {
  useCreateDepartment,
  useCreateSpendType,
  useCreateSpendSubType,
  useUpdateDepartment,
  useUpdateSpendType,
  useUpdateSpendSubType,
} from "../../../hooks/Budget/spend/useSpendMutation";

import SpendList from "./SpendList";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  defaultDepartmentId?: number;
  defaultSpendTypeId?: number;
  inline?: boolean;
};

export default function CatalogModalSpend({
  open,
  onClose,
  mode = "create",
  defaultDepartmentId,
  defaultSpendTypeId,
  inline = false,
}: Props) {
  const [mounted, setMounted] = useState(false);

  // modal interno "Editar monto"
  const [openAmountModal, setOpenAmountModal] = useState(false);

  useEffect(() => setMounted(true), []);

  // Bloqueo scroll (solo modal real)
  useEffect(() => {
    if (!open || inline) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, inline]);

  // ESC (solo modal real)
  useEffect(() => {
    if (!open || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, inline]);

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

  // ===== Queries base =====
  const dept = useDepartments();
  const departmentOptions = useMemo(
    () => (dept.data ?? []).map((d: any) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  // ===== CREATE: tipos dependen de departmentId =====
  const types = useSpendTypes(
    mode === "create" && typeof departmentId === "number" ? departmentId : undefined
  );
  const typeOptions = useMemo(
    () => (types.data ?? []).map((t: any) => ({ label: t.name, value: t.id })),
    [types.data]
  );

  // ===== EDIT: tipos dependen de editTypeDepartmentId =====
  const editTypes = useSpendTypes(
    mode === "edit" && typeof editTypeDepartmentId === "number" ? editTypeDepartmentId : undefined
  );
  const editTypeOptions = useMemo(
    () => (editTypes.data ?? []).map((t: any) => ({ label: t.name, value: t.id })),
    [editTypes.data]
  );

  // ===== EDIT: Tipos para editar Subtipo dependen de editSubTypeDepartmentId =====
  const editSubTypesTypes = useSpendTypes(
    mode === "edit" && typeof editSubTypeDepartmentId === "number"
      ? editSubTypeDepartmentId
      : undefined
  );
  const editSubTypesTypeOptions = useMemo(
    () => (editSubTypesTypes.data ?? []).map((t: any) => ({ label: t.name, value: t.id })),
    [editSubTypesTypes.data]
  );

  // ===== EDIT: Subtipos dependen de editSubTypeTypeId =====
  const subTypesEdit = useSpendSubTypes(
    mode === "edit" && typeof editSubTypeTypeId === "number" ? editSubTypeTypeId : undefined
  );
  const editSubTypeOptions = useMemo(
    () => (subTypesEdit.data ?? []).map((s: any) => ({ label: s.name, value: s.id })),
    [subTypesEdit.data]
  );

  // ===== Reset al abrir (create/edit) =====
  useEffect(() => {
    if (!open) return;

    setErrors({});

    // reset create
    setNewDepartment("");
    setNewType("");
    setNewSubType("");
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

    // cerrar modal de monto
    setOpenAmountModal(false);

    // defaults SOLO aplican a create
    if (mode === "create" && defaultDepartmentId) {
      setDepartmentId(defaultDepartmentId);
      setTypeId(defaultSpendTypeId ?? "");
    }
  }, [open, mode, defaultDepartmentId, defaultSpendTypeId]);

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
  const mCreateType = useCreateSpendType();
  const mCreateSub = useCreateSpendSubType();

  const mUpdateDept = useUpdateDepartment();
  const mUpdateType = useUpdateSpendType();
  const mUpdateSubType = useUpdateSpendSubType();

  // ===== Handlers CREATE =====
  async function handleCreateDepartment() {
    setErrors((e) => ({ ...e, dept: "", api: "" }));
    if (!newDepartment.trim()) return setErrors((e) => ({ ...e, dept: "Escribe el nombre del departamento" }));
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
        spendTypeId: Number(typeId),
      });
      setNewSubType("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo crear el subtipo" }));
    }
  }

  // ===== Handlers EDIT =====
  async function handleUpdateDepartment() {
    setErrors((e) => ({ ...e, editDept: "", api: "" }));
    if (!editDepartmentId) return setErrors((e) => ({ ...e, editDept: "Selecciona un departamento a editar" }));
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
        spendTypeId: Number(editSubTypeTypeId),
      });
      setEditSubTypeName("");
    } catch (err: any) {
      setErrors((e) => ({ ...e, api: err?.message ?? "No se pudo actualizar el subtipo" }));
    }
  }

  if (!open) return null;
  if (!inline && !mounted) return null;

  const inner = (
    <>
      <div className="grid gap-6 p-4 md:p-6">
        {/* ===================== CREATE ===================== */}
        {mode === "create" && (
          <>
            {/* Departamento (create) */}
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Departamento</label>

              <div className="flex flex-col gap-2 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <CustomSelect
                    value={departmentId}
                    onChange={(value: any) => setDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Seleccione…"
                    zIndex={60 as any}
                  />
                </div>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                  <input
                    className="w-full min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E]"
                    placeholder="Nuevo departamento"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    disabled={mCreateDept.loading}
                  />
                  <button
                    type="button"
                    onClick={handleCreateDepartment}
                    disabled={mCreateDept.loading || !newDepartment.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 md:w-auto"
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

            {/* Tipo (create) */}
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Tipo de Egresos</label>

              <div className="flex flex-col gap-2 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <CustomSelect
                    value={typeId}
                    onChange={(value: any) => setTypeId(value ? Number(value) : "")}
                    options={typeOptions}
                    placeholder={!departmentId ? "Seleccione un departamento…" : "Seleccione…"}
                    disabled={!departmentId}
                    zIndex={60 as any}
                  />
                </div>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                  <input
                    className="w-full min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                    placeholder="Nuevo tipo"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    disabled={!departmentId}
                  />
                  <button
                    type="button"
                    onClick={handleCreateType}
                    disabled={mCreateType.loading || !newType.trim() || !departmentId}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 md:w-auto"
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

            {/* Subtipo (create) */}
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Subtipo</label>

              <div className="flex w-full flex-col gap-2 md:flex-row">
                <input
                  className="w-full min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                  placeholder="Nuevo subtipo"
                  value={newSubType}
                  onChange={(e) => setNewSubType(e.target.value)}
                  disabled={!typeId}
                />
                <button
                  type="button"
                  onClick={handleCreateSubType}
                  disabled={mCreateSub.loading || !newSubType.trim() || !typeId}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#708C3E] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 md:w-auto"
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

        {/* ===================== EDIT ===================== */}
        {mode === "edit" && (
          <>
            {/* Editar Departamento */}
            <section className="grid gap-2">
              <label className="text-sm font-medium text-gray-800">Editar Departamento</label>

              <div className="flex flex-col gap-2 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <CustomSelect
                    value={editDepartmentId}
                    onChange={(value: any) => setEditDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Seleccione…"
                    zIndex={60 as any}
                  />
                </div>

                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                  <input
                    className="w-full min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                    placeholder="Nuevo nombre"
                    value={editDepartmentName}
                    onChange={(e) => setEditDepartmentName(e.target.value)}
                    disabled={!editDepartmentId}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateDepartment}
                    disabled={mUpdateDept.loading || !editDepartmentId || !editDepartmentName.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 md:w-auto"
                    title="Guardar cambios"
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
                <div className="min-w-0">
                  <CustomSelect
                    value={editTypeDepartmentId}
                    onChange={(value: any) => setEditTypeDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Departamento…"
                    zIndex={60 as any}
                  />
                </div>

                <div className="min-w-0">
                  <CustomSelect
                    value={editTypeId}
                    onChange={(value: any) => setEditTypeId(value ? Number(value) : "")}
                    options={editTypeOptions}
                    placeholder={!editTypeDepartmentId ? "Seleccione depto…" : "Tipo…"}
                    disabled={!editTypeDepartmentId}
                    zIndex={60 as any}
                  />
                </div>

                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <input
                    className="w-full min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                    placeholder="Nuevo nombre"
                    value={editTypeName}
                    onChange={(e) => setEditTypeName(e.target.value)}
                    disabled={!editTypeId}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateType}
                    disabled={mUpdateType.loading || !editTypeDepartmentId || !editTypeId || !editTypeName.trim()}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 md:w-auto"
                    title="Guardar cambios"
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
                <div className="min-w-0">
                  <CustomSelect
                    value={editSubTypeDepartmentId}
                    onChange={(value: any) => setEditSubTypeDepartmentId(value ? Number(value) : "")}
                    options={departmentOptions}
                    placeholder="Departamento…"
                    zIndex={60 as any}
                  />
                </div>

                <div className="min-w-0">
                  <CustomSelect
                    value={editSubTypeTypeId}
                    onChange={(value: any) => setEditSubTypeTypeId(value ? Number(value) : "")}
                    options={editSubTypesTypeOptions}
                    placeholder={!editSubTypeDepartmentId ? "Seleccione depto…" : "Tipo…"}
                    disabled={!editSubTypeDepartmentId}
                    zIndex={60 as any}
                  />
                </div>

                <div className="min-w-0">
                  <CustomSelect
                    value={editSubTypeId}
                    onChange={(value: any) => setEditSubTypeId(value ? Number(value) : "")}
                    options={editSubTypeOptions}
                    placeholder={!editSubTypeTypeId ? "Seleccione tipo…" : "Subtipo…"}
                    disabled={!editSubTypeTypeId}
                    zIndex={60 as any}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 md:flex-row">
                <input
                  className="w-full min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
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
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#6B7A3A] px-3 py-2 text-white shadow hover:opacity-90 disabled:opacity-50 md:w-auto"
                  title="Guardar cambios"
                >
                  Guardar
                </button>
              </div>

              {errors.editSubType && <p className="text-xs text-red-600">{errors.editSubType}</p>}

              {/* botón debajo del ÚLTIMO INPUT (igual que ingresos) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setOpenAmountModal(true)}
                  disabled={typeof editSubTypeId !== "number"}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#6B7A3A]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#33361D] shadow-sm hover:bg-gray-50 disabled:opacity-50 md:w-auto"
                >
                  Editar monto y fecha
                </button>
              </div>
            </section>
          </>
        )}

        {errors.api && <p className="text-xs text-red-600">{errors.api}</p>}
      </div>

      {/* Modal "Editar monto y fecha" (filtrado por subtipo) */}
      {openAmountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100 max-h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between border-b p-4 md:p-5">
              <h2 className="text-lg font-semibold text-gray-900">Editar monto y fecha</h2>
              <button
                onClick={() => setOpenAmountModal(false)}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
              <SpendList subTypeId={typeof editSubTypeId === "number" ? editSubTypeId : undefined} />
            </div>

            <div className="flex items-center justify-end gap-3 border-t p-4 md:p-5">
              <button
                onClick={() => setOpenAmountModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // inline: se usa dentro del acordeón
  if (inline) return inner;

  // modal normal
  const modalUI = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      <div className="relative z-[1001] flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100 max-h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Editar catálogo de Egresos" : "Catálogo de Egresos"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{inner}</div>

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

  return createPortal(modalUI, document.body);
}
