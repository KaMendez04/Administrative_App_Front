import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useEffect, useState } from "react"
import { usePrincipalEdit } from "../../hooks/EditionSection/PrincipalHook"
import BackButton from "../../components/PagesEdition/BackButton"


function PrincipalEdition() {
  const { data, loading, saving, error, save } = usePrincipalEdit()

  // estados controlados del formulario
  const [title] = useState("")
  const [description, setDescription] = useState("")

  // Cargar valores cuando llegue "data"
  useEffect(() => {
    if (data) {
      setDescription(data.description ?? "")
    }
  }, [data])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save({ title, description })
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
            Aquí podrás modificar la información principal que aparece en la página de inicio.
          </p>
        </div>

        {/* Contenido */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar existente</h2>

          {loading ? (
            <p>Cargando…</p>
          ) : !data ? (
            <p className="text-red-600">No hay registro de principal para editar.</p>
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
                />
              </div>

              {/* Botones (solo Guardar) */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold disabled:opacity-60"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>

              {/* Errores */}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          )}
        </div>
        {/*Botón de regresar abajo a la derecha */}
                <div className="flex justify-end mt-8">
                  <BackButton label="Regresar" />
                </div>
      </div>
    </div>
  )
}

export default PrincipalEdition
