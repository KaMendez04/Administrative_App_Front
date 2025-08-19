import apiConfig from "./apiConfig";
import type { PersonalPageType } from "../models/PersonalPageType";

//const RESOURCE = "/personal"; esto lo quite para evitaar enrredos

export const personalApi = {
  // GET /personal
  async list(): Promise<PersonalPageType[]> {
    const { data } = await apiConfig.get<PersonalPageType[]>("/personal");
    return data;
  },

  // POST /personal
  async create(payload: Omit<PersonalPageType, "id">): Promise<PersonalPageType> {
    const { data } = await apiConfig.post<PersonalPageType>("/personal", payload);
    return data;
  },

  // PUT /personal/:id
  async update(id: number, payload: Partial<PersonalPageType>): Promise<PersonalPageType> {
    const { data } = await apiConfig.put<PersonalPageType>(`${"/personal"}/${id}`, payload);
    return data;
  },

  // DELETE /personal/:id
  async remove(id: number): Promise<void> {
    await apiConfig.delete(`${"/personal"}/${id}`);
  },
};
