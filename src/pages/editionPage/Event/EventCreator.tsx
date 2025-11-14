import { useState, useEffect } from "react"
import { showSuccessAlert } from "../../../utils/alerts"
import { ActionButtons } from "../../../components/ActionButtons"
import type { EventInput } from "../../../models/editionSection/EventEditionType"

export default function EventCreator({ onSubmit }: { onSubmit: (data: EventInput) => void }) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [illustration, setIllustration] = useState("")
  const [isSaving, setIsSaving] = useState(false)
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

  // Detectar si hay cambios
  useEffect(() => {
    const changed = 
      title.trim() !== "" ||
      date.trim() !== "" ||
      description.trim() !== "" ||
      illustration.trim() !== ""
    setHasChanges(changed)
  }, [title, date, description, illustration])

  const handleSave = async () => {
    if (!title.trim() || !date.trim() || !description.trim()) return
    
    // ✅ Validación adicional: verificar que la fecha no sea anterior a hoy
    if (date < minDate) {
      showSuccessAlert("No se pueden crear eventos con fechas pasadas")
      return
    }
    
    setIsSaving(true)
    try {
      await onSubmit({ title, date, description, illustration })
      
      // Limpiar campos después de guardar
      setTitle("")
      setDate("")
      setDescription("")
      setIllustration("")
      
      showSuccessAlert("Evento creado exitosamente")
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Limpiar todos los campos
    setTitle("")
    setDate("")
    setDescription("")
    setIllustration("")
  }

  // Validar si todos los campos requeridos están llenos
  const canSave = title.trim() !== "" && date.trim() !== "" && description.trim() !== ""

  return (
    <div className="space-y-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h3 className="text-xl font-semibold text-[#2E321B] mb-4">Crear Nuevo Evento</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título del evento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="Ingresa el título del evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={75}
          disabled={isSaving}
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
          disabled={isSaving}
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
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          placeholder="Describe el evento"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={250}
          disabled={isSaving}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {250 - description.length} de 250 caracteres
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de la ilustración (opcional)
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={illustration}
          onChange={(e) => setIllustration(e.target.value)}
          maxLength={1000}
          disabled={isSaving}
        />
        {illustration && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <img
              src={illustration}
              alt="Vista previa del evento"
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
          saveText="Crear evento"
        />
      </div>
    </div>
  )
}