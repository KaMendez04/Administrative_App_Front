import { z } from "zod"

export const strongPasswordSchema = z
  .string()
  .min(8, "Debe tener al menos 8 caracteres.")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula.")
  .regex(/[a-z]/, "Debe contener al menos una minúscula.")
  .regex(/[0-9]/, "Debe contener al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo.");
