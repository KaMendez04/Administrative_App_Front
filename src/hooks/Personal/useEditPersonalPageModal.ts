// src/hooks/useEditPersonalPageModal.ts
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import type { PersonalPageType } from "../../models/PersonalPageType"
import { personalSchema } from "../../schemas/PersonalSchema"


// Convierte un shape de Zod en validador para TanStack Form (string[] | undefined)
const zodFieldValidator =
  (shape: z.ZodTypeAny) =>
  ({ value }: { value: unknown }): string[] | undefined => {
    const res = shape.safeParse(value)
    return res.success ? undefined : res.error.issues.map((i) => i.message)
  }

export function useEditPersonalPageModal(defaults: PersonalPageType) {
  const form = useForm({
    defaultValues: {
      IDE: defaults.IDE ?? "",
      name: defaults.name ?? "",
      lastname1: defaults.lastname1 ?? "",
      lastname2: defaults.lastname2 ?? "",
      birthDate: defaults.birthDate ?? "",
      email: defaults.email ?? "",
      phone: defaults.phone ?? "",
      direction: defaults.direction ?? "",
      occupation: defaults.occupation ?? "",
      isActive: !!defaults.isActive,
    },
    onSubmit: async () => {
      // La validación corre con los validators de cada Field
    },
  })

  // Atajos de validadores para usar directo en <form.Field validators={...}>
  const v = personalSchema.shape
  const validators = {
    name:        { onChange: zodFieldValidator(v.name) },
    lastname1:   { onChange: zodFieldValidator(v.lastname1) },
    lastname2:   { onChange: zodFieldValidator(v.lastname2) },
    birthDate:   { onChange: zodFieldValidator(v.birthDate) },
    email:       { onChange: zodFieldValidator(v.email) },
    phone:       { onChange: zodFieldValidator(v.phone) },
    direction:   { onChange: zodFieldValidator(v.direction) },
    occupation:  { onChange: zodFieldValidator(v.occupation) },
  } as const

  return { form, validators }
}
