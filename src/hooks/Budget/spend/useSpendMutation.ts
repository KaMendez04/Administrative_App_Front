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
} from "../../../services/Budget/SpendService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ensureSpendSubTypeFromProjection } from "../../../services/Budget/SpendService";


// Mantiene el contrato: { mutate, loading, error }
function wrapMutation<TPayload, TResult>(
  mutation: ReturnType<typeof useMutation<TResult, unknown, TPayload, unknown>>,
) {
  return {
    mutate: (payload: TPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    error: (mutation.error as any)?.message ?? null,
  };
}

// Crear Departamento
export function useCreateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateDepartmentDTO) => createDepartment(payload),
    onSuccess: () => {
      // refresca la lista de departamentos
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });
  return wrapMutation<CreateDepartmentDTO, Department>(m);
}

// Crear Tipo de Egreso
export function useCreateSpendType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateSpendTypeDTO) => createSpendType(payload),
    onSuccess: (_created, payload) => {
      // refresca tipos del departamento afectado
      qc.invalidateQueries({ queryKey: ["spendTypes", payload.departmentId ?? "none"] });
    },
  });
  return wrapMutation<CreateSpendTypeDTO, SpendType>(m);
}

// Crear Subtipo de Egreso
export function useCreateSpendSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateSpendSubTypeDTO) => createSpendSubType(payload),
    onSuccess: (_created, payload) => {
      // refresca subtipos del tipo afectado
      qc.invalidateQueries({ queryKey: ["spendSubTypes", payload.spendTypeId ?? "none"] });
    },
  });
  return wrapMutation<CreateSpendSubTypeDTO, SpendSubType>(m);
}

// Registrar movimiento de egreso real (/spend)
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
