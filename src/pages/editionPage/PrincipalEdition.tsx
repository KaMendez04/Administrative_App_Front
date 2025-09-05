import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useEffect, useMemo, useState } from "react"
import { usePrincipalEdit } from "../../hooks/EditionSection/PrincipalHook"
import BackButton from "../../components/PagesEdition/BackButton"

// Título por defecto para la creación (no editable)
const DEFAULT_TITLE = "Asociación Cámara Ganaderos Hojancha"

function PrincipalEdition() {
  const { data, loading, saving, error, save, create } = usePrincipalEdit()

  // Solo se edita la descripción; el título se mantiene (o se fija al crear)
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (data) {
      setDescription(data.description ?? "")
    } else {
      setDescription("")
    }
  }, [data])

  const isEditing = useMemo(() => Boolean(data), [data])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      // Para cumplir con tu tipo actual (PrincipalUpdate), mandamos el title existente + la nueva descripción
      save({ title: data!.title, description })
    } else {
      // Crear el único registro con título por defecto + descripción
      create({ title: DEFAULT_TITLE, description })
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navegación superior */}
        <NavbarEditionSection />

        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Principal</h1>
          <p className="text-base text-[#475C1D]">
            {isEditing
              ? "Modifica la información principal que aparece en la página de inicio."
              : "Aún no existe un registro de la sección principal. Crea uno nuevo con título por defecto."}
          </p>
        </div>

        {/* Contenido */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {isEditing ? "Editar existente" : "Crear registro"}
            </h2>

            {!isEditing && (
              <div className="mt-3 p-3 bg-[#F5F7EC] border-l-4 border-[#708C3E] rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-[#2E321B]">Título (fijo):</span>{" "}
                  <span className="italic text-[#475C1D]">{DEFAULT_TITLE}</span>
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <p>Cargando…</p>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Escribe aquí la descripción que se mostrará en la página de inicio…"
                />
                {!isEditing && (
                  <p className="mt-2 text-xs text-[#6B7280]">
                    Se creará un único registro con el título por defecto. Luego podrás editar solo la descripción.
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={saving || (!isEditing && description.trim().length === 0)}
                  className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold disabled:opacity-60"
                >
                  {saving ? (isEditing ? "Guardando…" : "Creando…") : (isEditing ? "Guardar" : "Crear")}
                </button>
              </div>

              {/* Errores */}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          )}
        </div>

        {/* Botón de regresar abajo a la derecha */}
        <div className="flex justify-end mt-8">
          <BackButton label="Regresar" />
        </div>
      </div>
    </div>
  )
}

export default PrincipalEdition
