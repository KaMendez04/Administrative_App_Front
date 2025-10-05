import { 
  SolicitudSchema, 
  SolicitudListResponseSchema, 
  type Solicitud, 
  type AdminListParams, 
  type SolicitudListResponse 
} from "../schemas/adminSolicitudes";
import apiConfig from "./apiConfig";

export async function listSolicitudes(params: AdminListParams): Promise<SolicitudListResponse> {
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };

  if (params.status) queryParams.estado = params.status;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;

  const response = await apiConfig.get("/solicitudes", { params: queryParams });
  return SolicitudListResponseSchema.parse(response.data);
}

export async function getSolicitud(id: number): Promise<Solicitud> {
  const response = await apiConfig.get(`/solicitudes/${id}`);
  return SolicitudSchema.parse(response.data);
}

export async function approveSolicitud(id: number): Promise<Solicitud> {
  const response = await apiConfig.patch(`/solicitudes/${id}/status`, { 
    estado: "APROBADO" 
  });
  return SolicitudSchema.parse(response.data);
}

export async function rejectSolicitud(id: number, motivo: string): Promise<Solicitud> {
  const response = await apiConfig.patch(`/solicitudes/${id}/status`, { 
    estado: "RECHAZADO",
    motivo 
  });
  return SolicitudSchema.parse(response.data);
}