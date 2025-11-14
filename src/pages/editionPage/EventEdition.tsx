import { useNavigate } from "@tanstack/react-router"
import { ActionButtons } from "../../components/ActionButtons"
import NavbarEditionSection from "../../components/NavbarEditionSection"
import { useEvents } from "../../hooks/EditionSection/EventHook"
import EventCreator from "./Event/EventCreator"
import EventEditor from "./Event/EventEditor"

export default function EventEdition() {
  const {
    events,
    selectedEventId,
    setSelectedEventId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useEvents()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f3f8ef] text-[#2E321B] p-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Edición de la Sección Eventos</h1>
          <p className="text-base text-[#475C1D]">
            Agrega, edita o elimina los eventos que se muestran públicamente.
          </p>
        </div>

        {/* Crear evento */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 shadow mb-6">
          <EventCreator onSubmit={handleCreate} />
        </div>

        {/* Editar evento */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 shadow">
          <EventEditor
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
        {/* Botón de regresar abajo a la derecha */}
                <div className="flex justify-end mt-6">
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