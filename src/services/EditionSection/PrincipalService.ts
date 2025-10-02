import apiConfig from "../../apiConfig/apiConfig";
import type {
  PrincipalEdition,
  PrincipalUpdate,
} from "../../models/editionSection/PrincipalEditionType";

// GET /principal 
export async function fetchSinglePrincipal(): Promise<PrincipalEdition | null> {
  const { data } = await apiConfig.get<PrincipalEdition[]>("/principal");
  return data.length ? data[0] : null;
}

// PUT /principal/:id 
export async function updatePrincipal(id: number, input: PrincipalUpdate) {
  const { data } = await apiConfig.put(`/principal/${id}`, input);
  return data;
}

export async function createPrincipal(input: PrincipalUpdate) {
  const { data } = await apiConfig.post(`/principal`, input);
  return data;
}
