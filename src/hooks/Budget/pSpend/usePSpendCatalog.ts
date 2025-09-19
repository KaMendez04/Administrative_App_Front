import { useQuery } from "@tanstack/react-query";
import type { Department, PSpendType, PSpendSubType } from "../../../models/Budget/PSpendType";
import { listDepartments, listPSpendTypes, listPSpendSubTypes } from "../../../services/Budget/projectionSpendService";

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
    queryFn: async () => (await listDepartments()).data as Department[],
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<Department[]>(q);
}

// Tipos (depende de departamento)
export function usePSpendTypes(departmentId?: number) {
  const q = useQuery({
    queryKey: ["pSpendTypes", departmentId ?? "none"],
    queryFn: async () => {
      if (!departmentId) return [] as PSpendType[];
      return (await listPSpendTypes(departmentId)).data as PSpendType[];
    },
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<PSpendType[]>(q);
}

// Subtipos (depende de tipo)
export function usePSpendSubTypes(pSpendTypeId?: number) {
  const q = useQuery({
    queryKey: ["pSpendSubTypes", pSpendTypeId ?? "none"],
    queryFn: async () => {
      if (!pSpendTypeId) return [] as PSpendSubType[];
      return (await listPSpendSubTypes(pSpendTypeId)).data as PSpendSubType[];
    },
    enabled: !!pSpendTypeId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<PSpendSubType[]>(q);
}
