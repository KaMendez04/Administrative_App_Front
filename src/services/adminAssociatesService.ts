import { AdminAssociateSchema, AdminListResponseSchema, type AdminAssociate, type AdminListParams, type AdminListResponse, type UpdateAssociateValues } from "../schemas/adminAssociates";
import apiConfig from "./apiConfig";

export async function listAssociates(params: AdminListParams): Promise<AdminListResponse> {
  const { data } = await apiConfig.get("/associates", { params });
  const parsed = AdminListResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error("Respuesta inválida en listAssociates");
  return parsed.data;
}

export async function getAssociate(id: number): Promise<AdminAssociate> {
  const { data } = await apiConfig.get(`/associates/${id}`);
  const parsed = AdminAssociateSchema.safeParse(data);
  if (!parsed.success) throw new Error("Respuesta inválida en getAssociate");
  return parsed.data;
}

export async function approveAssociate(id: number): Promise<AdminAssociate> {
  const { data } = await apiConfig.patch(`/associates/${id}/approve`, {});
  const parsed = AdminAssociateSchema.safeParse(data);
  if (!parsed.success) throw new Error("Respuesta inválida en approveAssociate");
  return parsed.data;
}

export async function rejectAssociate(id: number, motivo: string): Promise<AdminAssociate> {
  const { data } = await apiConfig.patch(`/associates/${id}/reject`, { motivo });
  const parsed = AdminAssociateSchema.safeParse(data);
  if (!parsed.success) throw new Error("Respuesta inválida en rejectAssociate");
  return parsed.data;
}

export async function updateAssociate(id: number, patch: UpdateAssociateValues): Promise<AdminAssociate> {
  const { data } = await apiConfig.patch(`/associates/${id}`, patch);
  const parsed = AdminAssociateSchema.safeParse(data);
  if (!parsed.success) throw new Error("Respuesta inválida en updateAssociate");
  return parsed.data;
}
