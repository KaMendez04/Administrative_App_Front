import apiConfig from "../apiConfig";
import {
  type SolicitudVoluntariado,
  type SolicitudVoluntariadoListResponse,
  type VolunteerListParams,
  type CreateSolicitudVoluntariadoValues,
} from "../../schemas/volunteerSchemas";

// ✅ Crear solicitud de voluntariado - SIN validación Zod
export async function createVolunteerSolicitud(
  data: CreateSolicitudVoluntariadoValues
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.post("/solicitudes-voluntariado", data);
  // ✅ Retornar sin validar para consistencia
  return response.data as SolicitudVoluntariado;
}

// ✅ Listar solicitudes - SIN validación Zod para evitar errores
export async function listVolunteerSolicitudes(
  params: VolunteerListParams
): Promise<SolicitudVoluntariadoListResponse> {
  
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };

  if (params.estado) queryParams.estado = params.estado;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;

  try {
    const response = await apiConfig.get("/solicitudes-voluntariado", {
      params: queryParams,
    });
    
    // ✅ Retornar directamente sin validación Zod
    return response.data as SolicitudVoluntariadoListResponse;
  } catch (error) {
    console.error("Error en listVolunteerSolicitudes:", error);
    throw error;
  }
}

// ✅ Obtener solicitud por ID - SIN validación Zod
export async function getVolunteerSolicitud(
  id: number
): Promise<SolicitudVoluntariado> {
  try {
    const response = await apiConfig.get(`/solicitudes-voluntariado/${id}`);
    
    // ✅ Retornar directamente sin validación Zod
    return response.data as SolicitudVoluntariado;
  } catch (error) {
    console.error("Error en getVolunteerSolicitud:", error);
    throw error;
  }
}

// ✅ Aprobar solicitud - SIN validación Zod
export async function approveVolunteerSolicitud(
  id: number
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.patch(
    `/solicitudes-voluntariado/${id}/status`,
    {
      estado: "APROBADO",
    }
  );
  // ✅ Retornar sin validar
  return response.data as SolicitudVoluntariado;
}

// ✅ Rechazar solicitud - SIN validación Zod
export async function rejectVolunteerSolicitud(
  id: number,
  motivo: string
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.patch(
    `/solicitudes-voluntariado/${id}/status`,
    {
      estado: "RECHAZADO",
      motivo,
    }
  );
  // ✅ Retornar sin validar
  return response.data as SolicitudVoluntariado;
}

// ✅ Eliminar solicitud
export async function deleteVolunteerSolicitud(id: number): Promise<void> {
  await apiConfig.delete(`/solicitudes-voluntariado/${id}`);
}

// ✅ Estadísticas (opcional)
export async function getVolunteerSolicitudesStats() {
  const response = await apiConfig.get("/solicitudes-voluntariado/stats");
  return response.data;
}