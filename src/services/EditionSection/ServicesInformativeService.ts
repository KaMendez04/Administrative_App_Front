import apiConfig from "../../apiConfig/apiConfig";
import type {
  ServicesInformative,
  ServicesInformativeInput,
} from "../../models/editionSection/ServiceEditionType";

// GET /servicesInformative
export async function fetchServices(): Promise<ServicesInformative[]> {
  const { data } = await apiConfig.get<ServicesInformative[]>("/servicesInformative");
  return data;
}

// GET /servicesInformative/:id
export async function getService(id: number): Promise<ServicesInformative> {
  const { data } = await apiConfig.get<ServicesInformative>(`/servicesInformative/${id}`);
  return data;
}

// POST /servicesInformative
export async function createService(
  input: ServicesInformativeInput,
): Promise<ServicesInformative> {
  const { data } = await apiConfig.post<ServicesInformative>("/servicesInformative", input);
  return data;
}

// PUT /servicesInformative/:id
export async function updateService(
  id: number,
  input: ServicesInformativeInput,
) {

  const { data } = await apiConfig.put(`/servicesInformative/${id}`, input);
  return data;
}

// DELETE /servicesInformative/:id
export async function deleteService(id: number) {
  await apiConfig.delete(`/servicesInformative/${id}`);
}
