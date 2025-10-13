import { showConfirmAlert, showSuccessAlert } from "../../utils/alerts";

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
  const handleSaveClick = async () => {
    if (canSave && !saving) {
      await showSuccessAlert("Confirmar guardado");
      onSave();
    }
  };

  const handleCancelClick = async () => {
    const confirmed = await showConfirmAlert(
      "Confirmar cancelación",
      "¿Está seguro que desea cancelar los cambios?"
    );
    if (confirmed) {
      onCancel();
    }
  };

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

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleSaveClick}
          disabled={!canSave || saving}
          className={`px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50${
            !canSave || saving ? "bg-gray-400" : "bg-[#708C3E] hover:bg-green-50"
          }`}
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button
          onClick={handleCancelClick}
          className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
