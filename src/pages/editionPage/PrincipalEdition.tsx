import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useEffect, useMemo, useState } from "react"
import { usePrincipalEdit } from "../../hooks/EditionSection/PrincipalHook"
import { CharCounter } from "../../components/CharCounter"
import { showSuccessAlert } from "../../utils/alerts"
import { ActionButtons } from "../../components/ActionButtons"
import { useNavigate } from "@tanstack/react-router"

const DEFAULT_TITLE = "Asociación Cámara Ganaderos Hojancha"

function PrincipalEdition() {
  const navigate = useNavigate()
  const { data, loading, saving, error, save, create } = usePrincipalEdit()

  const [description, setDescription] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (data) {
      setDescription(data.description ?? "")
    } else {
      setDescription("")
    }
  }, [data])

  useEffect(() => {
    if (data) {
      setHasChanges(description !== (data.description ?? ""))
    } else {
      setHasChanges(description.trim() !== "")
    }
  }, [description, data])

  const isEditing = useMemo(() => Boolean(data), [data])

  const handleCancel = () => {
    if (data) {
      setDescription(data.description ?? "")
    } else {
      setDescription("")
    }
  }

  const handleSave = async () => {
    try {
      if (isEditing) {
        await save({ title: data!.title, description })
      } else {
        await create({ title: DEFAULT_TITLE, description })
      }

      if (!error) {
        showSuccessAlert("Actualización completada")
      }
    } catch (err) {
      console.error("Error al guardar:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Principal</h1>
          <p className="text-base text-[#475C1D]">
            {isEditing
              ? "Modifica la información principal que aparece en la página de inicio."
              : "Aún no existe un registro de la sección principal. Crea uno nuevo con título por defecto."}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
          {loading ? (
            <p>Cargando…</p>
          ) : (
            <div className="space-y-6">
              {/* Título Principal (deshabilitado) */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título Principal <span className="text-xs text-gray-500">(No editable)</span>
                </label>
                <textarea
                  id="title"
                  rows={2}
                  value={DEFAULT_TITLE}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Este título es fijo y no se puede modificar.
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  maxLength={250}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Escribe aquí la descripción que se mostrará en la página de inicio…"
                  disabled={saving}
                />
                <CharCounter value={description} max={250} />
              </div>

              {/* Botones usando ActionButtons */}
              <div className="flex justify-end">
                <ActionButtons
                  onSave={handleSave}
                  onCancel={handleCancel}
                  showSave={true}
                  showCancel={true}
                  showText={true}
                  isSaving={saving}
                  requireConfirmCancel={hasChanges}
                  cancelConfirmText="Los cambios no guardados se perderán."
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}
        </div>

        {/* Botón de regresar abajo */}
        <div className="flex justify-end mt-8">
          <ActionButtons
            onBack={() => navigate({ to: "/Principal" })}
            showBack={true}
            backText="Regresar"
            showText={true}
          />
        </div>
      </div>
    </div>
  )
}

export default PrincipalEdition