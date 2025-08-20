import { useForm } from "@tanstack/react-form"
import type { LoginFormValues } from "../schemas/loginSchema"

type Params = {
  email: string
  password: string
  remember: boolean
  setEmail: (v: string) => void
  setPassword: (v: string) => void
  setRemember: (v: boolean) => void
  handleSubmit: (e: React.FormEvent) => void
}

/** Hook que conecta TanStack Form con tus estados/props existentes (misma lógica) */
export function useLoginTanForm({
  email,
  password,
  remember,
  setEmail,
  setPassword,
  setRemember,
  handleSubmit,
}: Params) {
  // Tipamos los defaultValues para mantener autocompletado/seguridad
  const defaultValues: LoginFormValues = { email, password, remember }

  // ⛔️ Quita los genéricos <LoginFormValues> aquí
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Sin cambiar tu contrato: solo sincroniza con tus states externos
      setEmail(value.email)
      setPassword(value.password)
      setRemember(!!value.remember)
    },
  })

  // Envuelve tu submit para validar primero con TanStack Form y luego llamar tu handleSubmit(e)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await form.handleSubmit() // valida
    handleSubmit(e)           // tu flujo original
  }

  return { form, onSubmit }
}
