import { useState } from "react";
import type { CreateDepartmentDTO, CreateIncomeDTO, CreateIncomeSubTypeDTO, CreateIncomeTypeDTO, Department, Income, IncomeSubType, IncomeType } from "../../../models/Budget/incomeProjectionType";
import { createDepartment, createIncome, createIncomeSubType, createIncomeType } from "../../../services/Budget/projectionIncomeService";


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

// Crear Tipo de Ingreso
export function useCreateIncomeType() {
  return useMutationFn<CreateIncomeTypeDTO, IncomeType>(createIncomeType);
}

// Crear Subtipo de Ingreso
export function useCreateIncomeSubType() {
  return useMutationFn<CreateIncomeSubTypeDTO, IncomeSubType>(createIncomeSubType);
}

// Registrar movimiento de ingreso real (/income)
export function useCreateIncomeEntry() {
  return useMutationFn<CreateIncomeDTO, Income>(createIncome);
}
