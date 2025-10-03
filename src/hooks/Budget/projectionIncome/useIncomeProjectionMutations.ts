import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateDepartmentDTO, CreatePIncomeDTO, CreatePIncomeSubTypeDTO, CreatePIncomeTypeDTO, Department, PIncome, PIncomeSubType, PIncomeType } from "../../../models/Budget/incomeProjectionType";
import { createDepartment, createPIncome, createPIncomeSubType, createPIncomeType } from "../../../services/Budget/projectionIncomeService";

/** Pequeño wrapper para conservar tu contrato */
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
      // refresca lista de departamentos en tiempo real
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });
  return wrapMutation<CreateDepartmentDTO, Department>(m);
}

// Crear Tipo de Ingreso
export function useCreateIncomeType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreatePIncomeTypeDTO) => createPIncomeType(payload),
    onSuccess: (created, payload) => {
      // refresca tipos del departamento afectado
      qc.invalidateQueries({
        queryKey: ["pIncomeTypes", payload.departmentId ?? "none"],
      });
    },
  });
  return wrapMutation<CreatePIncomeTypeDTO, PIncomeType>(m);
}

// Crear Subtipo de Ingreso
export function useCreateIncomeSubType() {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (payload: CreatePIncomeSubTypeDTO) =>
      createPIncomeSubType(payload),
    onSuccess: (created, payload) => {
      // refresca subtipos del tipo afectado
      qc.invalidateQueries({
        queryKey: ["pIncomeSubTypes", payload.pIncomeTypeId ?? "none"],
      });
    },
  });
  return wrapMutation<CreatePIncomeSubTypeDTO, PIncomeSubType>(m);
}

// Registrar movimiento de ingreso real (/p-income)
export function useCreatePIncomeEntry() {
  // Por ahora no invalidamos nada adicional porque tu UI no lista aquí movimientos.
  const m = useMutation({
    mutationFn: (payload: CreatePIncomeDTO) => createPIncome(payload),
  });
  return wrapMutation<CreatePIncomeDTO, PIncome>(m);
}
