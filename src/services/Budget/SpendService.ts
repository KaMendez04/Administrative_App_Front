import type {
  ApiList,
  CreateDepartmentDTO,
  CreateSpendDTO,
  CreateSpendSubTypeDTO,
  CreateSpendTypeDTO,
  Department,
  Spend,
  SpendSubType,
  SpendType,
} from "../../models/Budget/SpendType";

// 👇 Usa la MISMA ruta que en IncomeService:
import apiConfig from "../apiConfig"; 
// Si en tu repo real IncomeService usa "../../apiConfig", cambia esta línea a:
// import apiConfig from "../../apiConfig";

/** ============= Departamentos ============= */
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return { data };
}

export async function createDepartment(payload: CreateDepartmentDTO): Promise<Department> {
  const { data } = await apiConfig.post<Department>("/department", payload);
  return data;
}

/** ============= Spend Types ============= */
export async function listSpendTypes(departmentId?: number): Promise<ApiList<SpendType>> {
  const { data } = await apiConfig.get<any[]>("/spend-type");
  // Map a modelo plano { id, name, departmentId }
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

/** ============= Spend SubTypes ============= */
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
    amount: Number(payload.amount).toFixed(2), // igual que en ingresos
    date: payload.date,                         // 'YYYY-MM-DD'
  };

  const { data } = await apiConfig.post<any>("/spend", body);

  // Devolvemos con la misma forma que IncomeService
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
