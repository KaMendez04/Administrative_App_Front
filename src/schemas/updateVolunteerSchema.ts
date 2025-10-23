// schemas/updateVolunteerSchema.ts
import { z } from "zod";

// ============= SCHEMAS DE VALIDACIÓN PARA EDICIÓN =============

// Schema para actualizar Voluntario Individual
export const UpdateVoluntarioIndividualSchema = z.object({
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(20, "Máximo 20 caracteres"),
  
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  
  direccion: z
    .string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .min(10, "La dirección es requerida"),
  
  motivacion: z
    .string()
    .trim()
    .min(10, "Describe tu motivación en al menos 10 caracteres")
    .max(150, "Máximo 150 caracteres"),
  
  habilidades: z
    .string()
    .trim()
    .min(1, "Indica al menos una habilidad o área en la que puedas apoyar")
    .max(150, "Máximo 150 caracteres"),
  
  experiencia: z
    .string()
    .trim()
    .max(150, "Máximo 150 caracteres")
    .min(1, "La experiencia es requerida"),
  
  nacionalidad: z
    .string()
    .trim()
    .min(1, "La nacionalidad es requerida")
    .max(60, "Máximo 60 caracteres"),
});

export type UpdateVoluntarioIndividualValues = z.infer<typeof UpdateVoluntarioIndividualSchema>;

// Schema para actualizar Organización
export const UpdateOrganizacionSchema = z.object({
  numeroVoluntarios: z
    .number()
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1"),
  
  direccion: z
    .string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .min(10, "La dirección es requerida"),
  
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(20, "Máximo 20 caracteres"),
  
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email institucional inválido"),
});

export type UpdateOrganizacionValues = z.infer<typeof UpdateOrganizacionSchema>;

// Schema para actualizar Representante
export const UpdateRepresentanteSchema = z.object({
  cargo: z
    .string()
    .trim()
    .min(1, "El cargo es requerido")
    .max(100, "Máximo 100 caracteres"),
  
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(60, "Máximo 60 caracteres"),
  
  apellido1: z
    .string()
    .trim()
    .min(1, "El primer apellido es requerido")
    .max(60, "Máximo 60 caracteres"),
  
  apellido2: z
    .string()
    .trim()
    .min(1, "El segundo apellido es requerido")
    .max(60, "Máximo 60 caracteres"),
  
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(20, "Máximo 20 caracteres"),
  
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  
  direccion: z
    .string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .min(10, "La dirección es requerida"),
});

export type UpdateRepresentanteValues = z.infer<typeof UpdateRepresentanteSchema>;