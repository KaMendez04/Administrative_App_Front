import { useState } from "react"

export default function FAQCreator({ onSubmit }: any) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  // límites
  const MAX_Q = 75
  const MAX_A = 250

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) return
    onSubmit({ question, answer })
    setQuestion("")
    setAnswer("")
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Pregunta"
        className="w-full border border-gray-300 rounded-md px-4 py-2"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        maxLength={MAX_Q}                         /* límite 75 */
      />
      <p className="mt-1 text-xs text-gray-500">
        Quedan {Math.max(0, MAX_Q - (question?.length ?? 0))} de {MAX_Q} caracteres
      </p>

      <textarea
        rows={4}
        placeholder="Respuesta"
        className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        maxLength={MAX_A}                         /* ✅ límite 250 */
      />
      <p className="mt-1 text-xs text-gray-500">
        Quedan {Math.max(0, MAX_A - (answer?.length ?? 0))} de {MAX_A} caracteres
      </p>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 font-semibold"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
