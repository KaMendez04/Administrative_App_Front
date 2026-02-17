import {
  SolicitudSchema,
  SolicitudListResponseSchema,
  type Solicitud,
  type AdminListParams,
  type SolicitudListResponse
} from "../schemas/adminSolicitudes";
import apiConfig from "../apiConfig/apiConfig";

// ✅ Listado ligero (para tablas)
export async function listSolicitudes(params: AdminListParams): Promise<SolicitudListResponse> {
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };
  
  if (params.status) queryParams.estado = params.status;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;
  
  const response = await apiConfig.get("/solicitudes", { params: queryParams });
  
  const parsed = SolicitudListResponseSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Zod validation error:', parsed.error.format());
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ Detalle básico (ya no se usa para el modal)
export async function getSolicitud(id: number): Promise<Solicitud> {
  const response = await apiConfig.get(`/solicitudes/${id}`);
  
  const parsed = SolicitudSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Schema validation failed:', parsed.error);
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ NUEVO: Detalle COMPLETO (para el modal - con TODA la info)
export async function getSolicitudComplete(id: number): Promise<Solicitud> {
  const response = await apiConfig.get(`/solicitudes/${id}/complete`);
  
  console.log('📦 Complete solicitud response:', response.data);
  
  const parsed = SolicitudSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Schema validation failed:', parsed.error.format());
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ Aprobar solicitud
export async function approveSolicitud(id: number): Promise<any> {
  const response = await apiConfig.patch(`/solicitudes/${id}/status`, { 
    estado: "APROBADO" 
  });
  return response.data;
}

// ✅ Rechazar solicitud
export async function rejectSolicitud(id: number, motivo: string): Promise<any> {
  const response = await apiConfig.patch(`/solicitudes/${id}/status`, { 
    estado: "RECHAZADO",
    motivo
  });
  return response.data;
}

// ✅ Estadísticas
export async function getSolicitudesStats() {
  const response = await apiConfig.get('/solicitudes/stats');
  return response.data;
}

// ✅ Por estado
export async function getSolicitudesByStatus(status: string) {
  const response = await apiConfig.get(`/solicitudes/status/${status}`);
  return response.data;
}