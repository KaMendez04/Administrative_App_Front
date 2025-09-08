import type { Category, CategoryPayload } from "../../../models/Categories/categories";
import apiConfig from "../../apiConfig";


// GET /category
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiConfig.get<Category[]>("/category");
  return data;
}

// GET /category/:id
export async function fetchCategoryById(id: number | string): Promise<Category> {
  const { data } = await apiConfig.get<Category>(`/category/${id}`);
  return data;
}

// POST /category
export async function createCategory(input: CategoryPayload): Promise<Category> {
  const { data } = await apiConfig.post<Category>("/category", input);
  return data;
}

// PUT /category/:id
export async function updateCategory(id: number | string, input: CategoryPayload): Promise<Category> {
  const { data } = await apiConfig.put<Category>(`/category/${id}`, input);
  return data;
}

// DELETE /category/:id
export async function removeCategory(id: number | string): Promise<void> {
  await apiConfig.delete(`/category/${id}`);
}
