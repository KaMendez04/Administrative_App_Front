import type { AssignExtraordinaryDto } from "../../../models/Budget/extraordinary/AssignInterface";
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";
import type { Department } from "../../../models/Budget/IncomeType";
import apiConfig from "../../../apiConfig/apiConfig";

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

export async function fetchExtraExcel(filters: {
  start?: string;
  end?: string;
  name?: string;
}): Promise<Blob> {
  const { data } = await apiConfig.get<Blob>("/report-extra/download/excel", {
    params: filters,
    responseType: "blob" as const,
  });
  return data;
}

export function downloadExtraExcel(filters: {
  start?: string;
  end?: string;
  name?: string;
}) {
  fetchExtraExcel(filters).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-extraordinarios-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}