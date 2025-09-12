import { z } from "zod";


export const idSchema = z.number().int().positive();

export const name75Schema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(75, "Max 75 characters");

export const detail255Schema = z
  .string()
  .trim()
  .max(255, "Max 255 characters")
  .optional();

/** Monto en colones: número positivo (permite decimales). */
export const amountSchema = z.number().positive();


export const departmentSchema = z.object({
  id: idSchema,
  name: name75Schema,
});
export type DepartmentSchema = z.infer<typeof departmentSchema>;

export const incomeProjectionTypeSchema = z.object({
  id: idSchema,
  name: name75Schema,
  departmentId: idSchema,
});
export type IncomeProjectionTypeSchema = z.infer<
  typeof incomeProjectionTypeSchema
>;

export const incomeProjectionSubTypeSchema = z.object({
  id: idSchema,
  name: name75Schema,
  incomeProjectionTypeId: idSchema,
});
export type IncomeProjectionSubTypeSchema = z.infer<
  typeof incomeProjectionSubTypeSchema
>;


export const createDepartmentSchema = z.object({
  name: name75Schema,
});
export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;

export const createIncomeProjectionTypeSchema = z.object({
  name: name75Schema,
  departmentId: idSchema,
});
export type CreateIncomeProjectionTypeSchema = z.infer<
  typeof createIncomeProjectionTypeSchema
>;

export const createIncomeProjectionSubTypeSchema = z.object({
  name: name75Schema,
  incomeProjectionTypeId: idSchema,
});
export type CreateIncomeProjectionSubTypeSchema = z.infer<
  typeof createIncomeProjectionSubTypeSchema
>;


export const projectionSchema = z.object({
  departmentId: idSchema,
  incomeProjectionTypeId: idSchema,
  incomeProjectionSubTypeId: idSchema,
  amount: amountSchema,     // recuerda parsear el input de la UI a number
  detail: detail255Schema,
  fiscalYearId: idSchema.optional(),
});
export type ProjectionSchema = z.infer<typeof projectionSchema>;
