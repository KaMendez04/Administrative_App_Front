import { useState } from "react"
import type { ServicesInformativeInput } from "../../../models/editionSection/ServiceEditionType"

export default function ServicesInformativeCreator({ onSubmit }: { onSubmit: (data: ServicesInformativeInput) => void }) {
  const [title, setTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [modalDescription, setModalDescription] = useState("")
  const [image, setImage] = useState("")

  const handleSave = () => {
    if (!title.trim() || !cardDescription.trim() || !modalDescription.trim()) return
    onSubmit({ title, cardDescription, modalDescription, image })
    setTitle(""); setCardDescription(""); setModalDescription(""); setImage("")
  }

  return (
    <div className="space-y-4">
      <input
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
        placeholder="Título"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
      <textarea
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
        rows={3}
        placeholder="Descripción de la tarjeta"
        value={cardDescription}
        onChange={e=>setCardDescription(e.target.value)}
      />
      <textarea
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
        rows={5}
        placeholder="Descripción del modal"
        value={modalDescription}
        onChange={e=>setModalDescription(e.target.value)}
      />
      <input
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
        placeholder="URL de imagen (opcional)"
        value={image}
        onChange={e=>setImage(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
