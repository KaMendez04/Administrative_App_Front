
import type { ApiList, CreateDepartmentDTO, CreateSpendDTO, CreateSpendSubTypeDTO, CreateSpendTypeDTO, Department, Spend, SpendSubType, SpendType } from "../../models/Budget/spendProjectionType";
import apiConfig from "../apiConfig";


export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
 
  return { data };
}

export async function createDepartment(payload: CreateDepartmentDTO): Promise<Department> {
  const { data } = await apiConfig.post<Department>("/department", payload);
  return data;
}


export async function listSpendTypes(departmentId?: number): Promise<ApiList<SpendType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-type");
  // Map a nuestro modelo plano
  let items: SpendType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function createSpendType(payload: CreateSpendTypeDTO): Promise<SpendType> {
  const { data } = await apiConfig.post<any>("/p-spend-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? payload.departmentId,
  };
}


export async function listSpendSubTypes(spendTypeId: number): Promise<ApiList<SpendSubType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-sub-type", {
    params: { spendTypeId },
  });
  const items: SpendSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    spendTypeId: s?.spendType?.id ?? spendTypeId,
  }));
  return { data: items };
}

export async function createSpendSubType(payload: CreateSpendSubTypeDTO): Promise<SpendSubType> {
  const { data } = await apiConfig.post<any>("/p-spend-sub-type", payload);
  return {
    id: data.id,
    name: data.name,
    spendTypeId: data?.spendType?.id ?? payload.spendTypeId,
  };
}


export async function createSpend(payload: CreateSpendDTO): Promise<Spend> {
  const body = {
    spendSubTypeId: payload.spendSubTypeId,
 
    amount: Number(payload.amount).toFixed(2)
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
