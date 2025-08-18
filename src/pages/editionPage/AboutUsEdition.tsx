import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useEffect, useState } from "react"
import { useAboutUsEdit } from "../../hooks/EditionSection/AboutUsHook"
import { AboutUsInitialState } from "../../models/editionSection/AboutUsEditionType"
import BackButton from "../../components/PagesEdition/BackButton"


export default function AboutUsEdition() {
  const {
    items,
    loading,
    saving,
    error,
    selected,
    selectedId,
    setSelectedId,
    isEditing,
    setIsEditing,
    saveDescription,
  } = useAboutUsEdit()

  const [form, setForm] = useState(AboutUsInitialState)

  // Cargar datos al seleccionar un elemento
  useEffect(() => {
    if (selected) {
      setForm({
        title: selected.title ?? "",
        description: selected.description ?? "",
      })
      setIsEditing(false)
    } else {
      setForm({
        title: AboutUsInitialState.title,
        description: AboutUsInitialState.description,
      })
      setIsEditing(false)
    }
  }, [selected, setIsEditing])

  // Manejar envío del formulario
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId) return
    saveDescription(form.description)
  }

  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Sobre Nosotros</h1>
          <p className="text-base text-[#475C1D]">
            Modifica el contenido principal de la sección “Sobre Nosotros”.
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar existente</h2>

          {loading ? (
            <p>Cargando…</p>
          ) : items.length === 0 ? (
            <p className="text-red-600">No hay registro para editar.</p>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar registro a editar
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                >
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.title}
                    </option>
                  ))}
                </select>
              </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Título no editable
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    disabled
                    className="w-full border border-gray-300 rounded-md px-4 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E] disabled:bg-gray-100"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                    className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                  >
                    Editar
                  </button>

                  <button
                    type="submit"
                    disabled={!isEditing || saving}
                    className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold disabled:opacity-60"
                  >
                    {saving ? "Guardando…" : "Guardar"}
                  </button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            </>
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
