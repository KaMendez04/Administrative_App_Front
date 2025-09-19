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
} from "../../../services/Budget/projectionSpendService";
import { createDepartment } from "../../../services/Budget/SpendService";

// Mantener contrato { mutate, loading, error }
function wrapMutation<TPayload, TResult>(
  m: ReturnType<typeof useMutation<TResult, unknown, TPayload, unknown>>,
) {
  return {
    mutate: (payload: TPayload) => m.mutateAsync(payload),
    loading: m.isPending,
    error: (m.error as any)?.message ?? null,
  };
}

// Crear Departamento (refresca lista)
export function useCreateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { name: string }) => createDepartment(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
  return wrapMutation<{ name: string }, Department>(m);
}

// Crear Tipo (refresca tipos del depto afectado)
export function useCreatePSpendType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { name: string; departmentId: number }) => createPSpendType(p),
    onSuccess: (_created, p) =>
      qc.invalidateQueries({ queryKey: ["pSpendTypes", p.departmentId ?? "none"] }),
  });
  return wrapMutation<{ name: string; departmentId: number }, PSpendType>(m);
}

// Crear Subtipo (refresca subtipos del tipo afectado)
export function useCreatePSpendSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { name: string; pSpendTypeId: number }) => createPSpendSubType(p),
    onSuccess: (_created, p) =>
      qc.invalidateQueries({ queryKey: ["pSpendSubTypes", p.pSpendTypeId ?? "none"] }),
  });
  return wrapMutation<{ name: string; pSpendTypeId: number }, PSpendSubType>(m);
}


export function useCreatePSpendEntry() {
  const m = useMutation({ mutationFn: (p: CreatePSpendDTO) => createPSpend(p) });
  return wrapMutation<CreatePSpendDTO, PSpend>(m);
}
