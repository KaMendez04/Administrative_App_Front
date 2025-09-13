import type { ApiList, CreateDepartmentDTO, CreateIncomeProjectionSubTypeDTO, CreateIncomeProjectionTypeDTO, Department, IncomeProjectionCreateDTO, IncomeProjectionSubType, IncomeProjectionType } from "../../models/Budget/incomeProjectionType";
import apiConfig from "../apiConfig";


// Departamentos
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<ApiList<Department>>("/department");
  return data;
}

export async function createDepartment(
  payload: CreateDepartmentDTO
): Promise<Department> {
  const { data } = await apiConfig.post<Department>("/department", payload);
  return data;
}

// IncomeProjectionType
export async function listIncomeProjectionTypes(
  departmentId?: number
): Promise<ApiList<IncomeProjectionType>> {
  const { data } = await apiConfig.get<ApiList<IncomeProjectionType>>(
    "/income-projection-types",
    { params: departmentId ? { departmentId } : undefined }
  );
  return data;
}

export async function createIncomeProjectionType(
  payload: CreateIncomeProjectionTypeDTO
): Promise<IncomeProjectionType> {
  const { data } = await apiConfig.post<IncomeProjectionType>(
    "/income-projection-types",
    payload
  );
  return data;
}

// IncomeProjectionSubType
export async function listIncomeProjectionSubTypes(
  incomeProjectionTypeId?: number
): Promise<ApiList<IncomeProjectionSubType>> {
  const { data } = await apiConfig.get<ApiList<IncomeProjectionSubType>>(
    "/income-projection-subtypes",
    { params: incomeProjectionTypeId ? { incomeProjectionTypeId } : undefined }
  );
  return data;
}

export async function createIncomeProjectionSubType(
  payload: CreateIncomeProjectionSubTypeDTO
): Promise<IncomeProjectionSubType> {
  const { data } = await apiConfig.post<IncomeProjectionSubType>(
    "/income-projection-subtypes",
    payload
  );
  return data;
}

// Projections
export async function createIncomeProjection(
  payload: IncomeProjectionCreateDTO
): Promise<IncomeProjectionCreateDTO & { id: number }> {
  const { data } = await apiConfig.post<
    IncomeProjectionCreateDTO & { id: number }
  >("/income-projections", payload);
  return data;
}
