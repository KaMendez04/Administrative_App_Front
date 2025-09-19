import api from "../../apiConfig";

export type Dept = { id: number; name: string };
export type SpendType = { id: number; name: string; department?: Dept | { id: number } };
export type SpendSubType = { id: number; name: string; type?: SpendType | { id: number } };

const normalize = (s: string) =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();

function pickBest<T extends { name: string }>(items: T[], q: string): T | undefined {
  const nQ = normalize(q);
  if (!nQ) return undefined;
  let hit = items.find(i => normalize(i.name) === nQ);
  if (hit) return hit;
  hit = items.find(i => normalize(i.name).includes(nQ));
  return hit;
}

// Endpoints base (ajusta si tus rutas difieren)
export async function listDepartments(): Promise<Dept[]> {
  const { data } = await api.get<Dept[]>("/department");
  return data ?? [];
}
export async function listSpendTypes(departmentId?: number): Promise<SpendType[]> {
  const url = departmentId ? `/spend-type?departmentId=${departmentId}` : "/spend-type";
  const { data } = await api.get<SpendType[]>(url);
  return data ?? [];
}
export async function listSpendSubTypes(spendTypeId?: number): Promise<SpendSubType[]> {
  const url = spendTypeId ? `/spend-sub-type?typeId=${spendTypeId}` : "/spend-sub-type";
  const { data } = await api.get<SpendSubType[]>(url);
  return data ?? [];
}

export async function resolveDepartmentIdByName(name?: string): Promise<number | undefined> {
  if (!name) return undefined;
  const all = await listDepartments();
  return pickBest(all, name)?.id;
}

export async function resolveSpendTypeIdByName(
  name?: string,
  departmentId?: number
): Promise<number | undefined> {
  if (!name) return undefined;
  const all = await listSpendTypes(departmentId);
  return pickBest(all, name)?.id;
}

export async function resolveSpendSubTypeIdByName(
  name?: string,
  spendTypeId?: number
): Promise<number | undefined> {
  if (!name) return undefined;
  const all = await listSpendSubTypes(spendTypeId);
  return pickBest(all, name)?.id;
}
