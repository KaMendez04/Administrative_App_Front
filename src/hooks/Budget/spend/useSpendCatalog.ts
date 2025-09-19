import type { Department, SpendSubType, SpendType } from "../../../models/Budget/SpendType";
import { listDepartments, listSpendSubTypes, listSpendTypes } from "../../../services/Budget/SpendService";
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

// SpendTypes (dependen de departamento)
export function useSpendTypes(departmentId?: number) {
  const q = useQuery({
    queryKey: ["spendTypes", departmentId ?? "none"],
    queryFn: async () => {
      if (!departmentId) return [] as SpendType[];
      const res = await listSpendTypes(departmentId);
      return res.data as SpendType[];
    },
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<SpendType[]>(q);
}

// SpendSubTypes (dependen de type)
export function useSpendSubTypes(spendTypeId?: number) {
  const q = useQuery({
    queryKey: ["spendSubTypes", spendTypeId ?? "none"],
    queryFn: async () => {
      if (!spendTypeId) return [] as SpendSubType[];
      const res = await listSpendSubTypes(spendTypeId);
      return res.data as SpendSubType[];
    },
    enabled: !!spendTypeId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<SpendSubType[]>(q);
}
