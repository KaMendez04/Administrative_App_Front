import { useState } from "react"
import { forgotPasswordService } from "../services/forgotPasswordService"
import type { ForgotPasswordFormValues } from "../models/ForgotPasswordTypes"


export function useForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (values: ForgotPasswordFormValues) => {
    setLoading(true)
    setError(null)

    const result = await forgotPasswordService.requestReset(values.email)

    if (result.ok) setSent(true)
    else setError("Hubo un problema enviando el enlace. Intenta de nuevo.")

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit({ email })
  }

  return { email, setEmail, loading, sent, error, handleSubmit, submit }
}
