import type {
  ApiList,
  CreateDepartmentDTO,
  CreateIncomeDTO,
  CreateIncomeSubTypeDTO,
  CreateIncomeTypeDTO,
  Department,
  Income,
  IncomeSubType,
  IncomeType,
} from "../../models/Budget/IncomeType";

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

/** ============= Income Types ============= */
export async function listIncomeTypes(departmentId?: number): Promise<ApiList<IncomeType>> {
  const { data } = await apiConfig.get<any[]>("/income-type");
  // Map a modelo plano { id, name, departmentId }
  let items: IncomeType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id,
  }));
  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function createIncomeType(payload: CreateIncomeTypeDTO): Promise<IncomeType> {
  const { data } = await apiConfig.post<any>("/income-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? payload.departmentId,
  };
}

/** ============= Income SubTypes ============= */
export async function listIncomeSubTypes(incomeTypeId: number): Promise<ApiList<IncomeSubType>> {
  const { data } = await apiConfig.get<any[]>("/income-sub-type", {
    params: { incomeTypeId },
  });
  const items: IncomeSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    incomeTypeId: s?.incomeType?.id ?? incomeTypeId,
  }));
  return { data: items };
}

export async function createIncomeSubType(payload: CreateIncomeSubTypeDTO): Promise<IncomeSubType> {
  const { data } = await apiConfig.post<any>("/income-sub-type", payload);
  return {
    id: data.id,
    name: data.name,
    incomeTypeId: data?.incomeType?.id ?? payload.incomeTypeId,
  };
}

/** ============= Movimientos reales (Ingresos) ============= */
export async function createIncome(payload: CreateIncomeDTO): Promise<Income> {
  const body = {
    incomeSubTypeId: payload.incomeSubTypeId,
    amount: Number(payload.amount).toFixed(2), // igual que en ingresos
  };

  const { data } = await apiConfig.post<any>("/income", body);

  // Devolvemos con la misma forma que IncomeService
  return {
    id: data.id,
    amount: data.amount,
    incomeSubType: {
      id: data?.incomeSubType?.id ?? payload.incomeSubTypeId,
      name: data?.incomeSubType?.name ?? "",
      incomeTypeId: data?.incomeSubType?.incomeType?.id,
    },
  };
}
