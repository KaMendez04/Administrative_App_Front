import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreatePSpendDTO,
  PSpend,
  PSpendType,
  PSpendSubType,
  Department,
} from "../../../models/Budget/PSpendType";

import {
  createPSpend,
  createPSpendType,
  createPSpendSubType,
  updatePSpendType,
  updatePSpendSubType,
} from "../../../services/Budget/projectionSpendService";

import {
  createDepartment,
  updateDepartment,
  // updateDepartment, // ✅ TODO: agregar cuando exista en el service correcto
} from "../../../services/Budget/SpendService";

function wrapMutation<TPayload, TResult>(
  m: ReturnType<typeof useMutation<TResult, unknown, TPayload, unknown>>,
) {
  return {
    mutate: (payload: TPayload) => m.mutateAsync(payload),
    loading: m.isPending,
    error: (m.error as any)?.message ?? null,
  };
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { name: string }) => createDepartment(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
  return wrapMutation<{ name: string }, Department>(m);
}

/**
 * ✅ TODO: habilitar cuando tengas updateDepartment en el service correcto.
 *
export function useUpdateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateDepartment(id, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
  return wrapMutation<{ id: number; name: string }, Department>(m);
}
 */

export function useCreatePSpendType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { name: string; departmentId: number }) => createPSpendType(p),
    onSuccess: (_created, p) =>
      qc.invalidateQueries({ queryKey: ["pSpendTypes", p.departmentId ?? "none"] }),
  });
  return wrapMutation<{ name: string; departmentId: number }, PSpendType>(m);
}

export function useUpdatePSpendType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { id: number; name?: string; departmentId?: number }) =>
      updatePSpendType(p.id, { name: p.name, departmentId: p.departmentId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["pSpendTypes"] });
      qc.invalidateQueries({ queryKey: ["pSpendTypes", vars.departmentId ?? "none"] });
    },
  });
  return wrapMutation<{ id: number; name?: string; departmentId?: number }, PSpendType>(m);
}

export function useCreatePSpendSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { name: string; pSpendTypeId: number }) => createPSpendSubType(p),
    onSuccess: (_created, p) =>
      qc.invalidateQueries({ queryKey: ["pSpendSubTypes", p.pSpendTypeId ?? "none"] }),
  });
  return wrapMutation<{ name: string; pSpendTypeId: number }, PSpendSubType>(m);
}

export function useUpdatePSpendSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { id: number; name?: string; pSpendTypeId?: number }) =>
      updatePSpendSubType(p.id, { name: p.name, typeId: p.pSpendTypeId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["pSpendSubTypes"] });
      qc.invalidateQueries({ queryKey: ["pSpendSubTypes", vars.pSpendTypeId ?? "none"] });
    },
  });
  return wrapMutation<{ id: number; name?: string; pSpendTypeId?: number }, PSpendSubType>(m);
}

export function useCreatePSpendEntry() {
  const m = useMutation({ mutationFn: (p: CreatePSpendDTO) => createPSpend(p) });
  return wrapMutation<CreatePSpendDTO, PSpend>(m);
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateDepartment(id, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
  return wrapMutation<{ id: number; name: string }, Department>(m);
}
