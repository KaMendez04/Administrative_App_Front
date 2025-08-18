import { useState } from "react"
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
  }

  return (
    
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Título del evento"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      <input
        type="text"
        placeholder="URL de la ilustración"
        value={illustration}
        onChange={(e) => setIllustration(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
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
