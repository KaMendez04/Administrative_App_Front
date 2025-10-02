import { AdminAssociateSchema, AdminListResponseSchema, type AdminAssociate, type AdminListParams, type AdminListResponse, type UpdateAssociateValues } from "../schemas/adminAssociates";
import apiConfig from "../../../apiConfig/apiConfig";

export async function listAssociates(params: AdminListParams): Promise<AdminListResponse> {
  const response = await apiConfig.get("/associates", { params });
  const data = response.data;
  const parsed = AdminListResponseSchema.safeParse(data);
  
  if (!parsed.success) {
    console.error("Error validando respuesta de listAssociates:", parsed.error);
    throw new Error("Respuesta inválida en listAssociates");
  }
  
  return parsed.data;
}

export async function getAssociate(id: number): Promise<AdminAssociate> {
  const response = await apiConfig.get(`/associates/${id}`);
  const data = response.data;
  const parsed = AdminAssociateSchema.safeParse(data);
  
  if (!parsed.success) {
    console.error("Error validando respuesta de getAssociate:", parsed.error);
    throw new Error("Respuesta inválida en getAssociate");
  }
  
  return parsed.data;
}

export async function approveAssociate(id: number): Promise<AdminAssociate> {
  const response = await apiConfig.patch(`/associates/${id}/approve`, {});
  const data = response.data;
  const parsed = AdminAssociateSchema.safeParse(data);
  
  if (!parsed.success) {
    console.error("Error validando respuesta de approveAssociate:", parsed.error);
    throw new Error("Respuesta inválida en approveAssociate");
  }
  
  return parsed.data;
}

export async function rejectAssociate(id: number, motivo: string): Promise<AdminAssociate> {
  const response = await apiConfig.patch(`/associates/${id}/reject`, { motivo });
  const data = response.data;
  const parsed = AdminAssociateSchema.safeParse(data);
  
  if (!parsed.success) {
    console.error("Error validando respuesta de rejectAssociate:", parsed.error);
    throw new Error("Respuesta inválida en rejectAssociate");
  }
  
  return parsed.data;
}

export async function updateAssociate(id: number, patch: UpdateAssociateValues): Promise<AdminAssociate> {
  const response = await apiConfig.patch(`/associates/${id}`, patch);
  const data = response.data;
  const parsed = AdminAssociateSchema.safeParse(data);
  
  if (!parsed.success) {
    console.error("Error validando respuesta de updateAssociate:", parsed.error);
    throw new Error("Respuesta inválida en updateAssociate");
  }
  
  return parsed.data;
}