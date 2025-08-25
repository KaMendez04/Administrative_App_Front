import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { ChangePasswordSchema } from "../schemas/changePassword.schema"
import type { ChangePassword } from "../models/ChangePasswordType";
import { changePassword } from "../services/changePassword";

export type BannerState = { type: "success" | "error"; text: string } | null


function zodToFormErrors(
  result: ReturnType<typeof ChangePasswordSchema.safeParse>
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

export function useChangePassword() {
  const [loading, setLoading] = React.useState(false)
  const [banner, setBanner] = React.useState<BannerState>(null)

  const form = useForm({
  defaultValues: {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  } as ChangePassword, 
  validators: {
    onChange: ({ value }) => {
      const parsed = ChangePasswordSchema.safeParse(value)
      return zodToFormErrors(parsed)
    },
  },
  onSubmit: async ({ value, formApi }) => {
    setBanner(null)
    setLoading(true)
    try {
      await changePassword(value) // value es ChangePassword
      setBanner({ type: "success", text: "Contraseña actualizada exitosamente." })
      formApi.reset()
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "No se pudo actualizar la contraseña." })
    } finally {
      setLoading(false)
    }
  },
})


  return { form, loading, banner, setBanner }
}
