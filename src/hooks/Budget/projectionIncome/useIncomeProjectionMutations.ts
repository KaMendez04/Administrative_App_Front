import { useState } from "react";
import type { CreateDepartmentDTO, CreatePIncomeDTO, CreatePIncomeSubTypeDTO, CreatePIncomeTypeDTO, Department, PIncome, PIncomeSubType, PIncomeType } from "../../../models/Budget/incomeProjectionType";
import { createDepartment, createPIncome, createPIncomeSubType, createPIncomeType } from "../../../services/Budget/projectionIncomeService";


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
  return useMutationFn<CreatePIncomeTypeDTO, PIncomeType>(createPIncomeType);
}

// Crear Subtipo de Ingreso
export function useCreateIncomeSubType() {
  return useMutationFn<CreatePIncomeSubTypeDTO, PIncomeSubType>(createPIncomeSubType);
}

// Registrar movimiento de ingreso real (/income)
export function useCreatePIncomeEntry() {
  return useMutationFn<CreatePIncomeDTO, PIncome>(createPIncome);
}
