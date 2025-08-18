import NavbarEditionSection from "../../components/NavbarEditionSection"
import BackButton from "../../components/PagesEdition/BackButton"
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

  return (
    <div className="min-h-screen bg-white text-[#2E321B] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <NavbarEditionSection />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Edición de Eventos</h1>
          <p className="text-base text-[#475C1D]">
            Agrega, edita o elimina los eventos que se muestran públicamente.
          </p>
        </div>

        {/* Crear evento */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow mb-12">
          <h2 className="text-2xl font-semibold mb-6">Agregar nuevo Evento</h2>
          <EventCreator onSubmit={handleCreate} />
        </div>

        {/* Editar evento */}
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-8 shadow">
          <h2 className="text-2xl font-semibold mb-6">Editar Evento Existente</h2>
          <EventEditor
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
        {/* Botón de regresar abajo a la derecha */}
                <div className="flex justify-end mt-8">
                  <BackButton label="Regresar" />
                </div>
      </div>
    </div>
  )
}
