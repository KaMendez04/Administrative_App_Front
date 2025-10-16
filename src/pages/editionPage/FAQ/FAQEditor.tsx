import { useState, useEffect } from "react"
import { showSuccessAlert, showSuccessDeleteAlert, showConfirmDeleteAlert } from "../../../utils/alerts"
import { CustomSelect } from "../../../components/CustomSelect"

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

  const MAX_Q = 75
  const MAX_A = 250

  useEffect(() => {
    if (selectedFaq) {
      setQuestion(selectedFaq.question)
      setAnswer(selectedFaq.answer)
    } else {
      setQuestion("")
      setAnswer("")
    }
  }, [selectedFaq])

  const handleSave = () => {
    if (!selectedFaq) return
    onUpdate({
      id: selectedFaq.id,
      question,
      answer,
    })
    showSuccessAlert('Actualización completada')
  }

  const handleDelete = async () => {
    if (!selectedFaq) return
    const confirmed = await showConfirmDeleteAlert(
      'Confirmar eliminación',
      '¿Está seguro que desea eliminar esta pregunta?'
    )
    if (confirmed) {
      onDelete(selectedFaq.id)
      showSuccessDeleteAlert('Eliminación completada')
    }
  }

  // 👇 Transformar FAQs a opciones para el CustomSelect
  const faqOptions = faqs.map((faq: any) => ({
    value: faq.id,
    label: faq.question
  }))

  return (
    <div className="space-y-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-8 shadow">
      {/* Selector - Reemplazado por CustomSelect */}
      <CustomSelect
        value={selectedFaqId ?? ""}
        onChange={(value) => setSelectedFaqId(Number(value))}
        options={faqOptions}
        placeholder="Selecciona una pregunta para editar"
      />

      {/* Formulario */}
      {selectedFaq && (
        <div className="border border-gray-300 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={MAX_Q}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Quedan {Math.max(0, MAX_Q - (question?.length ?? 0))} de {MAX_Q} caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta</label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={MAX_A}
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Quedan {Math.max(0, MAX_A - (answer?.length ?? 0))} de {MAX_A} caracteres
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
              onClick={() => setSelectedFaqId(null)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 font-semibold"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}