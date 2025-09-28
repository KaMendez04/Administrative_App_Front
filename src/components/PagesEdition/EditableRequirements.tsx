import { MinusCircle } from "lucide-react";

export function EditableRequirements({
  items, index, setIndex, limits,
  onChange, onAdd, onRemove,
  onCancel, onSave, canSave, saving,
}: {
  items: Array<{ text: string; order: number }>;
  index: number; setIndex: (i: number) => void;
  limits: { requirement: number };
  onChange: (idx: number, text: string) => void;
  onAdd: (text: string) => void;
  onRemove: (idx: number) => void;
  onCancel: () => void; onSave: () => void; canSave: boolean; saving: boolean;
}) {
  const current = index >= 0 ? items[index] : null;

  // usa el valor actual para el contador (evita que quede “pegado”)
  const leftEdit = current ? limits.requirement - (current.text?.length ?? 0) : limits.requirement;

  return (
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Requisitos</h2>
      </div>

      <select
        className="w-full border border-gray-300 rounded-md px-4 py-2"
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
      >
        <option value={-1}>Selecciona un requisito</option>
        {items.map((r, i) => (
          <option key={i} value={i}>{r.text.slice(0, 60)}</option>
        ))}
      </select>

      {current && (
        <div className="border border-gray-300 rounded-xl p-4">
          <label className="block text-sm text-gray-700 mb-1">Requisito</label>
          <input
            value={current.text}
            maxLength={limits.requirement}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">Quedan {leftEdit} de {limits.requirement} caracteres</p>
            <button
              type="button"                
              onClick={() => onRemove(index)}
              className="text-red-600 flex items-center gap-2"
            >
              <MinusCircle className="w-4 h-4" /> Eliminar
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"                 
          onClick={onSave}
          disabled={!canSave || saving}
          className={`px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50${
            !canSave || saving ? "bg-gray-400" : "bg-[#708C3E] hover:bg-green-50"
          }`}
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 font-semibold">
          Cancelar
        </button>
      </div>
    </div>
  );
}
