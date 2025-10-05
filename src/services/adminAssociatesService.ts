import { 
    AssociateSchema, 
    AssociateListResponseSchema, 
    type Associate, 
    type AdminListParams, 
    type AssociateListResponse,
    type UpdateAssociateValues 
  } from "../schemas/adminSolicitudes";
  import apiConfig from "./apiConfig";
  
  export async function listAssociates(params: AdminListParams): Promise<AssociateListResponse> {
    const queryParams: any = {
      page: params.page,
      limit: params.limit,
      estado: true, // Solo activos
    };
  
    if (params.search) queryParams.search = params.search;
    if (params.sort) queryParams.sort = params.sort;
  
    const response = await apiConfig.get("/associates", { params: queryParams });
    
    // ✅ Log para debug - quítalo después
    console.log('Response from /associates:', response.data);
    
    // ✅ Parsea con el schema correcto
    const parsed = AssociateListResponseSchema.safeParse(response.data);
    
    if (!parsed.success) {
      console.error('Schema validation failed:', parsed.error);
      throw new Error('Error al validar la respuesta del servidor');
    }
    
    return parsed.data;
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