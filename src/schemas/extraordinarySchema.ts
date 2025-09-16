// src/schemas/extraordinarySchema.ts
import { z } from "zod";

// String numérica: hasta 15 enteros y 0-2 decimales (coma o punto)
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
  amount: MoneyStr, // string
  date: OptionalISODate,
});

export const AssignExtraordinarySchema = z.object({
  extraordinaryId: z.number().int().positive("Seleccione el extraordinario"),
  amount: MoneyStr, // string
  departmentId: z.number().int().positive("Seleccione el departamento"),
  subTypeName: z.string().trim().min(2, "Mínimo 2").max(60, "Máx 60"),
  date: OptionalISODate,
});

export const TransferSchema = z.object({
  incomeSubTypeId: z.number().int().positive("Ingrese subtipo de ingreso"),
  spendSubTypeId: z.number().int().positive("Ingrese subtipo de egreso"),
  amount: MoneyStr, // string
  date: OptionalISODate,
  name: z.string().trim().max(60, "Máx 60").optional(),
  detail: z.string().trim().max(100, "Máx 100").optional(),
});

// Helpers
export const toNum = (v: string) => Number(v.replace(",", "."));
