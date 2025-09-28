import { useEffect, useState } from "react"


export default function ServicesInformativeEditor({
  items,
  selectedId,
  setSelectedId,
  onUpdate,
  onDelete,
}: any) {
  const selected = items.find((i: any) => i.id === selectedId) ?? null
  const [title, setTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [modalDescription, setModalDescription] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    if (selected) {
      setTitle(selected.title)
      setCardDescription(selected.cardDescription)
      setModalDescription(selected.modalDescription)
      setImage(selected.image)
    } else {
      setTitle(""); setCardDescription(""); setModalDescription(""); setImage("")
    }
  }, [selected])

  const handleSave = () => {
    if (!selected) return
    onUpdate({ id: selected.id, title, cardDescription, modalDescription, image })
  }

  const handleDelete = () => {
    if (!selected) return
    if (window.confirm(`¿Eliminar el servicio "${selected.title}"?`)) {
      onDelete(selected.id)
    }
  }

  return (
    <div className="space-y-6">
      <select
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="" disabled>Selecciona un servicio</option>
        {items.map((s:any) => <option key={s.id} value={s.id}>{s.title}</option>)}
      </select>

      {selected && (
        <div className="space-y-4 border border-gray-300 p-6 rounded-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                  placeholder="Título"
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
                  value={cardDescription}
                  onChange={e=>setCardDescription(e.target.value)}
                  placeholder="Descripción de la tarjeta"
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
                  value={modalDescription}
                  onChange={e=>setModalDescription(e.target.value)}
                  placeholder="Descripción del modal"
                  maxLength={250}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {250 - modalDescription.length} de 250 caracteres
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={image}
                  onChange={e=>setImage(e.target.value)}
                  placeholder="URL de imagen"
                  maxLength={1000}
                />
              </div>
              
              {image && (
                <img
                  src={image}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border border-[#DCD6C9]"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setSelectedId(null)}
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