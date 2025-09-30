import { z } from "zod";

export const AssociateStatusEnum = z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]);

export const AdminListParamsSchema = z.object({
  status: AssociateStatusEnum.optional(),
  search: z.string().trim().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().trim().optional(), // "createdAt:desc"
});
export type AdminListParams = z.infer<typeof AdminListParamsSchema>;

export const RejectSchema = z.object({
  motivo: z.string().trim().min(5, "Explica brevemente el motivo (mínimo 5 caracteres)").max(255),
});
export type RejectValues = z.infer<typeof RejectSchema>;

export const UpdateAssociateSchema = z.object({
  telefono: z.string().trim().min(8).max(12).optional(),
  email: z.string().email().optional(),
  direccion: z.string().trim().max(255).optional(),
  marcaGanado: z.string().trim().max(100).optional(),
  CVO: z.string().trim().max(100).optional(),
});
export type UpdateAssociateValues = z.infer<typeof UpdateAssociateSchema>;

export const AdminAssociateSchema = z.object({
  id: z.number(),
  cedula: z.string(),
  nombre: z.string(),
  apellido1: z.string(),
  apellido2: z.string(),
  fechaNacimiento: z.string(), // "YYYY-MM-DD"
  telefono: z.string(),
  email: z.string(),
  direccion: z.string().nullable().optional(),
  distanciaFinca: z.string().nullable().optional(),
  viveEnFinca: z.boolean(),
  marcaGanado: z.string().nullable().optional(),
  CVO: z.string().nullable().optional(),
  estado: AssociateStatusEnum,
  motivoRechazo: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminAssociate = z.infer<typeof AdminAssociateSchema>;

export const AdminListResponseSchema = z.object({
  items: z.array(AdminAssociateSchema),
  total: z.number(),
  page: z.number(),
  pages: z.number(),
});
export type AdminListResponse = z.infer<typeof AdminListResponseSchema>;
