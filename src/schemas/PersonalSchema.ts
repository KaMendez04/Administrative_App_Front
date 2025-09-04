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
  isActive: z.boolean().optional(),

});

export type PersonalFormValues = z.infer<typeof personalSchema>;
