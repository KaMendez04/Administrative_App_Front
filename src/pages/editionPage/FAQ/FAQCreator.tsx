import { useState } from "react"

export default function FAQCreator({ onSubmit }: any) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

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
      />
      <textarea
        rows={4}
        placeholder="Respuesta"
        className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
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
