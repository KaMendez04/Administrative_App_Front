import apiConfig from "../apiConfig";
import {
  SolicitudVoluntariadoSchema,
  SolicitudVoluntariadoListResponseSchema,
  type SolicitudVoluntariado,
  type SolicitudVoluntariadoListResponse,
  type VolunteerListParams,
  type CreateSolicitudVoluntariadoValues,
} from "../../schemas/volunteerSchemas";

// ✅ Crear solicitud de voluntariado
export async function createVolunteerSolicitud(
  data: CreateSolicitudVoluntariadoValues
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.post("/solicitudes-voluntariado", data);
  return SolicitudVoluntariadoSchema.parse(response.data);
}

// ✅ Listado de solicitudes (con paginación y filtros)
// ✅ Listado de solicitudes (con paginación y filtros)
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


  const response = await apiConfig.get("/solicitudes-voluntariado", {
    params: queryParams,
  });
  const parsed = SolicitudVoluntariadoListResponseSchema.safeParse(
    response.data
  );

  if (!parsed.success) {
    console.error("❌ Zod validation error:", parsed.error.format());
    throw new Error("Error al validar la respuesta del servidor");
  }

  return parsed.data;
}

// ✅ Obtener solicitud por ID
export async function getVolunteerSolicitud(
  id: number
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.get(`/solicitudes-voluntariado/${id}`);

  const parsed = SolicitudVoluntariadoSchema.safeParse(response.data);

  if (!parsed.success) {
    console.error("❌ Schema validation failed:", parsed.error);
    throw new Error("Error al validar la respuesta del servidor");
  }

  return parsed.data;
}

// ✅ Aprobar solicitud
export async function approveVolunteerSolicitud(
  id: number
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.patch(
    `/solicitudes-voluntariado/${id}/status`,
    {
      estado: "APROBADO",
    }
  );
  return SolicitudVoluntariadoSchema.parse(response.data);
}

// ✅ Rechazar solicitud
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
  return SolicitudVoluntariadoSchema.parse(response.data);
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