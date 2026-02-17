import type {
  ApiList,
  Department,
  PSpend,
  PSpendSubType,
  PSpendType,
  CreatePSpendDTO,
} from "../../models/Budget/PSpendType";
import apiConfig from "../../apiConfig/apiConfig";

/** ============= Departamentos ============= */
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return { data };
}

/** ============= P-Types (proyección) ============= */
export async function listPSpendTypes(
  departmentId?: number
): Promise<ApiList<PSpendType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-type", {
    params: departmentId ? { departmentId } : undefined,
  });

  let items: PSpendType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id ?? t?.departmentId ?? departmentId,
  }));

  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function createPSpendType(payload: {
  name: string;
  departmentId: number;
}): Promise<PSpendType> {
  const { data } = await apiConfig.post<any>("/p-spend-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? data?.departmentId ?? payload.departmentId,
  };
}

export async function updatePSpendType(
  id: number,
  payload: { name?: string; departmentId?: number }
): Promise<PSpendType> {
  const { data } = await apiConfig.patch<any>(`/p-spend-type/${id}`, payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? data?.departmentId ?? payload.departmentId,
  };
}

/** ============= P-SubTypes (proyección) ============= */
export async function listPSpendSubTypes(
  pSpendTypeId: number
): Promise<ApiList<PSpendSubType>> {
  // El back espera `typeId`
  const { data } = await apiConfig.get<any[]>("/p-spend-sub-type", {
    params: { typeId: pSpendTypeId },
  });

  const items: PSpendSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    // la relación llega como `type`
    pSpendTypeId: s?.type?.id ?? pSpendTypeId,
  }));

  // Defensa extra por si el back devolviera más de un tipo
  const filtered = items.filter((s) => s.pSpendTypeId === pSpendTypeId);

  return { data: filtered };
}

export async function createPSpendSubType(payload: {
  name: string;
  pSpendTypeId: number;
}): Promise<PSpendSubType> {
  // El back recibe `typeId`
  const { data } = await apiConfig.post<any>("/p-spend-sub-type", {
    name: payload.name,
    typeId: payload.pSpendTypeId,
  });

  return {
    id: data.id,
    name: data.name,
    pSpendTypeId: data?.type?.id ?? payload.pSpendTypeId,
  };
}

export async function updatePSpendSubType(
  id: number,
  payload: { name?: string; typeId?: number }
): Promise<PSpendSubType> {
  const { data } = await apiConfig.patch<any>(`/p-spend-sub-type/${id}`, payload);

  return {
    id: data.id,
    name: data.name,
    // el back responde con `type`
    pSpendTypeId: data?.type?.id ?? payload.typeId!,
  };
}

/** ============= Crear Proyección de Egreso ============= */
export async function createPSpend(payload: CreatePSpendDTO): Promise<PSpend> {
  const body = {
    // 👇 nombre que espera el backend
    subTypeId: payload.pSpendSubTypeId,
    // 👇 envía número (evita toFixed que lo convierte a string)
    amount: Number(payload.amount),
  };

  const { data } = await apiConfig.post<any>("/p-spend", body);

  return {
    id: data.id,
    amount: data.amount,
    // el backend responde con `subType`, no `pSpendSubType`
    pSpendSubType: {
      id: data?.subType?.id ?? payload.pSpendSubTypeId,
      name: data?.subType?.name ?? "",
      pSpendTypeId: data?.subType?.type?.id,
    },
  };
}


export async function listPSpends(subTypeId?: number) {
  const { data } = await apiConfig.get<any[]>("/p-spend", {
    params: subTypeId ? { subTypeId } : undefined,
  });
  return data;
}

export async function updatePSpend(
  id: number,
  payload: { amount?: number; subTypeId?: number; date?: string }
) {
  const body: any = {}

  if (payload.amount !== undefined) body.amount = Number(payload.amount)
  if (payload.subTypeId !== undefined) body.subTypeId = payload.subTypeId
  if (payload.date !== undefined) body.date = payload.date

  const { data } = await apiConfig.patch<any>(`/p-spend/${id}`, body)
  return data
}
