import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "La contraseña actual debe tener al menos 6 caracteres"),

    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una minúscula")
      .regex(/\d/, "Debe incluir al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo"),

    confirmPassword: z.string().min(1, "Debes confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>
