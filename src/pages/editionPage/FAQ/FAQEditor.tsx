import { useState, useEffect } from "react"
import { showSuccessAlert, showSuccessDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"
import { ActionButtons } from "../../../components/ActionButtons"

export default function FAQEditor({
  faqs,
  selectedFaqId,
  setSelectedFaqId,
  onUpdate,
  onDelete,
}: any) {
  const selectedFaq = faqs.find((faq: { id: any }) => faq.id === selectedFaqId) || null
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estados iniciales para detectar cambios
  const [initialQuestion, setInitialQuestion] = useState("")
  const [initialAnswer, setInitialAnswer] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const MAX_Q = 75
  const MAX_A = 250

  useEffect(() => {
    if (selectedFaq) {
      setQuestion(selectedFaq.question)
      setAnswer(selectedFaq.answer)
      
      // Guardar valores iniciales
      setInitialQuestion(selectedFaq.question)
      setInitialAnswer(selectedFaq.answer)
    } else {
      setQuestion("")
      setAnswer("")
      setInitialQuestion("")
      setInitialAnswer("")
    }
  }, [selectedFaq])

  // Detectar cambios
  useEffect(() => {
    if (selectedFaq) {
      const changed = 
        question !== initialQuestion ||
        answer !== initialAnswer
      setHasChanges(changed)
    }
  }, [question, answer, initialQuestion, initialAnswer, selectedFaq])

  const handleSave = async () => {
    if (!selectedFaq) return
    setIsSaving(true)
    try {
      await onUpdate({
        id: selectedFaq.id,
        question,
        answer,
      })
      showSuccessAlert("Actualización completada")
      
      // Actualizar valores iniciales después de guardar
      setInitialQuestion(question)
      setInitialAnswer(answer)
    } catch (err) {
      console.error("Error al guardar:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedFaq) return
    setIsDeleting(true)
    try {
      await onDelete(selectedFaq.id)
      showSuccessDeleteAlert('Eliminación completada')
      setSelectedFaqId(null)
    } catch (err) {
      console.error("Error al eliminar:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    // Restaurar valores originales
    setQuestion(initialQuestion)
    setAnswer(initialAnswer)
    setSelectedFaqId(null)
  }

  // Transformar FAQs a opciones para el CustomSelect
  const faqOptions = faqs.map((faq: any) => ({
    value: faq.id,
    label: faq.question
  }))

  // Validar si los campos requeridos están llenos
  const canSave = question.trim() !== "" && answer.trim() !== ""

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      <h2 className="text-2xl font-semibold">Editar Pregunta Frecuente</h2>

      {/* Selector */}
      <CustomSelect
        value={selectedFaqId ?? ""}
        onChange={(value) => setSelectedFaqId(value ? Number(value) : null)}
        options={faqOptions}
        placeholder="Selecciona una pregunta para editar"
      />

      {/* Formulario */}
      {selectedFaq && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pregunta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#708C3E]"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pregunta"
              maxLength={MAX_Q}
              disabled={isSaving || isDeleting}
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
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Respuesta"
              maxLength={MAX_A}
              disabled={isSaving || isDeleting}
            />
            <div className="text-sm text-gray-500 mt-1">
              Quedan {Math.max(0, MAX_A - answer.length)} de {MAX_A} caracteres
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
              deleteConfirmTitle="¿Eliminar pregunta frecuente?"
              deleteConfirmText={`¿Está seguro que desea eliminar la pregunta "${selectedFaq.question}"? Esta acción no se puede deshacer.`}
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