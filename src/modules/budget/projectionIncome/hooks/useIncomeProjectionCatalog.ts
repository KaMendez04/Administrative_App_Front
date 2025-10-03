import { useQuery } from "@tanstack/react-query";
import { listDepartments, listPIncomeSubTypes, listPIncomeTypes } from "../services/projectionIncomeService";
import type { Department, PIncomeSubType, PIncomeType } from "../models/incomeProjectionType";

// Adaptador para mantener tu shape { data, loading, error }
function adaptQuery<T>(q: {
  data?: T;
  isPending: boolean;
  error: unknown;
}) {
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
    staleTime: 5 * 60 * 1000, // cachea un rato
  });
  return adaptQuery<Department[]>(q);
}

// IncomeTypes (dependen de departamento)
export function usePIncomeTypes(departmentId?: number) {
  const q = useQuery({
    queryKey: ["pIncomeTypes", departmentId ?? "none"],
    queryFn: async () => {
      if (!departmentId) return [] as PIncomeType[];
      const res = await listPIncomeTypes(departmentId);
      return res.data as PIncomeType[];
    },
    enabled: !!departmentId, // no dispara sin departamento
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<PIncomeType[]>(q);
}

// IncomeSubTypes (dependen de type)
export function usePIncomeSubTypes(pIncomeTypeId?: number) {
  const q = useQuery({
    queryKey: ["pIncomeSubTypes", pIncomeTypeId ?? "none"],
    queryFn: async () => {
      if (!pIncomeTypeId) return [] as PIncomeSubType[];
      const res = await listPIncomeSubTypes(pIncomeTypeId);
      return res.data as PIncomeSubType[];
    },
    enabled: !!pIncomeTypeId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<PIncomeSubType[]>(q);
}
