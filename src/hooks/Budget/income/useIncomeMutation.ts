import type {
  CreateDepartmentDTO,
  CreateIncomeDTO,
  CreateIncomeSubTypeDTO,
  CreateIncomeTypeDTO,
  Department,
  Income,
  IncomeSubType,
  IncomeType,
} from "../../../models/Budget/IncomeType";
import {
  createDepartment,
  createIncome,
  createIncomeSubType,
  createIncomeType,
} from "../../../services/Budget/IncomeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      // refresca lista global de departamentos
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });
  return wrapMutation<CreateDepartmentDTO, Department>(m);
}

// Crear Tipo de Ingreso
export function useCreateIncomeType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateIncomeTypeDTO) => createIncomeType(payload),
    onSuccess: (_created, payload) => {
      // refresca tipos del departamento afectado
      qc.invalidateQueries({ queryKey: ["incomeTypes", payload.departmentId ?? "none"] });
    },
  });
  return wrapMutation<CreateIncomeTypeDTO, IncomeType>(m);
}

// Crear Subtipo de Ingreso
export function useCreateIncomeSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreateIncomeSubTypeDTO) => createIncomeSubType(payload),
    onSuccess: (_created, payload) => {
      // refresca subtipos del tipo afectado
      // (asumiendo que CreateIncomeSubTypeDTO tiene incomeTypeId)
      qc.invalidateQueries({ queryKey: ["incomeSubTypes", (payload as any).incomeTypeId ?? "none"] });
    },
  });
  return wrapMutation<CreateIncomeSubTypeDTO, IncomeSubType>(m);
}

// Registrar ingreso real (/income)
export function useCreateIncomeEntry() {
  const m = useMutation({
    mutationFn: (payload: CreateIncomeDTO) => createIncome(payload),
  });
  return wrapMutation<CreateIncomeDTO, Income>(m);
}
