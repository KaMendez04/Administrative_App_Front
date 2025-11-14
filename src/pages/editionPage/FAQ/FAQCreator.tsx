import { useState, useEffect } from "react"
import { showSuccessAlert } from "../../../utils/alerts"
import { ActionButtons } from "../../../components/ActionButtons"

export default function FAQCreator({ onSubmit }: any) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const MAX_Q = 75
  const MAX_A = 250

  // Detectar si hay cambios
  useEffect(() => {
    const changed = question.trim() !== "" || answer.trim() !== ""
    setHasChanges(changed)
  }, [question, answer])

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) return
    
    setIsSaving(true)
    try {
      await onSubmit({ question, answer })
      
      // Limpiar campos después de guardar
      setQuestion("")
      setAnswer("")
      
      showSuccessAlert("Pregunta frecuente creada exitosamente")
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Limpiar todos los campos
    setQuestion("")
    setAnswer("")
  }

  // Validar si todos los campos requeridos están llenos
  const canSave = question.trim() !== "" && answer.trim() !== ""

  return (
    <div className="space-y-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h3 className="text-xl font-semibold text-[#2E321B] mb-4">Crear Nueva Pregunta Frecuente</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pregunta <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
          placeholder="Escribe la pregunta"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={MAX_Q}
          disabled={isSaving}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {Math.max(0, MAX_Q - question.length)} de {MAX_Q} caracteres
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Respuesta <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E] resize-none"
          placeholder="Escribe la respuesta"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={MAX_A}
          disabled={isSaving}
        />
        <div className="text-sm text-gray-500 mt-1">
          Quedan {Math.max(0, MAX_A - answer.length)} de {MAX_A} caracteres
        </div>
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
          saveText="Crear pregunta"
        />
      </div>
    </div>
  )
}