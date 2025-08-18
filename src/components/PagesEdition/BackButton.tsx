import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  label?: string
  to?: string
}

export default function BackButton({
  label = "Regresar a Principal",
  to = "/Principal",
}: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate({ to })}
      className="inline-flex items-center gap-2 px-6 py-2 rounded-md text-white font-semibold shadow 
                 bg-gradient-to-r from-[#708C3E] to-[#4E6C2A] 
                 hover:opacity-90 transition-opacity"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
