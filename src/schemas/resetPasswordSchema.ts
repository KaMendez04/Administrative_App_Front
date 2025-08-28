// src/schemas/resetPassword.schema.ts
import { z } from "zod"

export const passwordRules = z
  .string()
  .min(6, "Mínimo 6 caracteres")
  .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
  .regex(/[a-z]/, "Debe incluir al menos una minúscula")
  .regex(/\d/, "Debe incluir al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo")

// Form en la página (inputs visibles)
export const ResetPasswordFormSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      })
    }
  })

// Payload hacia el backend
export const ResetPasswordPayloadSchema = z.object({
  resetPasswordToken: z.string().min(1, "Token inválido"),
  password: passwordRules,
})

export type ResetPasswordFormType = z.infer<typeof ResetPasswordFormSchema>
export type ResetPasswordPayload = z.infer<typeof ResetPasswordPayloadSchema>
