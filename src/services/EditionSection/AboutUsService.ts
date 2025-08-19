import apiConfig from "../apiConfig";
import type { AboutUsType } from "../../models/editionSection/AboutUsEditionType";

// GET /aboutUs
export async function getAllAboutUs(): Promise<AboutUsType[]> {
  const { data } = await apiConfig.get<AboutUsType[]>("/aboutUs");
  return data;
}

// PATCH /aboutUs/:id  (body: { description })
export async function updateAboutUs(id: number, description: string): Promise<AboutUsType> {
  const { data } = await apiConfig.patch<AboutUsType>(`/aboutUs/${id}`, { description });
  return data;
}
