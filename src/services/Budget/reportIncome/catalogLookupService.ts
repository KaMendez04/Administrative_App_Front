import api from "../../apiConfig";

// Helpers muy tolerantes: si name viene vacío => undefined
export async function resolveDepartmentIdByName(name?: string): Promise<number | undefined> {
  const q = (name ?? "").trim();
  if (!q) return undefined;

  // ⬇️ Tipamos el get para que data no sea "{}"
  const { data } = await api.get<any>("/department", { params: { q } });

  // Acepta varios formatos de payload: array directo, {items}, {data}
  const list: any[] = Array.isArray(data)
    ? data
    : (data as any)?.items ?? (data as any)?.data ?? [];

  const found = list.find((x: any) => String(x?.name ?? "").toLowerCase() === q.toLowerCase());
  return found?.id ?? undefined;
}

export async function resolveIncomeTypeIdByName(
  name?: string,
  departmentId?: number
): Promise<number | undefined> {
  const q = (name ?? "").trim();
  if (!q) return undefined;

  const { data } = await api.get<any>("/income-type", { params: { q, departmentId } });
  const list: any[] = Array.isArray(data)
    ? data
    : (data as any)?.items ?? (data as any)?.data ?? [];

  const found = list.find((x: any) => String(x?.name ?? "").toLowerCase() === q.toLowerCase());
  return found?.id ?? undefined;
}

export async function resolveIncomeSubTypeIdByName(
  name?: string,
  incomeTypeId?: number
): Promise<number | undefined> {
  const q = (name ?? "").trim();
  if (!q) return undefined;

  const { data } = await api.get<any>("/income-sub-type", { params: { q, incomeTypeId } });
  const list: any[] = Array.isArray(data)
    ? data
    : (data as any)?.items ?? (data as any)?.data ?? [];

  const found = list.find((x: any) => String(x?.name ?? "").toLowerCase() === q.toLowerCase());
  return found?.id ?? undefined;
}
