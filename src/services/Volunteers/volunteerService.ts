import apiConfig from "../../apiConfig/apiConfig";
import {
  type SolicitudVoluntariado,
  type SolicitudVoluntariadoListResponse,
  type VolunteerListParams,
  type CreateSolicitudVoluntariadoValues,
} from "../../schemas/volunteerSchemas";
import { downloadBlob } from "@/utils/pdf";

// ✅ Crear solicitud de voluntariado - SIN validación Zod
export async function createVolunteerSolicitud(
  data: CreateSolicitudVoluntariadoValues
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.post("/solicitud-voluntariado", data);
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
    const response = await apiConfig.get("/solicitud-voluntariado", {
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
    const response = await apiConfig.get(`/solicitud-voluntariado/${id}`);
    
    // ✅ Retornar directamente sin validación Zod
    return response.data as SolicitudVoluntariado;
  } catch (error) {
    console.error("Error en getVolunteerSolicitud:", error);
    throw error;
  }
}

// ✅ Aprobar solicitud - SIN validación Zod
export async function approveVolunteerSolicitud(
  id: number,
  motivo?:string
): Promise<SolicitudVoluntariado> {
  const response = await apiConfig.patch(
    `/solicitud-voluntariado/${id}/status`,
    {
      estado: "APROBADO",
      ...(motivo !== undefined ? { motivo } : {}),
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
    `/solicitud-voluntariado/${id}/status`,
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
  await apiConfig.delete(`/solicitud-voluntariado/${id}`);
}

// ✅ Estadísticas (opcional)
export async function getVolunteerSolicitudesStats() {
  const response = await apiConfig.get("/solicitud-voluntariado/stats");
  return response.data;
}

export const voluntariosPdfService = {
  async getListadoVoluntariosPdf(): Promise<Blob> {
    const res = await apiConfig.get("/solicitud-voluntariado/pdf-voluntarios", {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    return res.data as Blob;
  },

  async downloadListadoVoluntariosPdf(filename = "listado-voluntarios.pdf") {
    const blob = await this.getListadoVoluntariosPdf();
    downloadBlob(blob, filename);
  },

  async openListadoVoluntariosPdf() {
    const blob = await this.getListadoVoluntariosPdf();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    // opcional: revocar después (por si el navegador tarda en cargar)
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
  },
};

export const solicitudesVoluntariadoPdfService = {
  async getSolicitudesPdf(): Promise<Blob> {
    const res = await apiConfig.get("/solicitud-voluntariado/pdf-solicitudes", {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    });

    return res.data as Blob;
  },

  async downloadSolicitudesPdf(filename = "solicitudes-de-voluntarios.pdf") {
    const blob = await this.getSolicitudesPdf();
    downloadBlob(blob, filename);
  },

  async openSolicitudesPdf() {
    const blob = await this.getSolicitudesPdf();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
  },
};

export const voluntarioDetallePdfService = {
  async getDetallePdf(idSolicitud: number): Promise<Blob> {
    const res = await apiConfig.get(`/solicitud-voluntariado/${idSolicitud}/pdf`, {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    });
    return res.data as Blob;
  },

  async downloadDetallePdf(idSolicitud: number, filename = `solicitud-${idSolicitud}.pdf`) {
    const blob = await this.getDetallePdf(idSolicitud);
    downloadBlob(blob, filename);
  },

  async openDetallePdf(idSolicitud: number) {
    const blob = await this.getDetallePdf(idSolicitud);
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
  },
};