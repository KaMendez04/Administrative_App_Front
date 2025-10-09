import {
  AssociateSchema,
  AssociateListResponseSchema,
  type Associate,
  type AssociateListResponse,
  type UpdateAssociateValues,
  type AssociateListParams
} from "../schemas/adminSolicitudes";
import apiConfig from "./apiConfig";

// ✅ Listado ligero (para tablas)
export async function listAssociates(params: AssociateListParams): Promise<AssociateListResponse> {
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };
  
  if (params.estado !== undefined) queryParams.estado = params.estado;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;
  
  const response = await apiConfig.get("/associates", { params: queryParams });
  return AssociateListResponseSchema.parse(response.data);
}

// ✅ NUEVO: Detalle BÁSICO (sin cargar TODA la info de fincas - para lazy loading)
export async function getAssociateBasic(id: number): Promise<Associate> {
  const response = await apiConfig.get(`/associates/${id}/basic`);
  
  console.log('📦 Basic associate response:', response.data);
  
  const parsed = AssociateSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Schema validation failed:', parsed.error.format());
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ Detalle completo (mantener para otros usos si es necesario)
export async function getAssociate(id: number): Promise<Associate> {
  const response = await apiConfig.get(`/associates/${id}`);
  
  console.log('📦 Response from /associates/:id:', response.data);
  
  const parsed = AssociateSchema.safeParse(response.data);
  
  if (!parsed.success) {
    console.error('❌ Schema validation failed:', parsed.error);
    throw new Error('Error al validar la respuesta del servidor');
  }
  
  return parsed.data;
}

// ✅ Buscar por cédula (completo)
export async function getAssociateByCedula(cedula: string): Promise<Associate> {
  const response = await apiConfig.get(`/associates/cedula/${cedula}`);
  return AssociateSchema.parse(response.data);
}

// ✅ Actualizar asociado
export async function updateAssociate(id: number, patch: UpdateAssociateValues): Promise<Associate> {
  const response = await apiConfig.patch(`/associates/${id}`, patch);
  return AssociateSchema.parse(response.data);
}

// ✅ Activar asociado
export async function activateAssociate(id: number): Promise<Associate> {
  const response = await apiConfig.patch(`/associates/${id}/activate`);
  return AssociateSchema.parse(response.data);
}

// ✅ Desactivar asociado
export async function deactivateAssociate(id: number): Promise<Associate> {
  const response = await apiConfig.patch(`/associates/${id}/deactivate`);
  return AssociateSchema.parse(response.data);
}

// ✅ Toggle estado
export async function toggleAssociateStatus(id: number): Promise<Associate> {
  const response = await apiConfig.patch(`/associates/${id}/toggle`);
  return AssociateSchema.parse(response.data);
}

// ✅ Estadísticas
export async function getAssociatesStats() {
  const response = await apiConfig.get('/associates/stats');
  return response.data;
}