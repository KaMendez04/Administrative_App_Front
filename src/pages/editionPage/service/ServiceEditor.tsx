import { useEffect, useState } from "react"
import { showSuccessAlert, showSuccessDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"
import { ActionButtons } from "../../../components/ActionButtons"

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
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estados iniciales para detectar cambios
  const [initialTitle, setInitialTitle] = useState("")
  const [initialCardDescription, setInitialCardDescription] = useState("")
  const [initialModalDescription, setInitialModalDescription] = useState("")
  const [initialImage, setInitialImage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (selected) {
      setTitle(selected.title)
      setCardDescription(selected.cardDescription)
      setModalDescription(selected.modalDescription)
      setImage(selected.image)
      
      // Guardar valores iniciales
      setInitialTitle(selected.title)
      setInitialCardDescription(selected.cardDescription)
      setInitialModalDescription(selected.modalDescription)
      setInitialImage(selected.image)
    } else {
      setTitle("")
      setCardDescription("")
      setModalDescription("")
      setImage("")
      setInitialTitle("")
      setInitialCardDescription("")
      setInitialModalDescription("")
      setInitialImage("")
    }
  }, [selected])

  // Detectar cambios
  useEffect(() => {
    if (selected) {
      const changed = 
        title !== initialTitle ||
        cardDescription !== initialCardDescription ||
        modalDescription !== initialModalDescription ||
        image !== initialImage
      setHasChanges(changed)
    }
  }, [title, cardDescription, modalDescription, image, initialTitle, initialCardDescription, initialModalDescription, initialImage, selected])

  const handleSave = async () => {
    if (!selected) return
    setIsSaving(true)
    try {
      await onUpdate({ id: selected.id, title, cardDescription, modalDescription, image })
      showSuccessAlert("Actualización completada")
      
      // Actualizar valores iniciales después de guardar
      setInitialTitle(title)
      setInitialCardDescription(cardDescription)
      setInitialModalDescription(modalDescription)
      setInitialImage(image)
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setIsDeleting(true)
    try {
      await onDelete(selected.id)
      showSuccessDeleteAlert('Eliminación completada')
      setSelectedId(null)
    } catch (err) {
      console.error("Error al eliminar:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    // Restaurar valores originales
    setTitle(initialTitle)
    setCardDescription(initialCardDescription)
    setModalDescription(initialModalDescription)
    setImage(initialImage)
    setSelectedId(null)
  }

  // Transformar servicios a opciones para el CustomSelect
  const serviceOptions = items.map((s: any) => ({
    value: s.id,
    label: s.title
  }))

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      {/* Selector */}
                <h2 className="text-2xl font-semibold mb-6">Editar Servicio Existente</h2>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Título"
                  maxLength={75}
                  disabled={isSaving || isDeleting}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {75 - title.length} de 75 caracteres
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la tarjeta
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  rows={3}
                  value={cardDescription}
                  onChange={e => setCardDescription(e.target.value)}
                  placeholder="Descripción de la tarjeta"
                  maxLength={250}
                  disabled={isSaving || isDeleting}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {250 - cardDescription.length} de 250 caracteres
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del modal
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  rows={5}
                  value={modalDescription}
                  onChange={e => setModalDescription(e.target.value)}
                  placeholder="Descripción del modal"
                  maxLength={250}
                  disabled={isSaving || isDeleting}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {250 - modalDescription.length} de 250 caracteres
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de imagen
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="URL de imagen"
                  maxLength={1000}
                  disabled={isSaving || isDeleting}
                />
              </div>
              
              {image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vista previa
                  </label>
                  <img
                    src={image}
                    alt="Vista previa"
                    className="w-full h-48 object-cover rounded-lg border border-[#DCD6C9]"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botones usando ActionButtons */}
          <div className="flex justify-end">
            <ActionButtons
              onCancel={handleCancel}
              onSave={handleSave}
              onDelete={handleDelete}
              showCancel={true}
              showSave={true}
              showDelete={true}
              showText={true}
              isSaving={isSaving}
              isDeleting={isDeleting}
              requireConfirmCancel={hasChanges}
              requireConfirmDelete={true}
              cancelConfirmText="Los cambios no guardados se perderán."
              deleteConfirmTitle="¿Eliminar servicio?"
              deleteConfirmText={`¿Está seguro que desea eliminar el servicio "${selected.title}"? Esta acción no se puede deshacer.`}
              cancelText="Cancelar"
              saveText="Guardar cambios"
              deleteText="Eliminar"
            />
          </div>
        </div>
      )}
    </div>
  )
}