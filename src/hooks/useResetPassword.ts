import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { ResetPasswordFormSchema } from "../schemas/resetPasswordSchema";
import { resetPassword } from "@/auth/authResetService";


//acá es el resetear contraseña
export type BannerState = { type: "success" | "error"; text: string } | null

function zodToFormErrors(
  result: ReturnType<typeof ResetPasswordFormSchema.safeParse>
) {
  if (result.success) return undefined
  const fieldErrors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path?.[0]
    if (typeof path === "string" && !fieldErrors[path]) {
      fieldErrors[path] = issue.message
    }
  }
  return { fields: fieldErrors }
}

export function useResetPassword(token: string) {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [banner, setBanner] = React.useState<BannerState>(null)

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      // el form en onChange con Zod.safeParse
      onChange: ({ value }) => {
        const parsed = ResetPasswordFormSchema.safeParse(value)
        return zodToFormErrors(parsed)
      },
    },
    onSubmit: async ({ value, formApi }) => {
      setBanner(null)
      setLoading(true)
      const res = await resetPassword({
        resetPasswordToken: token,
        password: value.password,
      })
      setLoading(false)

      if (res.ok) {
        setBanner({ type: "success", text: "¡Contraseña actualizada! Redirigiendo al login…" })
        formApi.reset()
        setTimeout(() => navigate({ to: "/login" }), 800)
      } else {
        setBanner({ type: "error", text: res.message || "No se pudo actualizar la contraseña." })
      }
    },
  })

  return { form, loading, banner, setBanner }
}
