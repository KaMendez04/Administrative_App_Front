import { 
  SolicitudSchema, 
  SolicitudListResponseSchema, 
  type Solicitud, 
  type AdminListParams, 
  type SolicitudListResponse 
} from "../schemas/adminSolicitudes";
import apiConfig from "./apiConfig";

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
  
  console.log('📦 Raw response:', response.data);
  
  const parsed = SolicitudListResponseSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Zod validation error:', parsed.error.format());
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ Detalle completo (para modales - trae TODO)
export async function getSolicitud(id: number): Promise<Solicitud> {
  const response = await apiConfig.get(`/solicitudes/${id}`);
  
  console.log('📦 Response from /solicitudes/:id:', response.data);
  
  const parsed = SolicitudSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Schema validation failed:', parsed.error);
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ Aprobar solicitud
export async function approveSolicitud(id: number): Promise<any> {
  const response = await apiConfig.patch(`/solicitudes/${id}/estado`, { 
    estado: "APROBADO" 
  });
  return response.data; // ✅ Retorna respuesta simplificada del backend
}

// ✅ Rechazar solicitud
export async function rejectSolicitud(id: number, motivo: string): Promise<any> {
  const response = await apiConfig.patch(`/solicitudes/${id}/estado`, { 
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
  const response = await apiConfig.get(`/solicitudes/estado/${status}`);
  return response.data;
}