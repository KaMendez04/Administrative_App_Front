import { useQuery } from "@tanstack/react-query";

import type {
  Department,
  SpendSubType,
  SpendType,
  PSpendSubType,
  PSpendType,
} from "../../../models/Budget/SpendType";

import {
  listDepartments,
  listSpendSubTypes,
  listSpendTypes,
  listPSpendSubTypes,
  listPSpendTypes,
} from "../../../services/Budget/SpendService";

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
    queryFn: async () => (await listDepartments()).data as Department[],
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
      return (await listSpendTypes(departmentId)).data as SpendType[];
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
      return (await listSpendSubTypes(spendTypeId)).data as SpendSubType[];
    },
    enabled: !!spendTypeId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<SpendSubType[]>(q);
}

// ===== Proyección =====

export function usePSpendTypes(departmentId?: number, fiscalYearId?: number) {
  const q = useQuery({
    queryKey: ["pSpendTypes", departmentId ?? "none", fiscalYearId ?? "none"],
    queryFn: async () => {
      if (!departmentId) return [] as PSpendType[];
      return (await listPSpendTypes(departmentId, fiscalYearId)).data as PSpendType[];
    },
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
  return adaptQuery<PSpendType[]>(q);
}

export function usePSpendSubTypes(args?: { departmentId?: number; typeId?: number; fiscalYearId?: number }) {
  const typeId = args?.typeId;

  const q = useQuery({
    queryKey: ["pSpendSubTypes", typeId ?? "none", args?.departmentId ?? "none", args?.fiscalYearId ?? "none"],
    queryFn: async () => {
      if (!typeId) return [] as PSpendSubType[];
      return (
        await listPSpendSubTypes({
          departmentId: args?.departmentId,
          typeId,
          fiscalYearId: args?.fiscalYearId,
        })
      ).data as PSpendSubType[];
    },
    enabled: !!typeId,
    staleTime: 5 * 60 * 1000,
  });

  return adaptQuery<PSpendSubType[]>(q);
}
