import { z } from "zod";

export const MoneyStr = z
  .string()
  .trim()
  .min(1, "Requerido")
  .regex(/^\d{1,15}([.,]\d{1,2})?$/, "Formato inválido (ej: 1000.50)")
  .refine((v) => Number(v.replace(",", ".")) > 0, "Debe ser mayor a 0");

export const OptionalISODate = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Fecha inválida (YYYY-MM-DD)");

export const CreateExtraordinarySchema = z.object({
  name: z.string().trim().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100"),
  amount: z
    .string()
    .trim()
    .min(1, "Ingresa el monto.")
    .regex(/^\d{1,3}( \d{3})*(,\d{0,2})?$|^\d+(,\d{0,2})?$/, "Monto inválido"),
  date: OptionalISODate,
});

export const AssignExtraordinarySchema = z.object({
  extraordinaryId: z.number().int().positive("Seleccione el extraordinario"),
  amount: z
    .string()
    .trim()
    .min(1, "Ingresa el monto.")
    .regex(/^\d{1,3}( \d{3})*(,\d{0,2})?$|^\d+(,\d{0,2})?$/, "Monto inválido"),
  departmentId: z.number().int().positive("Seleccione el departamento"),
  subTypeName: z.string().trim().min(2, "Mínimo 2").max(60, "Máx 60"),
  date: OptionalISODate,
});

export const TransferSchema = z.object({
  incomeSubTypeId: z.number().int().positive("Ingrese subtipo de ingreso"),
  spendSubTypeId: z.number().int().positive("Ingrese subtipo de egreso"),
  amount: z
    .string()
    .trim()
    .min(1, "Ingresa el monto.")
    .regex(/^\d{1,3}( \d{3})*(,\d{0,2})?$|^\d+(,\d{0,2})?$/, "Monto inválido"),
  date: OptionalISODate,
  name: z.string().trim().max(60, "Máx 60").optional(),
  detail: z.string().trim().max(100, "Máx 100").optional(),
});

// Helpers
export const toNum = (v: string) =>
  Number(
    v
      .replace(/\s/g, "")
      .replace(",", ".")
  )


export const ExtraordinarySchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.string(),
  used: z.string(),
  date: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  canEditAmount: z.boolean().optional(),
})

export const ExtraordinaryListSchema = z.array(ExtraordinarySchema)
const CRMoneyRegex = /^\d{1,3}( \d{3})*(,\d{0,2})?$|^\d+(,\d{0,2})?$/

export const UpdateExtraordinarySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(120, "El nombre no puede superar 120 caracteres."),

  date: z
    .string()
    .trim()
    .min(1, "La fecha es obligatoria.")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "La fecha debe tener formato YYYY-MM-DD."),

  amount: z
    .string()
    .trim()
    .min(1, "El monto es obligatorio.")
    .regex(CRMoneyRegex, "Monto inválido (ej: 70 000,90)")
    .refine((v) => toNum(v) > 0, "Debe ser mayor a 0"),
})

export type Extraordinary = z.infer<typeof ExtraordinarySchema>
export type UpdateExtraordinaryValues = z.infer<typeof UpdateExtraordinarySchema>