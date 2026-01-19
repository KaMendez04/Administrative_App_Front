import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateDepartmentDTO, CreatePIncomeDTO, CreatePIncomeSubTypeDTO, CreatePIncomeTypeDTO, Department, PIncome, PIncomeSubType, PIncomeType } from "../../../models/Budget/incomeProjectionType";
import { createDepartment, createPIncome, createPIncomeSubType, createPIncomeType, updateDepartment, updatePIncomeSubType, updatePIncomeType } from "../../../services/Budget/projectionIncomeService";
import { updatePIncome } from "../../../services/Budget/projectionIncomeService";
import { ensureIncomeTypeFromProjection, ensureIncomeSubTypeFromProjection } from "../../../services/Budget/projectionIncomeService";


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
    onSuccess: ( payload) => {
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
    onSuccess: ( payload) => {
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


export function useUpdateIncomeType() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (payload: { id: number; name?: string; departmentId?: number }) =>
      updatePIncomeType(payload.id, {
        name: payload.name,
        departmentId: payload.departmentId,
      }),
    onSuccess: (_data, vars) => {
      // refresca tipos: el tuyo está cacheado por deptId
      qc.invalidateQueries({ queryKey: ["pIncomeTypes"] });
      qc.invalidateQueries({ queryKey: ["pIncomeTypes", vars.departmentId ?? "none"] });
    },
  });

  return wrapMutation<{ id: number; name?: string; departmentId?: number }, PIncomeType>(m);
}

export function useUpdateIncomeSubType() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (payload: { id: number; name?: string; pIncomeTypeId?: number }) =>
      updatePIncomeSubType(payload.id, {
        name: payload.name,
        pIncomeTypeId: payload.pIncomeTypeId,
      }),
    onSuccess: (_data, vars) => {
      // tu queryKey de subtypes es ["pIncomeSubTypes", pIncomeTypeId ?? "none"]
      qc.invalidateQueries({ queryKey: ["pIncomeSubTypes"] });
      qc.invalidateQueries({ queryKey: ["pIncomeSubTypes", vars.pIncomeTypeId ?? "none"] });
    },
  });

  return wrapMutation<{ id: number; name?: string; pIncomeTypeId?: number }, PIncomeSubType>(m);
}



export function useUpdatePIncome() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: ({
      id,
      amount,
      pIncomeSubTypeId,
    }: {
      id: number;
      amount?: number;
      pIncomeSubTypeId?: number;
    }) =>
      updatePIncome(id, {
        amount,
        pIncomeSubTypeId,
      }),

    onSuccess: (_data) => {
      // cuando editemos, luego invalidaremos la lista
      qc.invalidateQueries({ queryKey: ["pIncomeList"] });
    },
  });

  return wrapMutation<
    { id: number; amount?: number; pIncomeSubTypeId?: number },
    any
  >(m);
}


export function useEnsureIncomeTypeFromProjection() {
  const m = useMutation({
    mutationFn: (pIncomeTypeId: number) => ensureIncomeTypeFromProjection(pIncomeTypeId),
  });
  return {
    mutate: (pIncomeTypeId: number) => m.mutateAsync(pIncomeTypeId),
    loading: m.isPending,
    error: (m.error as any)?.message ?? null,
  };
}

export function useEnsureIncomeSubTypeFromProjection() {
  const m = useMutation({
    mutationFn: (pIncomeSubTypeId: number) => ensureIncomeSubTypeFromProjection(pIncomeSubTypeId),
  });
  return {
    mutate: (pIncomeSubTypeId: number) => m.mutateAsync(pIncomeSubTypeId),
    loading: m.isPending,
    error: (m.error as any)?.message ?? null,
  };
}