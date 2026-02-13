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
  updateDepartment,
  updateIncomeType,
  updateIncomeSubType,
} from "../../../services/Budget/IncomeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIncome } from "../../../services/Budget/IncomeService";

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

// ✅ Update Departamento
export function useUpdateDepartment() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateDepartment(id, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });
  return wrapMutation<{ id: number; name: string }, Department>(m);
}

// ✅ Update Tipo de Ingreso
export function useUpdateIncomeType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { id: number; name?: string; departmentId?: number }) =>
      updateIncomeType(p.id, { name: p.name, departmentId: p.departmentId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["incomeTypes"] });
      qc.invalidateQueries({ queryKey: ["incomeTypes", vars.departmentId ?? "none"] });
    },
  });
  return wrapMutation<{ id: number; name?: string; departmentId?: number }, IncomeType>(m);
}

// ✅ Update Subtipo de Ingreso
export function useUpdateIncomeSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (p: { id: number; name?: string; incomeTypeId?: number }) =>
      updateIncomeSubType(p.id, { name: p.name, incomeTypeId: p.incomeTypeId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["incomeSubTypes"] });
      qc.invalidateQueries({ queryKey: ["incomeSubTypes", vars.incomeTypeId ?? "none"] });
    },
  });
  return wrapMutation<{ id: number; name?: string; incomeTypeId?: number }, IncomeSubType>(m);
}



export function useUpdateIncome() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: ({
      id,
      amount,
      incomeSubTypeId,
      date,
    }: {
      id: number;
      amount?: number;
      incomeSubTypeId?: number;
      date?: string;
    }) =>
      updateIncome(id, { amount, incomeSubTypeId, date }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["incomeList"] });
      // (si tu lista usa otro queryKey, lo ajustamos cuando vea tu IncomeList)
    },
  });

  return wrapMutation<
    { id: number; amount?: number; incomeSubTypeId?: number; date?: string },
    any
  >(m);
}
