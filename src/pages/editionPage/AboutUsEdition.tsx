import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useAboutUsEdit } from "../../hooks/EditionSection/AboutUsHook"
import { showSuccessAlert } from "../../utils/alerts"
import { ActionButtons } from "../../components/ActionButtons"
import { useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export default function AboutUsEdition() {
  const navigate = useNavigate()
  const {
    loading, saving, error,
    isEditing,
    whoWeAre, setWhoWeAre,
    mission, setMission,
    vision, setVision,
    saveAll,
  } = useAboutUsEdit()

  const [initialWhoWeAre, setInitialWhoWeAre] = useState("")
  const [initialMission, setInitialMission] = useState("")
  const [initialVision, setInitialVision] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // Guardar valores iniciales
  useEffect(() => {
    setInitialWhoWeAre(whoWeAre)
    setInitialMission(mission)
    setInitialVision(vision)
  }, [loading])

  // Detectar cambios
  useEffect(() => {
    const changed = 
      whoWeAre !== initialWhoWeAre ||
      mission !== initialMission ||
      vision !== initialVision
    setHasChanges(changed)
  }, [whoWeAre, mission, vision, initialWhoWeAre, initialMission, initialVision])

  const handleSave = async () => {
    try {
      await saveAll()
      
      if (!error) {
        showSuccessAlert("Actualización completada")
      }
    } catch (err) {
      console.error("Error al guardar:", err)
    }
  }

  const handleCancel = () => {
    setWhoWeAre(initialWhoWeAre)
    setMission(initialMission)
    setVision(initialVision)
  }

  const canSave = whoWeAre.trim() && mission.trim() && vision.trim()

  // Máximo y contadores
  const MAX = 250
  const leftWho = Math.max(0, MAX - (whoWeAre?.length ?? 0))
  const leftMission = Math.max(0, MAX - (mission?.length ?? 0))
  const leftVision = Math.max(0, MAX - (vision?.length ?? 0))

  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Sobre Nosotros</h1>
          <p className="text-base text-[#475C1D]">
            {isEditing ? "Modifica 'Quiénes somos', 'Misión' y 'Visión'." : "Crea las secciones de Sobre Nosotros."}
          </p>
        </div>

        <div className="bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-4 shadow">
          <h2 className="text-2xl font-semibold mb-6">{isEditing ? "Editar existente" : "Crear secciones"}</h2>

          {loading ? (
            <p>Cargando…</p>
          ) : (
            <div className="space-y-6">
              {/* Quiénes somos */}
              <div>
                <label htmlFor="whoWeAre" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiénes somos
                </label>
                <textarea
                  id="whoWeAre"
                  rows={4}
                  value={whoWeAre}
                  onChange={(e) => setWhoWeAre(e.target.value)}
                  maxLength={MAX}
                  disabled={saving}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Describe quiénes son…"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Quedan {leftWho} de {MAX} caracteres
                </p>
              </div>

              {/* Misión */}
              <div>
                <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1">
                  Misión
                </label>
                <textarea
                  id="mission"
                  rows={4}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  maxLength={MAX}
                  disabled={saving}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Escribe la misión…"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Quedan {leftMission} de {MAX} caracteres
                </p>
              </div>

              {/* Visión */}
              <div>
                <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-1">
                  Visión
                </label>
                <textarea
                  id="vision"
                  rows={4}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  maxLength={MAX}
                  disabled={saving}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Escribe la visión…"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Quedan {leftVision} de {MAX} caracteres
                </p>
              </div>

              {/* Botones usando ActionButtons */}
              <div className="flex justify-end">
                <ActionButtons
                  onSave={handleSave}
                  onCancel={handleCancel}
                  showSave={true}
                  showCancel={true}
                  showText={true}
                  isSaving={saving || !canSave}
                  requireConfirmCancel={hasChanges}
                  cancelConfirmText="Los cambios no guardados se perderán."
                  saveText={isEditing ? "Guardar cambios" : "Crear secciones"}
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