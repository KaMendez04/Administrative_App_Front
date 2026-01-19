import type { ApiList, CreateDepartmentDTO, CreatePIncomeDTO, CreatePIncomeSubTypeDTO, CreatePIncomeTypeDTO, Department, PIncome, PIncomeSubType, PIncomeType } from "../../models/Budget/incomeProjectionType";
import apiConfig from "../apiConfig";


export async function listDepartments(): Promise<Department[]> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return data; // ← devuelve el array, no { data }
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

export async function listPIncomes(pIncomeSubTypeId?: number) {
  const { data } = await apiConfig.get<any[]>("/p-income", {
    params: pIncomeSubTypeId ? { pIncomeSubTypeId } : undefined,
  });

  return data;
}


export async function createPIncomeSubType(payload: CreatePIncomeSubTypeDTO): Promise<PIncomeSubType> {
  const { data } = await apiConfig.post<any>("/p-income-sub-type", payload);
  return {
    id: data.id,
    name: data.name,
    pIncomeTypeId: data?.pIncomeType?.id ?? payload.pIncomeTypeId,
  };
}

export async function updateDepartment(id: number, payload: { name: string }): Promise<Department> {
  const { data } = await apiConfig.patch<Department>(`/department/${id}`, payload);
  return data;
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

export async function updatePIncomeType(
  id: number,
  payload: { name?: string; departmentId?: number }
): Promise<PIncomeType> {
  const { data } = await apiConfig.patch<any>(`/p-income-type/${id}`, payload);

  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? payload.departmentId,
  };
}


export async function updatePIncomeSubType(
  id: number,
  payload: { name?: string; pIncomeTypeId?: number }
): Promise<PIncomeSubType> {
  const { data } = await apiConfig.patch<any>(`/p-income-sub-type/${id}`, payload);

  return {
    id: data.id,
    name: data.name,
    pIncomeTypeId: data?.pIncomeType?.id ?? payload.pIncomeTypeId,
  };
}


export async function updatePIncome(
  id: number,
  payload: {
    amount?: number;
    pIncomeSubTypeId?: number;
  }
) {
  const body: any = {};

  if (payload.amount !== undefined) {
    body.amount = Number(payload.amount).toFixed(2);
  }
  if (payload.pIncomeSubTypeId !== undefined) {
    body.pIncomeSubTypeId = payload.pIncomeSubTypeId;
  }

  const { data } = await apiConfig.patch<any>(`/p-income/${id}`, body);

  return data;
}


export async function listIncomeTypes(departmentId?: number): Promise<ApiList<{id:number;name:string;departmentId?:number}>> {
  const { data } = await apiConfig.get<any[]>("/income-type");
  let items = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function listIncomeSubTypes(incomeTypeId: number): Promise<ApiList<{id:number;name:string;incomeTypeId:number}>> {
  const { data } = await apiConfig.get<any[]>("/income-sub-type", { params: { incomeTypeId } });
  const items = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    incomeTypeId: s?.incomeType?.id ?? incomeTypeId,
  }));
  return { data: items };
}

export async function ensureIncomeTypeFromProjection(pIncomeTypeId: number) {
  const { data } = await apiConfig.post<any>("/income-type/from-projection", { pIncomeTypeId });
  return data; // IncomeType real
}


export async function ensureIncomeSubTypeFromProjection(pIncomeSubTypeId: number) {
  const { data } = await apiConfig.post<any>("/income-sub-type/from-projection", { pIncomeSubTypeId });
  return data; // IncomeSubType real
}


