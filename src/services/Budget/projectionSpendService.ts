import type {
  ApiList,
  Department,
  PSpend,
  PSpendSubType,
  PSpendType,
  CreatePSpendDTO,
} from "../../models/Budget/PSpendType";
import apiConfig from "../apiConfig";

/** ============= Departamentos ============= */
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return { data };
}

/** ============= P-Types ============= */
export async function listPSpendTypes(
  departmentId?: number
): Promise<ApiList<PSpendType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-type", {
    params: departmentId ? { departmentId, _ts: Date.now() } : { _ts: Date.now() },
    headers: { "Cache-Control": "no-cache" },
  });

  let items: PSpendType[] = (data ?? []).map((t) => ({
    id: Number(t.id),
    name: t.name,
    departmentId: Number(
      t?.department?.id ?? t?.departmentId ?? departmentId
    ),
  }));

  if (departmentId != null) {
    const dep = Number(departmentId);
    items = items.filter((t) => t.departmentId === dep);
  }

  return { data: items };
}

export async function createPSpendType(payload: {
  name: string;
  departmentId: number;
}): Promise<PSpendType> {
  const body = {
    name: payload.name,
    departmentId: payload.departmentId,
  };
  const { data } = await apiConfig.post<any>("/p-spend-type", body);
  return {
    id: Number(data.id),
    name: data.name,
    departmentId: Number(
      data?.department?.id ?? data?.departmentId ?? payload.departmentId
    ),
  };
}

/** ============= P-SubTypes ============= */
export async function listPSpendSubTypes(
  pSpendTypeId: number
): Promise<ApiList<PSpendSubType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-sub-type", {
    params: { pSpendTypeId, spendTypeId: pSpendTypeId, _ts: Date.now() },
    headers: { "Cache-Control": "no-cache" },
  });

  const items: PSpendSubType[] = (data ?? []).map((s) => ({
    id: Number(s.id),
    name: s.name,
    pSpendTypeId: Number(
      s?.pSpendType?.id ?? s?.spendType?.id ?? pSpendTypeId
    ),
  }));

  return { data: items };
}

export async function createPSpendSubType(payload: {
  name: string;
  pSpendTypeId: number;
}): Promise<PSpendSubType> {

  const body = {
    name: payload.name,
    pSpendTypeId: payload.pSpendTypeId,
    spendTypeId: payload.pSpendTypeId,
  };
  const { data } = await apiConfig.post<any>("/p-spend-sub-type", body);
  return {
    id: Number(data.id),
    name: data.name,
    pSpendTypeId: Number(
      data?.pSpendSubType?.pSpendType?.id ??
        data?.pSpendType?.id ??
        payload.pSpendTypeId
    ),
  };
}

/** ============= Crear Proyección ============= */
export async function createPSpend(payload: CreatePSpendDTO): Promise<PSpend> {
  const body = {
    pSpendSubTypeId: payload.pSpendSubTypeId,
    amount: Number(payload.amount).toFixed(2),
  };
  const { data } = await apiConfig.post<any>("/p-spend", body);

  return {
    id: Number(data.id),
    amount: data.amount,
    pSpendSubType: {
      id: Number(data?.pSpendSubType?.id ?? payload.pSpendSubTypeId),
      name: data?.pSpendSubType?.name ?? "",
      pSpendTypeId: Number(data?.pSpendSubType?.pSpendType?.id),
    },
  };
}
