// src/components/Personal/BackButton.tsx
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate({ to: ".." })}
      className="flex items-center gap-2 bg-[#708C3E] hover:bg-[#A3853D] text-white px-5 py-2 rounded-md shadow-md transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm font-medium">Regresar</span>
    </button>
  )
}
