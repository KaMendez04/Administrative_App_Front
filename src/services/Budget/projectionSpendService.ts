import type {
  ApiList,
  Department,
  SpendType,
  SpendSubType,
  PSpend,
  CreatePSpendDTO,
} from "../../models/Budget/PSpendType";
import apiConfig from "../apiConfig";

/** ============= Departamentos ============= */
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return { data };
}

/** ============= Spend Types (catálogo compartido) ============= */
export async function listSpendTypes(departmentId?: number): Promise<ApiList<SpendType>> {
  const { data } = await apiConfig.get<any[]>("/spend-type");
  let items: SpendType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

/** ============= Spend SubTypes (catálogo compartido) ============= */
export async function listSpendSubTypes(spendTypeId: number): Promise<ApiList<SpendSubType>> {
  const { data } = await apiConfig.get<any[]>("/spend-sub-type", { params: { spendTypeId } });
  const items: SpendSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    spendTypeId: s?.spendType?.id ?? spendTypeId,
  }));
  return { data: items };
}

/** ============= Proyección de Egresos (/p-spend) ============= */
export async function createPSpend(payload: CreatePSpendDTO): Promise<PSpend> {
  const body: any = {
    spendSubTypeId: payload.spendSubTypeId,
    amount: Number(payload.amount).toFixed(2),
    // fiscalYearId: payload.fiscalYearId, // <- descomenta si tu back lo requiere
  };
  const { data } = await apiConfig.post<any>("/p-spend", body);

  return {
    id: data.id,
    amount: data.amount,
    spendSubType: {
      id: data?.spendSubType?.id ?? payload.spendSubTypeId,
      name: data?.spendSubType?.name ?? "",
      spendTypeId: data?.spendSubType?.spendType?.id,
    },
  };
}
