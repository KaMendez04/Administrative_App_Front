import apiConfig from "../../apiConfig/apiConfig";
import {
  VoluntarioIndividualSchema,
  type VoluntarioIndividual,
  type VolunteerApprovedListResponse,
  type VolunteerApprovedListParams,
} from "../../schemas/volunteerSchemas";
import type { UpdateVoluntarioIndividualValues } from "../../models/volunteers/UpdateVolunteerDto";

// Listado de voluntarios aprobados con paginación
export async function listVolunteersApproved(
  params: VolunteerApprovedListParams
): Promise<VolunteerApprovedListResponse> {
  const queryParams: Record<string, any> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.isActive !== undefined) queryParams.isActive = params.isActive;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;

  const response = await apiConfig.get("/voluntarios-individuales", {
    params: queryParams,
  });
  // Retornar sin validar temporalmente
  return response.data as VolunteerApprovedListResponse;
}

// Obtener detalle de voluntario
export async function getVolunteerApproved(
  id: number
): Promise<VoluntarioIndividual> {
  const response = await apiConfig.get(`/voluntarios-individuales/${id}`);
  return VoluntarioIndividualSchema.parse(response.data);
}

// Toggle estado (activar/desactivar)
export async function toggleVolunteerStatus(id: number) {
  const response = await apiConfig.patch(`/voluntarios-individuales/${id}/toggle-status`);
  return response.data;
}

// Estadísticas
export async function getVolunteersStats() {
  const response = await apiConfig.get("/voluntarios-individuales/stats");
  return response.data;
}

// Actualizar voluntario
export async function updateVolunteerIndividual(
  id: number,
  data: Partial<UpdateVoluntarioIndividualValues>
): Promise<VoluntarioIndividual> {
  const response = await apiConfig.patch(`/voluntarios-individuales/${id}`, data);
  return VoluntarioIndividualSchema.parse(response.data);
}