import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateDepartmentDTO,
  CreateSpendDTO,
  CreateSpendSubTypeDTO,
  CreateSpendTypeDTO,
  Department,
  Spend,
  SpendSubType,
  SpendType,
} from "../../../models/Budget/SpendType";

import {
  createDepartment,
  createSpend,
  createSpendSubType,
  createSpendType,
  updateDepartment,
  updateSpendType,
  updateSpendSubType,
  ensureSpendSubTypeFromProjection,
  updateSpend,
} from "../../../services/Budget/SpendService";

function wrapMutation<TPayload, TResult>(
  mutation: ReturnType<typeof useMutation<TResult, unknown, TPayload, unknown>>,
) {
  return {
    mutate: (payload: TPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    error: (mutation.error as any)?.message ?? null,
  };
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateDepartmentDTO) => createDepartment(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
  return wrapMutation<CreateDepartmentDTO, Department>(m);
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateDepartment(id, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
  return wrapMutation<{ id: number; name: string }, Department>(m);
}

export function useCreateSpendType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateSpendTypeDTO) => createSpendType(payload),
    onSuccess: (_created, payload) => {
      qc.invalidateQueries({ queryKey: ["spendTypes", payload.departmentId ?? "none"] });
    },
  });
  return wrapMutation<CreateSpendTypeDTO, SpendType>(m);
}

export function useUpdateSpendType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: { id: number; name?: string; departmentId?: number }) =>
      updateSpendType(payload.id, { name: payload.name, departmentId: payload.departmentId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["spendTypes"] });
      qc.invalidateQueries({ queryKey: ["spendTypes", vars.departmentId ?? "none"] });
    },
  });
  return wrapMutation<{ id: number; name?: string; departmentId?: number }, SpendType>(m);
}

export function useCreateSpendSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateSpendSubTypeDTO) => createSpendSubType(payload),
    onSuccess: (_created, payload) => {
      qc.invalidateQueries({ queryKey: ["spendSubTypes", payload.spendTypeId ?? "none"] });
    },
  });
  return wrapMutation<CreateSpendSubTypeDTO, SpendSubType>(m);
}

export function useUpdateSpendSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: { id: number; name?: string; spendTypeId?: number }) =>
      updateSpendSubType(payload.id, { name: payload.name, spendTypeId: payload.spendTypeId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["spendSubTypes"] });
      qc.invalidateQueries({ queryKey: ["spendSubTypes", vars.spendTypeId ?? "none"] });
    },
  });
  return wrapMutation<{ id: number; name?: string; spendTypeId?: number }, SpendSubType>(m);
}

export function useCreateSpendEntry() {
  const m = useMutation({
    mutationFn: (payload: CreateSpendDTO) => createSpend(payload),
  });
  return wrapMutation<CreateSpendDTO, Spend>(m);
}

export function useEnsureSpendSubTypeFromProjection() {
  const m = useMutation({
    mutationFn: (pSpendSubTypeId: number) => ensureSpendSubTypeFromProjection(pSpendSubTypeId),
  });
  return wrapMutation<number, any>(m);
}


export function useUpdateSpend() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (p: { id: number; spendSubTypeId?: number; amount?: number; date?: string }) =>
      updateSpend(p.id, { spendSubTypeId: p.spendSubTypeId, amount: p.amount, date: p.date }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spendList"] });
    },
  });

  return wrapMutation<{ id: number; spendSubTypeId?: number; amount?: number; date?: string }, any>(m);
}