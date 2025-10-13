import { useState } from "react"
import { showSuccessAlert } from "../../../utils/alerts" // Importa la función aquí
import type { EventInput } from "../../../models/editionSection/EventEditionType"

export default function EventCreator({ onSubmit }: { onSubmit: (data: EventInput) => void }) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [illustration, setIllustration] = useState("")

  const handleSubmit = () => {
    if (!title || !date || !description) return
    onSubmit({ title, date, description, illustration })
    setTitle("")
    setDate("")
    setDescription("")
    setIllustration("")
    // Mostrar alerta con mensaje de éxito
    showSuccessAlert("Evento guardado con éxito")
  }

  return (
    <div className="space-y-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <div>
        <input
          type="text"
          placeholder="Título del evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
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
          placeholder="URL de la ilustración"
          value={illustration}
          onChange={(e) => setIllustration(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
          maxLength={1000}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
