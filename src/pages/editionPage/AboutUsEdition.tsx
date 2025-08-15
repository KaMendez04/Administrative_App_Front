import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useEffect, useState } from "react"
import { useAboutUsEdit } from "../../hooks/EditionSection/AboutUsHook"

export default function AboutUsEdition() {
  const { data, loading, saving, error, save } = useAboutUsEdit()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (data) {
      setTitle(data.title ?? "")
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
        {/* Nav superior */}
        <NavbarEditionSection />

        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Sobre Nosotros</h1>
          <p className="text-base text-[#475C1D]">
            Modifica el contenido principal de la sección “Sobre Nosotros”.
          </p>
        </div>

        {/* Contenido */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar existente</h2>

          {loading ? (
            <p>Cargando…</p>
          ) : !data ? (
            <p className="text-red-600">No hay registro para editar.</p>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                />
              </div>

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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold disabled:opacity-60"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
