import { 
    AssociateSchema, 
    AssociateListResponseSchema, 
    type Associate, 
    type AssociateListResponse,
    type UpdateAssociateValues, 
    type AssociateListParams
  } from "../schemas/adminSolicitudes";
  import apiConfig from "./apiConfig";
  
 
export async function listAssociates(params: AssociateListParams): Promise<AssociateListResponse> {
  const queryParams: any = {
    page: params.page,
    limit: params.limit,
  };

  // ✅ Enviar estado como boolean
  if (params.estado !== undefined) queryParams.estado = params.estado;
  if (params.search) queryParams.search = params.search;
  if (params.sort) queryParams.sort = params.sort;

  const response = await apiConfig.get("/associates", { params: queryParams });
  return AssociateListResponseSchema.parse(response.data);
}
  
  export async function getAssociate(id: number): Promise<Associate> {
    const response = await apiConfig.get(`/associates/${id}`);
    
    console.log('Response from /associates/:id:', response.data);
    
    const parsed = AssociateSchema.safeParse(response.data);
    
    if (!parsed.success) {
      console.error('Schema validation failed:', parsed.error);
      throw new Error('Error al validar la respuesta del servidor');
    }
    
    return parsed.data;
  }
  
  export async function updateAssociate(id: number, patch: UpdateAssociateValues): Promise<Associate> {
    const response = await apiConfig.patch(`/associates/${id}`, patch);
    return AssociateSchema.parse(response.data);
  }