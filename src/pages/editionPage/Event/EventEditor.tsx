import { useState, useEffect } from "react"
import { showSuccessAlert, showSuccessDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"
import { ActionButtons } from "../../../components/ActionButtons"

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
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estados iniciales para detectar cambios
  const [initialTitle, setInitialTitle] = useState("")
  const [initialDate, setInitialDate] = useState("")
  const [initialDescription, setInitialDescription] = useState("")
  const [initialIllustration, setInitialIllustration] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // ✅ Obtener fecha mínima (hoy)
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const minDate = getTodayDate()

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title)
      setDate(selectedEvent.date)
      setDescription(selectedEvent.description)
      setIllustration(selectedEvent.illustration)
      
      // Guardar valores iniciales
      setInitialTitle(selectedEvent.title)
      setInitialDate(selectedEvent.date)
      setInitialDescription(selectedEvent.description)
      setInitialIllustration(selectedEvent.illustration)
    } else {
      setTitle("")
      setDate("")
      setDescription("")
      setIllustration("")
      setInitialTitle("")
      setInitialDate("")
      setInitialDescription("")
      setInitialIllustration("")
    }
  }, [selectedEvent])

  // Detectar cambios
  useEffect(() => {
    if (selectedEvent) {
      const changed = 
        title !== initialTitle ||
        date !== initialDate ||
        description !== initialDescription ||
        illustration !== initialIllustration
      setHasChanges(changed)
    }
  }, [title, date, description, illustration, initialTitle, initialDate, initialDescription, initialIllustration, selectedEvent])

  const handleSave = async () => {
    if (!selectedEvent) return
    
    // ✅ Validación adicional: verificar que la fecha no sea anterior a hoy
    if (date < minDate) {
      showSuccessAlert("No se pueden programar eventos con fechas pasadas")
      return
    }
    
    setIsSaving(true)
    try {
      await onUpdate({ id: selectedEvent.id, title, date, description, illustration })
      showSuccessAlert("Actualización completada")
      
      // Actualizar valores iniciales después de guardar
      setInitialTitle(title)
      setInitialDate(date)
      setInitialDescription(description)
      setInitialIllustration(illustration)
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    setIsDeleting(true)
    try {
      await onDelete(selectedEvent.id)
      showSuccessDeleteAlert('Eliminación completada')
      setSelectedEventId(null)
    } catch (err) {
      console.error("Error al eliminar:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    // Restaurar valores originales
    setTitle(initialTitle)
    setDate(initialDate)
    setDescription(initialDescription)
    setIllustration(initialIllustration)
    setSelectedEventId(null)
  }

  // Mapear eventos para el CustomSelect
  const eventOptions = events.map((event: any) => ({
    value: event.id,
    label: event.title
  }))

  // Validar si los campos requeridos están llenos
  const canSave = title.trim() !== "" && date.trim() !== "" && description.trim() !== ""

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h2 className="text-2xl font-semibold">Editar Evento Existente</h2>

      {/* Selector */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  Fecha del evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDate} // ✅ Bloquea fechas anteriores a hoy
                  disabled={isSaving || isDeleting}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Solo se permiten fechas a partir de hoy
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción"
                  maxLength={250}
                  disabled={isSaving || isDeleting}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Quedan {250 - description.length} de 250 caracteres
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la ilustración
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
                  value={illustration}
                  onChange={(e) => setIllustration(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  maxLength={1000}
                  disabled={isSaving || isDeleting}
                />
              </div>
              
              {illustration && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vista previa
                  </label>
                  <img
                    src={illustration}
                    alt="Vista previa del evento"
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
              disabled={!canSave}
              isSaving={isSaving}
              isDeleting={isDeleting}
              requireConfirmCancel={hasChanges}
              requireConfirmDelete={true}
              cancelConfirmText="Los cambios no guardados se perderán."
              deleteConfirmTitle="¿Eliminar evento?"
              deleteConfirmText={`¿Está seguro que desea eliminar el evento "${selectedEvent.title}"? Esta acción no se puede deshacer.`}
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