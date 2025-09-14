import { useState } from "react";
import type { CreateDepartmentDTO, CreateSpendDTO, CreateSpendSubTypeDTO, CreateSpendTypeDTO, Department, Spend, SpendSubType, SpendType } from "../../../models/Budget/spendProjectionType";
import { createDepartment, createSpend, createSpendSubType, createSpendType } from "../../../services/Budget/projectionSpendService";


function useMutationFn<TPayload, TResult>(fn: (payload: TPayload) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(payload: TPayload): Promise<TResult> {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(payload);
      return res;
    } catch (err: any) {
      setError(err?.message ?? "Error de red");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { mutate, loading, error };
}

// Crear Departamento
export function useCreateDepartment() {
  return useMutationFn<CreateDepartmentDTO, Department>(createDepartment);
}

// Crear Tipo de Gasto
export function useCreateSpendType() {
  return useMutationFn<CreateSpendTypeDTO, SpendType>(createSpendType);
}

// Crear Subtipo de Gasto
export function useCreateSpendSubType() {
  return useMutationFn<CreateSpendSubTypeDTO, SpendSubType>(createSpendSubType);
}

// Registrar movimiento de gasto real (/spend)
export function useCreateSpendEntry() {
  return useMutationFn<CreateSpendDTO, Spend>(createSpend);
}
