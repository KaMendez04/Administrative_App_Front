import { useState, useEffect } from "react"
import { showSuccessAlert, showSuccessDeleteAlert, showConfirmDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"

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

  const handleSave = async () => {
    if (!selectedEvent) return
    try {
      await onUpdate({ id: selectedEvent.id, title, date, description, illustration })
      showSuccessAlert('Actualización completada')
    } catch (err) {
      console.error("Error al guardar:", err)
    }
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

  // Mapear eventos para el CustomSelect
  const eventOptions = events.map((event: any) => ({
    value: event.id,
    label: event.title
  }))

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <CustomSelect
        value={selectedEventId ?? ""}
        onChange={(value) => setSelectedEventId(value ? Number(value) : null)}
        options={eventOptions}
        placeholder="Selecciona un evento para editar"
      />

      {selectedEvent && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título"
                  maxLength={75}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {75 - title.length} de 75 caracteres
                </div>
              </div>

              <div>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción"
                  maxLength={250}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {250 - description.length} de 250 caracteres
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={illustration}
                  onChange={(e) => setIllustration(e.target.value)}
                  placeholder="URL de imagen"
                  maxLength={1000}
                />
              </div>
              
              {illustration && (
                <img
                  src={illustration}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border border-[#DCD6C9]"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setSelectedEventId(null)}
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold"
            >
              Guardar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 font-semibold"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}