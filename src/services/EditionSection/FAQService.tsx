import apiConfig from "../apiConfig";
import type { FAQEdition } from "../../models/editionSection/FAQEditionType";

// GET /faq
export async function fetchFaqs(): Promise<FAQEdition[]> {
  const { data } = await apiConfig.get<FAQEdition[]>("/faq");
  return data;
}

// POST /faq
export async function createFaq(faq: Omit<FAQEdition, "id">) {
  const { data } = await apiConfig.post("/faq", faq);
  return data;
}

// PUT /faq/:id
export async function updateFaq(id: number, faq: Omit<FAQEdition, "id">) {
  const { data } = await apiConfig.put(`/faq/${id}`, faq);
  return data;
}

// DELETE /faq/:id
export async function deleteFaq(id: number) {
  const { data } = await apiConfig.delete(`/faq/${id}`);
  return data; 
}
