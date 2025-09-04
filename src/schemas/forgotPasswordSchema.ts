import { z } from "zod"

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Ingresa un correo válido"),
})

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>
