import { z } from "zod";

export const personalSchema = z.object({
  IDE: z.string().optional(),
  name: z.string().min(1, "Requerido"),
  lastname1: z.string().min(1, "Requerido"),
  lastname2: z.string().min(1, "Requerido"),
  birthDate: z.string().min(1, "Requerido"),
  email: z.union([z.string().email("Correo inválido"), z.literal("")]).optional(),
  phone: z.string().regex(/^\d{8}$/, "Debe tener 8 dígitos"),
  direction: z.string().min(1, "Requerido"),
  occupation: z.string().min(1, "Requerido"),

  //  Asegura booleano aunque venga "true"/"false"/"1"/"0"/"Activo"/"Inactivo"
  isActive: z
    .union([z.boolean(), z.string(), z.number()])
    .transform((v) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "number") return v === 1;
      const s = String(v).toLowerCase().trim();
      if (["true", "1", "on", "activo"].includes(s)) return true;
      if (["false", "0", "off", "inactivo"].includes(s)) return false;
      return true; // default si viene vacío o raro
    })
    .default(true),
});

export type PersonalFormValues = z.infer<typeof personalSchema>;
