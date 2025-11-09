import { LucideIcon } from "../common/lucideIcon";
import { CustomSelect } from "../CustomSelect";
import { ActionButtons } from "../ActionButtons";

export function EditableBenefits({
  items, index, setIndex, limits,
  onChange, onCancel, onSave, canSave, saving,
}: {
  items: Array<{ iconName: string; title: string; desc: string; order: number }>;
  index: number; setIndex: (i: number) => void;
  limits: { benefitTitle: number; benefitDesc: number };
  onChange: (idx: number, patch: Partial<{ title: string; desc: string }>) => void;
  onCancel: () => void; onSave: () => void; canSave: boolean; saving: boolean;
}) {
  const b = items[index];
  if (!b) return (
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold">Editar Beneficio</h2>
      <p className="text-sm text-gray-500">No hay beneficios.</p>
    </div>
  );

  const tl = limits.benefitTitle - (b.title?.length ?? 0);
  const dl = limits.benefitDesc  - (b.desc?.length ?? 0);

  const benefitOptions = items.map((it, i) => ({
    value: i,
    label: it.title || `Beneficio #${i + 1}`
  }));

  return (
    <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 shadow space-y-5">
      <h2 className="text-2xl font-semibold">Editar Beneficio</h2>

      <CustomSelect
        value={index}
        onChange={(value) => setIndex(Number(value))}
        options={benefitOptions}
        placeholder="Selecciona un beneficio"
      />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
          <LucideIcon name={b.iconName} className="w-6 h-6 text-[#708C3E]" />
        </div>
        <span className="text-sm text-gray-600">Icono: <strong>{b.iconName}</strong> (no editable)</span>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Título</label>
        <input
          value={b.title}
          maxLength={limits.benefitTitle}
          onChange={(e) => onChange(index, { title: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Quedan {tl} de {limits.benefitTitle} caracteres</p>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Descripción</label>
        <textarea
          rows={3}
          value={b.desc}
          maxLength={limits.benefitDesc}
          onChange={(e) => onChange(index, { desc: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">Quedan {dl} de {limits.benefitDesc} caracteres</p>
      </div>

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