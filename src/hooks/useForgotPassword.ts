import { useState } from "react"
import { forgotPasswordService } from "../services/forgotPasswordService"

export function useForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await forgotPasswordService.requestReset(email)

    // Mensaje genérico aunque el correo no exista
    if (result.ok) {
      setSent(true)
    } else {
      setError("Hubo un problema enviando el enlace. Intenta de nuevo.")
    }

    setLoading(false)
  }

  return {
    email,
    setEmail,
    loading,
    sent,
    error,
    handleSubmit,
  }
}
