import { useState } from "react"


export default function ServicesInformativeCreator({ onSubmit }: any) {
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
      <div>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="Título"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          maxLength={75}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {75 - title.length} de 75 caracteres
        </div>
      </div>
      
      <div>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          rows={3}
          placeholder="Descripción de la tarjeta"
          value={cardDescription}
          onChange={e=>setCardDescription(e.target.value)}
          maxLength={250}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {250 - cardDescription.length} de 250 caracteres
        </div>
      </div>
      
      <div>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          rows={5}
          placeholder="Descripción del modal"
          value={modalDescription}
          onChange={e=>setModalDescription(e.target.value)}
          maxLength={250}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {250 - modalDescription.length} de 250 caracteres
        </div>
      </div>
      
      <div>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="URL de imagen (opcional)"
          value={image}
          onChange={e=>setImage(e.target.value)}
          maxLength={1000}
        />

      </div>
      
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