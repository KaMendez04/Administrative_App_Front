import type { Department, IncomeSubType, IncomeType } from "../models/IncomeType";
import { listDepartments, listIncomeSubTypes, listIncomeTypes } from "../services/IncomeService";
import { useQuery } from "@tanstack/react-query";

// Mantiene el contrato: { data, loading, error }
function adaptQuery<T>(q: { data?: T; isPending: boolean; error: unknown }) {
  return {
    data: q.data as T | undefined,
    loading: q.isPending,
    error: (q.error as any)?.message ?? null,
  };
}

// Departamentos
export function useDepartments() {
  const q = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await listDepartments();
      return res.data as Department[];
    },
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<Department[]>(q);
}

// IncomeTypes (dependen de departamento)
export function useIncomeTypes(departmentId?: number) {
  const q = useQuery({
    queryKey: ["incomeTypes", departmentId ?? "none"],
    queryFn: async () => {
      if (!departmentId) return [] as IncomeType[];
      const res = await listIncomeTypes(departmentId);
      return res.data as IncomeType[];
    },
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<IncomeType[]>(q);
}

// IncomeSubTypes (dependen de type)
export function useIncomeSubTypes(incomeTypeId?: number) {
  const q = useQuery({
    queryKey: ["incomeSubTypes", incomeTypeId ?? "none"],
    queryFn: async () => {
      if (!incomeTypeId) return [] as IncomeSubType[];
      const res = await listIncomeSubTypes(incomeTypeId);
      return res.data as IncomeSubType[];
    },
    enabled: !!incomeTypeId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<IncomeSubType[]>(q);
}
