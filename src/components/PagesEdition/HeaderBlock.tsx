import { ActionButtons } from "../ActionButtons";

export function HeaderBlock({
  title,
  desc,
  limits,
  onTitle,
  onDesc,
  onCancel,
  onSave,
  canSave,
  saving,
}: {
  title: string;
  desc: string;
  limits: { title: number; desc: number };
  onTitle: (v: string) => void;
  onDesc: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
  canSave: boolean;
  saving: boolean;
}) {
  return (
    <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 shadow space-y-4">
      <h2 className="text-2xl font-semibold">Editar Encabezado</h2>

      <div>
        <input
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          maxLength={limits.title}
          placeholder="Título"
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Quedan {limits.title - (title?.length ?? 0)} de {limits.title} caracteres
        </p>
      </div>

      <div>
        <textarea
          rows={4}
          value={desc}
          onChange={(e) => onDesc(e.target.value)}
          maxLength={limits.desc}
          placeholder="Descripción"
          className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Quedan {limits.desc - (desc?.length ?? 0)} de {limits.desc} caracteres
        </p>
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