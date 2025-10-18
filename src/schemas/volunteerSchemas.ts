import { z } from "zod";

// ============= PERSONA =============
export const PersonaSchema = z.object({
  idPersona: z.number(),
  cedula: z.string(),
  nombre: z.string(),
  apellido1: z.string(),
  apellido2: z.string(),
  telefono: z.string(),
  email: z.string().email(),
  direccion: z.string().nullable().optional(),
  fechaNacimiento: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Persona = z.infer<typeof PersonaSchema>;
// ============= ÁREA DE INTERÉS =============
export const AreaInteresSchema = z.object({
  idAreaInteres: z.number(),
  nombreArea: z.string(),
  tipoEntidad: z.string().optional(),
  idVoluntario: z.number().nullable().optional(), // ✅ Agregado .optional()
  idOrganizacion: z.number().nullable().optional(), // ✅ Agregado .optional()
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AreaInteres = z.infer<typeof AreaInteresSchema>;

// ============= DISPONIBILIDAD =============
export const DisponibilidadSchema = z.object({
  idDisponibilidad: z.number(),
  tipoEntidad: z.string(),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  dias: z.string().nullable().optional().default(""), // ✅ Permitir null
  horario: z.string().nullable().optional().default(""), // ✅ Permitir null
  idVoluntario: z.number().nullable().optional(),
  idOrganizacion: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Disponibilidad = z.infer<typeof DisponibilidadSchema>;

// ============= SOLICITUD (versión mínima para relación) =============
export const SolicitudMinimalSchema = z.object({
  idSolicitudVoluntariado: z.number(),
  estado: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]),
  fechaSolicitud: z.string(),
  fechaResolucion: z.string().nullable().optional(),
}).optional();

// ============= VOLUNTARIO INDIVIDUAL (versión ligera para listado) =============
export const VoluntarioIndividualLightSchema = z.object({
  idVoluntario: z.number(),
  persona: PersonaSchema,
  motivacion: z.string().optional(),
  habilidades: z.string().optional(),
  experiencia: z.string().optional(),
  nacionalidad: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const VoluntarioIndividualSchema = z.object({
  idVoluntario: z.number(),
  persona: PersonaSchema,
  motivacion: z.string(),
  habilidades: z.string(),
  experiencia: z.string(),
  nacionalidad: z.string(),
  isActive: z.boolean().optional().default(false), // ✅ Con default
  cvUrl: z.string().nullable().optional(),
  cartaUrl: z.string().nullable().optional(),
  areasInteres: z.array(AreaInteresSchema).optional().default([]),
  disponibilidades: z.array(DisponibilidadSchema).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type VoluntarioIndividual = z.infer<typeof VoluntarioIndividualSchema>;

// ============= REPRESENTANTE =============
export const RepresentanteSchema = z.object({
  idRepresentante: z.number(),
  persona: PersonaSchema,
  cargo: z.string(),
  idOrganizacion: z.number().optional(), // ✅ Agregado .optional()
  createdAt: z.string(),
  updatedAt: z.string(),

});

export type Representante = z.infer<typeof RepresentanteSchema>;

// ============= RAZÓN SOCIAL =============
export const RazonSocialSchema = z.object({
  idRazonSocial: z.number(),
  razonSocial: z.string(),
  idOrganizacion: z.number().optional(), // ✅ Agregado .optional()
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RazonSocial = z.infer<typeof RazonSocialSchema>;

// ============= ORGANIZACIÓN (versión ligera para listado) =============
export const OrganizacionLightSchema = z.object({
  idOrganizacion: z.number(),
  cedulaJuridica: z.string(),
  nombre: z.string(),
  numeroVoluntarios: z.number().optional(),
  direccion: z.string().optional(),
  telefono: z.string(),
  email: z.string().email(),
  tipoOrganizacion: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const OrganizacionSchema = z.object({
  idOrganizacion: z.number(),
  cedulaJuridica: z.string(),
  nombre: z.string(),
  numeroVoluntarios: z.number(),
  direccion: z.string(),
  telefono: z.string(),
  email: z.string().email(),
  tipoOrganizacion: z.string(),
  representantes: z.array(RepresentanteSchema).optional(),
  razonesSociales: z.array(RazonSocialSchema).optional(),
  areasInteres: z.array(AreaInteresSchema).optional(),
  disponibilidades: z.array(DisponibilidadSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Organizacion = z.infer<typeof OrganizacionSchema>;

// ============= SOLICITUD VOLUNTARIADO (para listado) =============
export const SolicitudVoluntariadoListItemSchema = z.object({
  idSolicitudVoluntariado: z.number(),
  tipoSolicitante: z.enum(["INDIVIDUAL", "ORGANIZACION"]),
  voluntario: VoluntarioIndividualLightSchema.nullable().optional(),
  organizacion: OrganizacionLightSchema.nullable().optional(),
  fechaSolicitud: z.string(),
  estado: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]),
  fechaResolucion: z.string().nullable().optional(),
  motivo: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============= SOLICITUD VOLUNTARIADO (detalle completo) =============
export const SolicitudVoluntariadoSchema = z.object({
  idSolicitudVoluntariado: z.number(),
  tipoSolicitante: z.enum(["INDIVIDUAL", "ORGANIZACION"]),
  voluntario: VoluntarioIndividualSchema.nullable().optional(),
  organizacion: OrganizacionSchema.nullable().optional(),
  fechaSolicitud: z.string(),
  estado: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]),
  fechaResolucion: z.string().nullable().optional(),
  motivo: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SolicitudVoluntariado = z.infer<typeof SolicitudVoluntariadoSchema>;

// ============= LISTADO DE SOLICITUDES =============
export const SolicitudVoluntariadoListResponseSchema = z.object({
  items: z.array(SolicitudVoluntariadoListItemSchema), // ✅ Usa el schema ligero
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

export type SolicitudVoluntariadoListResponse = z.infer<
  typeof SolicitudVoluntariadoListResponseSchema
>;

// ============= PARÁMETROS DE LISTADO =============
export interface VolunteerListParams {
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  search?: string;
  page: number;
  limit: number;
  sort?: string;
}

// ============= DTOs PARA CREAR SOLICITUD =============
export interface CreateVoluntarioIndividualValues {
  persona: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    email: string;
    direccion?: string;
    fechaNacimiento?: string;
  };
  motivacion: string;
  habilidades: string;
  experiencia: string;
  nacionalidad: string;
}

export interface CreateOrganizacionValues {
  cedulaJuridica: string;
  nombre: string;
  numeroVoluntarios: number;
  direccion: string;
  telefono: string;
  email: string;
  tipoOrganizacion: string;
}

export interface CreateRepresentanteValues {
  persona: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    email: string;
    direccion?: string;
    fechaNacimiento?: string;
  };
  cargo: string;
}

export interface CreateRazonSocialValues {
  razonSocial: string;
}

export interface CreateDisponibilidadValues {
  tipoEntidad: string;
  fechaInicio: string;
  fechaFin: string;
  dias: string;
  horario: string;
}

export interface CreateAreaInteresValues {
  nombreArea: string;
}

export interface CreateSolicitudVoluntariadoValues {
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION";
  voluntario?: CreateVoluntarioIndividualValues;
  organizacion?: CreateOrganizacionValues;
  representantes?: CreateRepresentanteValues[];
  razonesSociales?: CreateRazonSocialValues[];
  disponibilidades?: CreateDisponibilidadValues[];
  areasInteres?: CreateAreaInteresValues[];
}

// ============= PARÁMETROS PARA VOLUNTARIOS APROBADOS =============
export interface VolunteerApprovedListParams {
  isActive?: boolean;
  search?: string;
  page: number;
  limit: number;
  sort?: string;
}

// ============= RESPUESTA DE LISTADO DE VOLUNTARIOS APROBADOS =============
export const VolunteerApprovedListResponseSchema = z.object({
  items: z.array(VoluntarioIndividualSchema),
  total: z.number(),
  page: z.number(),
    limit: z.number(),
  pages: z.number(),
});

export type VolunteerApprovedListResponse = z.infer<
  typeof VolunteerApprovedListResponseSchema
>;