import type { AssignExtraordinaryDto } from "../models/AssignInterface";
import type { Extraordinary } from "../models/extraordinaryInterface";
import type { Department } from "../../income/models/IncomeType";
import apiConfig from "../../../../apiConfig/apiConfig";

export async function listExtraordinary(): Promise<Extraordinary[]> {
  const { data } = await apiConfig.get<Extraordinary[]>("/extraordinary");
  return data;
}

export async function createExtraordinary(
  body: Pick<Extraordinary, "name" | "amount" | "date">
): Promise<Extraordinary> {
  const { data } = await apiConfig.post<Extraordinary>("/extraordinary", body);
  return data;
}

export async function deleteExtraordinary(id: number): Promise<void> {
  await apiConfig.delete(`/extraordinary/${id}`);
}

export async function allocateExtraordinary(
  id: number,
  amount: number
): Promise<Extraordinary> {
  const { data } = await apiConfig.patch<Extraordinary>(
    `/extraordinary/${id}/allocate`,
    { amount }
  );
  return data;
}

export async function remainingExtraordinary(
  id: number
): Promise<{ id: number; remaining: number }> {
  const { data } = await apiConfig.get<{ id: number; remaining: number }>(
    `/extraordinary/${id}/remaining`
  );
  return data;
}

export async function fetchExtraordinary(): Promise<Extraordinary[]> {
  const { data } = await apiConfig.get<Extraordinary[]>("/extraordinary");
  return data;
}

export async function fetchDepartments(): Promise<Department[]> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return data;
}

export async function assignExtraordinary(dto: AssignExtraordinaryDto) {
  const { data } = await apiConfig.post("/extraordinary/assign-to-income", dto);
  return data;
}