import type {
  ApiList,
  CreateDepartmentDTO,
  CreateSpendDTO,
  CreateSpendSubTypeDTO,
  CreateSpendTypeDTO,
  Department,
  PSpendSubType,
  PSpendType,
  Spend,
  SpendSubType,
  SpendType,
} from "../../models/Budget/SpendType";

import apiConfig from "../apiConfig";

/** ============= Departamentos ============= */
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return { data };
}

export async function createDepartment(payload: CreateDepartmentDTO): Promise<Department> {
  const { data } = await apiConfig.post<Department>("/department", payload);
  return data;
}

/** ============= Spend Types (reales) ============= */
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

export async function createSpendType(payload: CreateSpendTypeDTO): Promise<SpendType> {
  const { data } = await apiConfig.post<any>("/spend-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? payload.departmentId,
  };
}

/** ============= Spend SubTypes (reales) ============= */
export async function listSpendSubTypes(spendTypeId: number): Promise<ApiList<SpendSubType>> {
  const { data } = await apiConfig.get<any[]>("/spend-sub-type", {
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
  const { data } = await apiConfig.post<any>("/spend-sub-type", payload);
  return {
    id: data.id,
    name: data.name,
    spendTypeId: data?.spendType?.id ?? payload.spendTypeId,
  };
}

/** ============= Movimientos reales (Egresos) ============= */
export async function createSpend(payload: CreateSpendDTO): Promise<Spend> {
  const body = {
    spendSubTypeId: payload.spendSubTypeId,
    amount: Number(payload.amount).toFixed(2),
    date: payload.date,
  };

  const { data } = await apiConfig.post<any>("/spend", body);

  return {
    id: data.id,
    amount: data.amount,
    date: data.date,
    spendSubType: {
      id: data?.spendSubType?.id ?? payload.spendSubTypeId,
      name: data?.spendSubType?.name ?? "",
      spendTypeId: data?.spendSubType?.spendType?.id,
    },
  };
}

/** ============= Proyección (pSpend) ============= */
export async function listPSpendTypes(
  departmentId: number,
  fiscalYearId?: number
): Promise<ApiList<PSpendType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-type", {
    params: { departmentId, fiscalYearId },
  });

  const items: PSpendType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id ?? departmentId,
  }));

  return { data: items };
}

export async function listPSpendSubTypes(params: {
  departmentId?: number;
  typeId: number; // pSpendTypeId
  fiscalYearId?: number;
}): Promise<ApiList<PSpendSubType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-sub-type", { params });

  const items: PSpendSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    typeId: s?.type?.id ?? params.typeId,
  }));

  return { data: items };
}

/** ============= Ensure real desde proyección ============= */
export async function ensureSpendTypeFromProjection(pSpendTypeId: number) {
  const { data } = await apiConfig.post("/spend-type/from-projection", { pSpendTypeId });
  return data; // SpendType real
}

export async function ensureSpendSubTypeFromProjection(pSpendSubTypeId: number) {
  const { data } = await apiConfig.post("/spend-sub-type/from-projection", { pSpendSubTypeId });
  return data; // SpendSubType real
}


/** ============= Update Departamento ============= */
export async function updateDepartment(
  id: number,
  payload: { name?: string }
): Promise<Department> {
  const { data } = await apiConfig.patch<Department>(`/department/${id}`, payload);
  return data;
}

/** ============= Update Spend Type ============= */
export async function updateSpendType(
  id: number,
  payload: { name?: string; departmentId?: number }
): Promise<SpendType> {
  const { data } = await apiConfig.patch<any>(`/spend-type/${id}`, payload);

  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? data?.departmentId ?? payload.departmentId,
  };
}

/** ============= Update Spend SubType ============= */
export async function updateSpendSubType(
  id: number,
  payload: { name?: string; spendTypeId?: number }
): Promise<SpendSubType> {
  const { data } = await apiConfig.patch<any>(`/spend-sub-type/${id}`, payload);

  return {
    id: data.id,
    name: data.name,
    spendTypeId: data?.spendType?.id ?? data?.spendTypeId ?? payload.spendTypeId!,
  };
}


export async function listSpend(): Promise<ApiList<Spend>> {
  const { data } = await apiConfig.get<any[]>("/spend");

  const items: Spend[] = (data ?? []).map((row) => ({
    id: row.id,
    amount: row.amount,
    date: row.date,
    spendSubType: {
      id: row?.spendSubType?.id,
      name: row?.spendSubType?.name ?? "",
      spendTypeId: row?.spendSubType?.spendType?.id,
    },
  }));

  return { data: items };
}

// ✅ Update egreso (editar monto / subtipo / fecha si quisieras)
export async function updateSpend(
  id: number,
  payload: { spendSubTypeId?: number; amount?: number; date?: string }
): Promise<Spend> {
  const body: any = {};
  if (payload.spendSubTypeId !== undefined) body.spendSubTypeId = payload.spendSubTypeId;
  if (payload.amount !== undefined) body.amount = Number(payload.amount).toFixed(2);
  if (payload.date !== undefined) body.date = payload.date;

  const { data } = await apiConfig.patch<any>(`/spend/${id}`, body);

  return {
    id: data.id,
    amount: data.amount,
    date: data.date,
    spendSubType: {
      id: data?.spendSubType?.id ?? body.spendSubTypeId,
      name: data?.spendSubType?.name ?? "",
      spendTypeId: data?.spendSubType?.spendType?.id,
    },
  };
}