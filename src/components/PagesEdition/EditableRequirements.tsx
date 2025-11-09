import { CustomSelect } from "../CustomSelect";
import { ActionButtons } from "../ActionButtons";

export function EditableRequirements({
  items, index, setIndex, limits,
  onChange,
  onCancel, onSave, canSave, saving,
}: {
  items: Array<{ text: string; order: number }>;
  index: number; setIndex: (i: number) => void;
  limits: { requirement: number };
  onChange: (idx: number, text: string) => void;
  onAdd: (text: string) => void;
  onCancel: () => void; onSave: () => void; canSave: boolean; saving: boolean;
}) {
  const current = index >= 0 ? items[index] : null;
  const leftEdit = current ? limits.requirement - (current.text?.length ?? 0) : limits.requirement;

  const requirementOptions = [
    { value: -1, label: "Selecciona un requisito" },
    ...items.map((r, i) => ({
      value: i,
      label: r.text.slice(0, 60)
    }))
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Requisitos</h2>
      </div>

      <CustomSelect
        value={index}
        onChange={(value) => setIndex(Number(value))}
        options={requirementOptions}
        placeholder="Selecciona un requisito"
      />

      {current && (
        <div className="border border-gray-300 rounded-xl p-4">
          <label className="block text-sm text-gray-700 mb-1">Requisito</label>
          <input
            value={current.text}
            maxLength={limits.requirement}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <p className="text-xs text-gray-500 mt-2">
            Quedan {leftEdit} de {limits.requirement} caracteres
          </p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <ActionButtons
          showSave
          showCancel
          showText
          onSave={onSave}
          onCancel={onCancel}
          disabled={!canSave}
          isSaving={saving}
          requireConfirmCancel
          cancelConfirmTitle="Confirmar cancelación"
          cancelConfirmText="¿Está seguro que desea cancelar los cambios?"
          saveText="Guardar"
          cancelText="Cancelar"
        />
      </div>
    </div>
  );
}