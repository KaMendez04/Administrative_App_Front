

import apiConfig from "../../../../apiConfig/apiConfig";


export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
 
  return { data };
}

export async function createDepartment(payload: CreateDepartmentDTO): Promise<Department> {
  const { data } = await apiConfig.post<Department>("/department", payload);
  return data;
}


export async function listPIncomeTypes(departmentId?: number): Promise<ApiList<PIncomeType>> {
  const { data } = await apiConfig.get<any[]>("/p-income-type");
  // Map a nuestro modelo plano
  let items: PIncomeType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function createPIncomeType(payload: CreatePIncomeTypeDTO): Promise<PIncomeType> {
  const { data } = await apiConfig.post<any>("/p-income-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? payload.departmentId,
  };
}


export async function listPIncomeSubTypes(pIncomeTypeId: number): Promise<ApiList<PIncomeSubType>> {
  const { data } = await apiConfig.get<any[]>("/p-income-sub-type", {
    params: { pIncomeTypeId },
  });
  const items: PIncomeSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    pIncomeTypeId: s?.pIncomeType?.id ?? pIncomeTypeId,
  }));
  return { data: items };
}

export async function createPIncomeSubType(payload: CreatePIncomeSubTypeDTO): Promise<PIncomeSubType> {
  const { data } = await apiConfig.post<any>("/p-income-sub-type", payload);
  return {
    id: data.id,
    name: data.name,
    pIncomeTypeId: data?.pIncomeType?.id ?? payload.pIncomeTypeId,
  };
}


export async function createPIncome(payload: CreatePIncomeDTO): Promise<PIncome> {
  const body = {
    pIncomeSubTypeId: payload.pIncomeSubTypeId,
 
    amount: Number(payload.amount).toFixed(2)
  };

  const { data } = await apiConfig.post<any>("/p-income", body);

  return {
    id: data.id,
    amount: data.amount,
    pIncomeSubType: {
      id: data?.pIncomeSubType?.id ?? payload.pIncomeSubTypeId,
      name: data?.pIncomeSubType?.name ?? "",
      pIncomeTypeId: data?.pIncomeSubType?.pIncomeType?.id,
    },
  };
}
