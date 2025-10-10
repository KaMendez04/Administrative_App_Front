import { z } from "zod";

export const SolicitudStatusEnum = z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]);
export const AssociateStatusEnum = SolicitudStatusEnum;

const PersonaSchema = z.object({
  idPersona: z.number(),
  cedula: z.string(),
  nombre: z.string(),
  apellido1: z.string(),
  apellido2: z.string(),
  fechaNacimiento: z.string(),
  telefono: z.string(),
  email: z.string(),
  direccion: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const NucleoFamiliarSchema = z.object({
  idNucleoFamiliar: z.number(),
  nucleoHombres: z.number(),
  nucleoMujeres: z.number(),
  nucleoTotal: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const GeografiaSchema = z.object({
  idGeografia: z.number(),
  provincia: z.string(),
  canton: z.string(),
  distrito: z.string(),
  caserio: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ✅ Propietario
const PropietarioSchema = z.object({
  idPropietario: z.number(),
  persona: PersonaSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/* ============ HATO ============ */
const HatoAnimalSchema = z.object({
  idAnimal: z.number().nullable().optional(),
  nombre: z.string().nullable().optional(),
  edad: z.number().nullable().optional(),
  cantidad: z.number().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

const HatoSchema = z.object({
  idHato: z.number().nullable().optional(),
  tipoExplotacion: z.string().nullable().optional(),
  totalGanado: z.number().nullable().optional(),
  razaPredominante: z.string().nullable().optional(),
  animales: z.array(HatoAnimalSchema).nullable().optional().default([]),
});

/* ========== FORRAJES ========== */
const ForrajeSchema = z.object({
  idForraje: z.number().nullable().optional(),
  tipoForraje: z.string().nullable().optional(),
  variedad: z.string().nullable().optional(),
  hectareas: z.string().nullable().optional(),
  utilizacion: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

/* === REGISTROS PRODUCTIVOS === */
const RegistrosProductivosSchema = z.object({
  idRegistrosProductivos: z.number().nullable().optional(),
  reproductivos: z.boolean().nullable().optional(),
  costosProductivos: z.boolean().nullable().optional(),
});

/* ====== FUENTES DE AGUA ====== */
const FuenteAguaSchema = z.object({
  idFuenteAgua: z.number().nullable().optional(),
  idFinca: z.number().nullable().optional(),
  nombre: z.string().nullable().optional(),
});

const MetodoRiegoSchema = z.object({
  idMetodoRiego: z.number().nullable().optional(),
  nombre: z.string().nullable().optional(),
});

const ActividadSchema = z.object({
  idActividad: z.number().nullable().optional(),
  idFinca: z.number().nullable().optional(),
  nombre: z.string().nullable().optional(),
});

// === Infraestructura (resumen de conteos) ===
const InfraestructuraResumenSchema = z.object({
  idInfraestructura: z.number().nullable().optional(),
  numeroAparatos: z.number().nullable().optional(),
  numeroBebederos: z.number().nullable().optional(),
  numeroSaleros: z.number().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

// === Tipo de cerca (flags) ===
const TipoCercaSchema = z.object({
  idTipoCerca: z.number().nullable().optional(),
  viva: z.boolean().nullable().optional(),
  electrica: z.boolean().nullable().optional(),
  pMuerto: z.boolean().nullable().optional(),
});

// Link de tipo de cerca
const TipoCercaLinkSchema = z.object({
  id: z.number().nullable().optional(),
  idFinca: z.number().nullable().optional(),
  idTipoCerca: z.number().nullable().optional(),
  tipoCerca: TipoCercaSchema.nullable().optional(),
});

// === Infraestructura (detallada) ===
const InfraestructuraDetalleSchema = z.object({
  idInfraestructura: z.number().nullable().optional(),
  nombre: z.string().nullable().optional(),
  descripcion: z.string().nullable().optional(),
});

// Link de infraestructura detallada
const InfraLinkSchema = z.object({
  id: z.number().nullable().optional(),
  idFinca: z.number().nullable().optional(),
  idInfraestructura: z.number().nullable().optional(),
  infraestructura: InfraestructuraDetalleSchema.nullable().optional(),
});

const CorrienteElectricaSchema = z.object({
  idCorrienteElectrica: z.number().nullable().optional(),
  publica: z.boolean().nullable().optional(),
  privada: z.boolean().nullable().optional(),
});

const AccesoSchema = z.object({
  idAcceso: z.number().nullable().optional(),
  nombre: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

const FincaSchema = z.object({
  idFinca: z.number(),
  nombre: z.string(),
  areaHa: z.string(),
  numeroPlano: z.string(),
  idGeografia: z.number().nullable().optional(),
  geografia: GeografiaSchema.nullable().optional(),
  propietario: PropietarioSchema.nullable().optional(),
  hato: HatoSchema.nullable().optional(),
  forrajes: z.array(ForrajeSchema).nullable().optional().default([]),
  registrosProductivos: RegistrosProductivosSchema.nullable().optional(),
  fuentesAgua: z.array(FuenteAguaSchema).nullable().optional().default([]),
  metodosRiego: z.array(MetodoRiegoSchema).nullable().optional().default([]),
  actividades: z.array(ActividadSchema).nullable().optional().default([]),
  infraestructura: InfraestructuraResumenSchema.nullable().optional(),
  tipoCercaLinks: z.array(TipoCercaLinkSchema).nullable().optional().default([]),
  infraLinks: z.array(InfraLinkSchema).nullable().optional().default([]),
  corriente: CorrienteElectricaSchema.nullable().optional(), // ✅ NUEVO
  accesos: z.array(AccesoSchema).nullable().optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const AsociadoSchema = z.object({
  idAsociado: z.number(),
  distanciaFinca: z.string().nullable().optional(),
  viveEnFinca: z.boolean(),
  marcaGanado: z.string().nullable().optional(),
  CVO: z.string().nullable().optional(),
  esPropietario: z.boolean().optional().default(false),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  nucleoFamiliar: NucleoFamiliarSchema.nullable().optional(),
  fincas: z.array(FincaSchema).optional().default([]),
});

export const SolicitudSchema = z.object({
  idSolicitud: z.number(),
  persona: PersonaSchema,
  asociado: AsociadoSchema,
  estado: SolicitudStatusEnum,
  fechaSolicitud: z.string(),
  fechaResolucion: z.string().nullable().optional(),
  motivo: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Solicitud = z.infer<typeof SolicitudSchema>;
export type NucleoFamiliar = z.infer<typeof NucleoFamiliarSchema>;
export type Geografia = z.infer<typeof GeografiaSchema>;
export type Propietario = z.infer<typeof PropietarioSchema>;
export type Finca = z.infer<typeof FincaSchema>;

export const AssociateSchema = z.object({
  idAsociado: z.number(),
  persona: PersonaSchema,
  distanciaFinca: z.string().nullable().optional(),
  viveEnFinca: z.boolean(),
  marcaGanado: z.string().nullable().optional(),
  CVO: z.string().nullable().optional(),
  esPropietario: z.boolean().optional().default(false),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  nucleoFamiliar: NucleoFamiliarSchema.nullable().optional(),
  fincas: z.array(FincaSchema).optional().default([]),
  solicitud: z.object({
    idSolicitud: z.number(),
    estado: SolicitudStatusEnum,
    fechaSolicitud: z.string(),
    fechaResolucion: z.string().nullable().optional(),
    motivo: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }).nullable().optional(),
});

export type Associate = z.infer<typeof AssociateSchema>;

// Resto de schemas...
export const SolicitudListResponseSchema = z.object({
  items: z.array(SolicitudSchema),
  total: z.coerce.number(),
  page: z.coerce.number(),
  pages: z.coerce.number(),
});

export type SolicitudListResponse = z.infer<typeof SolicitudListResponseSchema>;

export const AssociateListResponseSchema = z.object({
  items: z.array(AssociateSchema),
  total: z.coerce.number(),
  page: z.coerce.number(),
  pages: z.coerce.number(),
});

export type AssociateListResponse = z.infer<typeof AssociateListResponseSchema>;

export const AdminListParamsSchema = z.object({
  status: SolicitudStatusEnum.optional(),
  search: z.string().trim().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().trim().optional(),
});

export type AdminListParams = z.infer<typeof AdminListParamsSchema>;

// Associates (sin status, con estado)
export const AssociateListParamsSchema = z.object({
  estado: z.boolean().optional(), // true = activos, false = inactivos
  search: z.string().trim().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.string().trim().optional(),
});

export type AssociateListParams = z.infer<typeof AssociateListParamsSchema>;

export const RejectSchema = z.object({
  motivo: z.string().trim().min(5, "Explica brevemente el motivo (mínimo 5 caracteres)").max(255),
});

export type RejectValues = z.infer<typeof RejectSchema>;

export const UpdateAssociateSchema = z.object({
  telefono: z.string().trim().min(8, "Mínimo 8 caracteres").max(12, "Máximo 12 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  direccion: z.string().trim().max(255, "Máximo 255 caracteres").optional(),
  marcaGanado: z.string().trim().max(100, "Máximo 100 caracteres").optional(),
  CVO: z.string().trim().max(100, "Máximo 100 caracteres").optional(),
});

export type UpdateAssociateValues = z.infer<typeof UpdateAssociateSchema>;
