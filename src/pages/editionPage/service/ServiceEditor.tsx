import { useEffect, useState } from "react"
import { showSuccessAlert, showSuccessDeleteAlert, showConfirmDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"

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

  const handleSave = async () => {
    if (!selected) return
    try {
      await onUpdate({ id: selected.id, title, cardDescription, modalDescription, image })
      showSuccessAlert("Actualización completada")
    } catch (err) {
      console.error("Error al guardar:", err)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    const confirmed = await showConfirmDeleteAlert(
      'Confirmar eliminación',
      `¿Está seguro que desea eliminar el servicio "${selected.title}"?`
    )
    if (confirmed) {
      onDelete(selected.id)
      showSuccessDeleteAlert('Eliminación completada')
    }
  }

  // 👇 Transformar servicios a opciones para el CustomSelect
  const serviceOptions = items.map((s: any) => ({
    value: s.id,
    label: s.title
  }))

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      {/* Selector - Reemplazado por CustomSelect */}
      <CustomSelect
        value={selectedId ?? ""}
        onChange={(value) => setSelectedId(value ? Number(value) : null)}
        options={serviceOptions}
        placeholder="Selecciona un servicio"
      />

      {selected && (
        <div className="space-y-4">
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