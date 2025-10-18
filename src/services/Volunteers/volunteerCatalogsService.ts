import {
  AreaInteresSchema,
  DisponibilidadSchema,
  type AreaInteres,
  type Disponibilidad,
} from "../../schemas/volunteerSchemas";
import apiConfig from "../apiConfig";
import { z } from "zod";

// ============= ÁREAS DE INTERÉS =============

export async function listAreasInteres(): Promise<AreaInteres[]> {
  const response = await apiConfig.get("/areas-interes");
  return z.array(AreaInteresSchema).parse(response.data);
}

export async function getAreaInteres(id: number): Promise<AreaInteres> {
  const response = await apiConfig.get(`/areas-interes/${id}`);
  return AreaInteresSchema.parse(response.data);
}

export async function updateAreaInteres(
  id: number,
  data: Partial<AreaInteres>
): Promise<AreaInteres> {
  const response = await apiConfig.patch(`/areas-interes/${id}`, data);
  return AreaInteresSchema.parse(response.data);
}

export async function deleteAreaInteres(id: number): Promise<void> {
  await apiConfig.delete(`/areas-interes/${id}`);
}

// ============= DISPONIBILIDADES =============

export async function listDisponibilidades(): Promise<Disponibilidad[]> {
  const response = await apiConfig.get("/disponibilidades");
  return z.array(DisponibilidadSchema).parse(response.data);
}

export async function getDisponibilidad(id: number): Promise<Disponibilidad> {
  const response = await apiConfig.get(`/disponibilidades/${id}`);
  return DisponibilidadSchema.parse(response.data);
}

export async function updateDisponibilidad(
  id: number,
  data: Partial<Disponibilidad>
): Promise<Disponibilidad> {
  const response = await apiConfig.patch(`/disponibilidades/${id}`, data);
  return DisponibilidadSchema.parse(response.data);
}

export async function deleteDisponibilidad(id: number): Promise<void> {
  await apiConfig.delete(`/disponibilidades/${id}`);
}