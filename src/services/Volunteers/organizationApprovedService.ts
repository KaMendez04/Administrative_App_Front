import apiConfig from "../apiConfig";
import {
  OrganizacionSchema,
  type Organizacion,
  type OrganizacionApprovedListParams,
  type OrganizacionApprovedListResponse,
} from "../../schemas/volunteerSchemas";

// Listado de organizaciones aprobadas con paginación
export async function listOrganizationsApproved(
  params: OrganizacionApprovedListParams
): Promise<OrganizacionApprovedListResponse> {
  const queryParams: Record<string, any> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.isActive !== undefined) queryParams.isActive = params.isActive;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;

  const response = await apiConfig.get("/organizaciones", {
    params: queryParams,
  });
  
  return response.data as OrganizacionApprovedListResponse;
}

// Obtener detalle de organización
export async function getOrganizationApproved(
  id: number
): Promise<Organizacion> {
  const response = await apiConfig.get(`/organizaciones/${id}`);
  return OrganizacionSchema.parse(response.data);
}

// Toggle estado (activar/desactivar)
export async function toggleOrganizacionStatus(id: number) {
  const response = await apiConfig.patch(`/organizaciones/${id}/toggle-status`);
  return response.data;
}

// Actualizar organización
export async function updateOrganization(
  id: number,
  data: Partial<Organizacion>
): Promise<Organizacion> {
  const response = await apiConfig.patch(`/organizaciones/${id}`, data);
  return OrganizacionSchema.parse(response.data);
}

// Estadísticas
export async function getOrganizationsStats() {
  const response = await apiConfig.get("/organizaciones/stats");
  return response.data;
}