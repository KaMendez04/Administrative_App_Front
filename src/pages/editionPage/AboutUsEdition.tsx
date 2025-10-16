import NavbarEditionSection from "../../components/NavbarEditionSection"
import BackButton from "../../components/PagesEdition/BackButton"
import { useAboutUsEdit } from "../../hooks/EditionSection/AboutUsHook"
import { showSuccessAlert } from "../../utils/alerts"

export default function AboutUsEdition() {
  const {
    loading, saving, error,
    isEditing,
    whoWeAre, setWhoWeAre,
    mission, setMission,
    vision, setVision,
    saveAll,
  } = useAboutUsEdit()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await saveAll()
      
      // Mostrar alerta de éxito si no hay error
      if (!error) {
        showSuccessAlert("Actualización completada");
      }
    } catch (err) {
      // Si hay algún error, no mostrar la alerta de éxito
      console.error("Error al guardar:", err);
    }
  }

  const canCreate = whoWeAre.trim() && mission.trim() && vision.trim()

  // Máximo y contadores (estrictamente necesario para la validación visual)
  const MAX = 250
  const leftWho   = Math.max(0, MAX - (whoWeAre?.length ?? 0))
  const leftMission = Math.max(0, MAX - (mission?.length ?? 0))
  const leftVision  = Math.max(0, MAX - (vision?.length ?? 0))

  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B]">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de la Sección Sobre Nosotros</h1>
          <p className="text-base text-[#475C1D]">
            {isEditing ? "Modifica 'Quiénes somos', 'Misión' y 'Visión'." : "Crea las secciones de Sobre Nosotros."}
          </p>
        </div>

        <div className="bg-[#ffffff] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">{isEditing ? "Editar existente" : "Crear secciones"}</h2>

          {loading ? (
            <p>Cargando…</p>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  placeholder="Escribe la visión…"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Quedan {leftVision} de {MAX} caracteres
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={saving || (!isEditing && !canCreate)}
                  className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold disabled:opacity-60"
                >
                  {saving ? (isEditing ? "Guardando…" : "Creando…") : (isEditing ? "Guardar" : "Guardar")}
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <BackButton label="Regresar" />
        </div>
      </div>
    </div>
  )
}