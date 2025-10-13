import { useState, useEffect } from "react"
import { showSuccessAlert, showSuccessDeleteAlert, showConfirmDeleteAlert } from "../../../utils/alerts"

export default function EventEditor({
  events,
  selectedEventId,
  setSelectedEventId,
  onUpdate,
  onDelete,
}: any) {
  const selectedEvent = events.find((e: any) => e.id === selectedEventId) || null
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [illustration, setIllustration] = useState("")

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title)
      setDate(selectedEvent.date)
      setDescription(selectedEvent.description)
      setIllustration(selectedEvent.illustration)
    } else {
      setTitle("")
      setDate("")
      setDescription("")
      setIllustration("")
    }
  }, [selectedEvent])

  const handleSave = () => {
    if (!selectedEvent) return
    onUpdate({ id: selectedEvent.id, title, date, description, illustration })
    showSuccessAlert('Actualización completada')
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    const confirmed = await showConfirmDeleteAlert(
      'Confirmar eliminación',
      `¿Está seguro que desea eliminar el evento "${selectedEvent.title}"?`
    )
    if (confirmed) {
      onDelete(selectedEvent.id)
      showSuccessDeleteAlert('Eliminación completada')
    }
  }

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <select
        value={selectedEventId ?? ""}
        onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : null)}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      >
        <option value="" disabled>
          Selecciona un evento para editar
        </option>
        {events.map((event: any) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>

      {selectedEvent && (
        <div className="space-y-4 border border-gray-300 p-6 rounded-xl">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              maxLength={75}
            />
            <div className="text-sm text-gray-500 mt-1">
              Quedan {75 - title.length} de 75 caracteres
            </div>
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />

          <div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              maxLength={250}
            />
            <div className="text-sm text-gray-500 mt-1">
              Quedan {250 - description.length} de 250 caracteres
            </div>
          </div>

          <div>
            <input
              type="text"
              value={illustration}
              onChange={(e) => setIllustration(e.target.value)}
              placeholder="URL de imagen"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              maxLength={1000}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setSelectedEventId(null)}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
            >
              Guardar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
