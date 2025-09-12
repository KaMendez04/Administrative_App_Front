import { useState } from "react";
import type { CreateDepartmentDTO, CreateIncomeProjectionSubTypeDTO, CreateIncomeProjectionTypeDTO, Department, IncomeProjectionCreateDTO, IncomeProjectionSubType, IncomeProjectionType } from "../../models/Budget/incomeProjectionType";
import { createDepartment, createIncomeProjection, createIncomeProjectionSubType, createIncomeProjectionType } from "../../services/incomeProjectionService";

function useMutationFn<TPayload, TResult>(
  fn: (payload: TPayload) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const mutate = async (payload: TPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(payload);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Error inesperado");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}

// Crear Departamento
export function useCreateDepartment() {
  return useMutationFn<CreateDepartmentDTO, Department>(createDepartment);
}

// Crear Tipo
export function useCreateIncomeProjectionType() {
  return useMutationFn<CreateIncomeProjectionTypeDTO, IncomeProjectionType>(
    createIncomeProjectionType
  );
}

// Crear SubTipo
export function useCreateIncomeProjectionSubType() {
  return useMutationFn<
    CreateIncomeProjectionSubTypeDTO,
    IncomeProjectionSubType
  >(createIncomeProjectionSubType);
}

// Crear Proyección
export function useCreateIncomeProjection() {
  return useMutationFn<
    IncomeProjectionCreateDTO,
    { id: number } & IncomeProjectionCreateDTO
  >(createIncomeProjection);
}
