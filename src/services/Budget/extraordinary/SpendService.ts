import type { SpendSubType, SpendType } from "../../../models/Budget/extraordinary/transactions";
import apiConfig from "../../../apiConfig/apiConfig";

export async function fetchSpendTypes(departmentId?: number): Promise<SpendType[]> {
    const url = departmentId ? `/spend-type?departmentId=${departmentId}` : "/spend-type";
    const { data } = await apiConfig.get<SpendType[]>(url);
    return departmentId ? (data ?? []).filter(t => t?.department?.id === departmentId) : (data ?? []);
  }
  
  export async function fetchSpendSubTypes(spendTypeId: number): Promise<SpendSubType[]> {
    const { data } = await apiConfig.get<SpendSubType[]>(`/spend-sub-type?spendTypeId=${spendTypeId}`);
    return data ?? [];
  }
  