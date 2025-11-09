import { useState, useEffect } from "react"
import { showSuccessAlert } from "../../../utils/alerts"
import { ActionButtons } from "../../../components/ActionButtons"

export default function ServicesInformativeCreator({ onSubmit }: any) {
  const [title, setTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [modalDescription, setModalDescription] = useState("")
  const [image, setImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Detectar si hay cambios
  useEffect(() => {
    const changed = 
      title.trim() !== "" ||
      cardDescription.trim() !== "" ||
      modalDescription.trim() !== "" ||
      image.trim() !== ""
    setHasChanges(changed)
  }, [title, cardDescription, modalDescription, image])

  const handleSave = async () => {
    if (!title.trim() || !cardDescription.trim() || !modalDescription.trim()) return
    
    setIsSaving(true)
    try {
      await onSubmit({ title, cardDescription, modalDescription, image })
      
      // Limpiar campos después de guardar
      setTitle("")
      setCardDescription("")
      setModalDescription("")
      setImage("")
      
      showSuccessAlert("Servicio creado exitosamente")
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Limpiar todos los campos
    setTitle("")
    setCardDescription("")
    setModalDescription("")
    setImage("")
  }

  // Validar si todos los campos requeridos están llenos
  const canSave = title.trim() !== "" && cardDescription.trim() !== "" && modalDescription.trim() !== ""

  return (
    <div className="space-y-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h3 className="text-xl font-semibold text-[#2E321B] mb-4">Crear Nuevo Servicio</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="Título del servicio"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={75}
          disabled={isSaving}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {75 - title.length} de 75 caracteres
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la tarjeta <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          rows={3}
          placeholder="Descripción breve que aparecerá en la tarjeta"
          value={cardDescription}
          onChange={e => setCardDescription(e.target.value)}
          maxLength={250}
          disabled={isSaving}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {250 - cardDescription.length} de 250 caracteres
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del modal <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          rows={5}
          placeholder="Descripción detallada que aparecerá en el modal"
          value={modalDescription}
          onChange={e => setModalDescription(e.target.value)}
          maxLength={250}
          disabled={isSaving}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {250 - modalDescription.length} de 250 caracteres
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de imagen (opcional)
        </label>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={image}
          onChange={e => setImage(e.target.value)}
          maxLength={1000}
          disabled={isSaving}
        />
        {image && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <img
              src={image}
              alt="Vista previa"
              className="w-full h-48 object-cover rounded-lg border border-[#DCD6C9]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <ActionButtons
          onSave={handleSave}
          onCancel={handleCancel}
          showCancel={true}
          showSave={true}
          showText={true}
          isSaving={isSaving}
          disabled={!canSave}
          requireConfirmCancel={hasChanges}
          cancelConfirmText="Los datos ingresados se perderán."
          cancelText="Cancelar"
          saveText="Crear servicio"
        />
      </div>
    </div>
  )
}