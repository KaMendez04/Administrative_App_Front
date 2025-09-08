import { useCategoryForm } from "../../../hooks/Budget/Categories/useCategoryForm";


type CategoryFormProps = {
  initialValue?: Partial<{ name: string; description: string }>;
  onSuccess?: (created: unknown) => void;
  onCancel?: () => void;
};

export default function CategoryForm({ initialValue, onSuccess, onCancel }: CategoryFormProps) {
  const {
    // estado y setters
    name,
    setName,
    description,
    setDescription,
    // contadores
    nameCount,
    descCount,
    // límites (expuestos por el hook)
    MAX_NAME,
    MAX_DESC,
    // acciones
    submit,
    cancel,
    // estado de red y errores
    loading,
    error,
  } = useCategoryForm({ initialValue, onSuccess, onCancel });

  return (
    <form onSubmit={submit} className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Título y subtítulo */}
      <h1 className="text-2xl font-semibold text-gray-900">Registrar Partida</h1>

      {/* Nombre de la partida */}
      <div className="mb-6 mt-6">
        <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-700">
          Nombre de la partida
        </label>
        <input
          id="nombre"
          type="text"
          maxLength={MAX_NAME}
          placeholder="Ej: Equipos de seguridad"
          className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {nameCount}/{MAX_NAME} caracteres
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-6">
        <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          maxLength={MAX_DESC}
          rows={5}
          placeholder="Describe el propósito de esta partida..."
          className="block w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {descCount}/{MAX_DESC} caracteres
        </div>
      </div>

      {/* Error opcional */}
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      {/* Botones */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={cancel}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">+</span>
          Registrar Partida
        </button>
      </div>
    </form>
  );
}
