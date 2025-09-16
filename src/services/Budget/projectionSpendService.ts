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
export async function listPSpendTypes(departmentId?: number): Promise<ApiList<PSpendType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-type");
  let items: PSpendType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function createPSpendType(payload: { name: string; departmentId: number }): Promise<PSpendType> {
  const { data } = await apiConfig.post<any>("/p-spend-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? payload.departmentId,
  };
}

/** ============= P-SubTypes ============= */
export async function listPSpendSubTypes(pSpendTypeId: number): Promise<ApiList<PSpendSubType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-sub-type", { params: { pSpendTypeId } });
  const items: PSpendSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    pSpendTypeId: s?.pSpendType?.id ?? pSpendTypeId,
  }));
  return { data: items };
}

export async function createPSpendSubType(payload: { name: string; pSpendTypeId: number }): Promise<PSpendSubType> {
  const { data } = await apiConfig.post<any>("/p-spend-sub-type", payload);
  return {
    id: data.id,
    name: data.name,
    pSpendTypeId: data?.pSpendType?.id ?? payload.pSpendTypeId,
  };
}

/** ============= Proyección (/p-spend) ============= */
export async function createPSpend(payload: CreatePSpendDTO): Promise<PSpend> {
  const body = {
    pSpendSubTypeId: payload.pSpendSubTypeId,
    amount: Number(payload.amount).toFixed(2),
    // fiscalYearId: payload.fiscalYearId,
  };
  const { data } = await apiConfig.post<any>("/p-spend", body);

  return {
    id: data.id,
    amount: data.amount,
    pSpendSubType: {
      id: data?.pSpendSubType?.id ?? payload.pSpendSubTypeId,
      name: data?.pSpendSubType?.name ?? "",
      pSpendTypeId: data?.pSpendSubType?.pSpendType?.id,
    },
  };
}
