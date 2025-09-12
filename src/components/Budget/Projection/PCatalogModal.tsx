import { useEffect, useMemo, useState } from "react";
import {
  useDepartments,
} from "../../../hooks/Budget/useIncomeProjectionCatalog";
import {
  useCreateDepartment,
  useCreateIncomeProjectionSubType,
  useCreateIncomeProjectionType,
} from "../../../hooks/Budget/useIncomeProjectionMutations";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultDepartmentId?: number;
  defaultIncomeProjectionTypeId?: number;
  onAccept?: () => void;
};

export default function ProjectionCatalogModal({
  open,
  onClose,
  defaultDepartmentId,
  defaultIncomeProjectionTypeId,
  onAccept,
}: Props) {
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");

  const [newDepartment, setNewDepartment] = useState("");
  const [newType, setNewType] = useState("");
  const [newSubType, setNewSubType] = useState("");

  const [, setErrors] = useState<Record<string, string>>({});

  const dept = useDepartments();

  const deptMut = useCreateDepartment();
  const typeMut = useCreateIncomeProjectionType();
  const subTypeMut = useCreateIncomeProjectionSubType();

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setNewDepartment("");
    setNewType("");
    setNewSubType("");
    setDepartmentId(defaultDepartmentId ?? "");
    setTypeId(defaultIncomeProjectionTypeId ?? "");
  }, [open, defaultDepartmentId, defaultIncomeProjectionTypeId]);

  const deptOptions = useMemo(
    () => (dept.data ?? []).map((d) => ({ label: d.name, value: d.id })),
    [dept.data]
  );

  const isSaving = deptMut.loading || typeMut.loading || subTypeMut.loading;




  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6">
          <h2 className="text-xl font-bold text-gray-900">Agregar nuevo registro</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Departamento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agregar Departamento
            </label>
            <select
              value={departmentId === "" ? "" : departmentId}
              onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : "")}
              disabled={dept.loading || isSaving}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner mb-3 focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
            >
              <option value="">Selecciona un departamento</option>
              {deptOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              maxLength={75}
              placeholder="Nuevo departamento"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner"
            />
            <p className="mt-2 text-xs text-gray-500">Si no existe, escríbelo aquí (máx. 75 caracteres)</p>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agregar Tipo
            </label>
            <select
              value={departmentId === "" ? "" : departmentId}
              onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : "")}
              disabled={dept.loading || isSaving}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner mb-3 focus:outline-none focus:ring-2 focus:ring-[#A3853D]/40"
            >
              <option value="">Selecciona un departamento</option>
              {deptOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              maxLength={75}
              placeholder="Nuevo tipo"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              disabled={isSaving || !departmentId}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner disabled:bg-gray-50"
            />
            <p className="mt-2 text-xs text-gray-500">Selecciona un departamento para poder crear el tipo.</p>
          </div>

          {/* SubTipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agregar SubTipo
            </label>
            <input
              type="text"
              maxLength={75}
              placeholder="Nuevo subTipo"
              value={newSubType}
              onChange={(e) => setNewSubType(e.target.value)}
              disabled={isSaving || !typeId}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-inner disabled:bg-gray-50"
            />
            <p className="mt-2 text-xs text-gray-500">Selecciona un tipo para poder crear el subtipo.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onAccept}
            className="rounded-xl bg-[#708C3E] px-4 py-2 text-white shadow hover:bg-[#5e732f]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
