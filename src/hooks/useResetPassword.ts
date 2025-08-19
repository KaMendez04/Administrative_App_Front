import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import type { ResetPasswordType } from "../models/ResetPasswordType"
import { resetPassword } from "../services/authResetService"

export function useResetPassword(token: string) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload: ResetPasswordType = { resetPasswordToken: token, password }
    const res = await resetPassword(payload)

    if (res.ok) {
      setDone(true)
      router.navigate({ to: "/login" })
    } else {
      setError(res.message || "No se pudo actualizar la contraseña.")
    }
    setLoading(false)
  }

  return { password, setPassword, loading, error, done, handleSubmit }
}
