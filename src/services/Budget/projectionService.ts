import type { BackendCategoryRow, Projection } from "../../models/Budget/projectionType";
import apiConfig from "../apiConfig";

const toDecimalString = (n: number) => (Math.round(n * 100) / 100).toFixed(2);


export async function getOrCreateProjectionByYear(year: number): Promise<Projection> {
  const { data: list } = await apiConfig.get<Projection[]>("/projection");

  const found = list.find((p) => Number(p.year) === Number(year));
  if (found) return found;

  const { data: created } = await apiConfig.post<Projection>("/projection", { year });
  return created;
}

// PATCH /projection/:id  -> actualiza total_amount
export async function patchProjectionTotal(
  id: number,
  totalAmount: number
): Promise<Projection> {
  const { data } = await apiConfig.patch<Projection>(`/projection/${id}`, {
    total_amount: toDecimalString(totalAmount),
  });
  return data;
}

// GET /category?projectionId=... -> categorías con (opcional) category_amount
export async function getCategoriesForProjection(
  projectionId: number
): Promise<BackendCategoryRow[]> {
  const { data } = await apiConfig.get<BackendCategoryRow[]>(
    `/category`,
    { params: { projectionId } }
  );
  return data;
}

// PATCH /projection/:projectionId/category/:categoryId/amount -> asigna/actualiza monto
export async function patchCategoryAmount(
  projectionId: number,
  categoryId: number,
  amount: number
) {
  const { data } = await apiConfig.patch(
    `/projection/${projectionId}/category/${categoryId}/amount`,
    { amount: toDecimalString(amount) }
  );
  return data;
}

