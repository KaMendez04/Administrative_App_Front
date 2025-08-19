import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Formato de correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  remember: z.boolean().optional().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/** Convierte un shape de Zod en validador para TanStack Form (string[] | undefined) */
export const zodFieldValidator =
  (shape: z.ZodTypeAny) =>
  ({ value }: { value: unknown }): string[] | undefined => {
    const res = shape.safeParse(value)
    return res.success ? undefined : res.error.issues.map((i) => i.message)
  }
