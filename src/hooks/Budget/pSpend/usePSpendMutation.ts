import { useState } from "react";
import type { CreatePSpendDTO, PSpend } from "../../../models/Budget/PSpendType";
import {
  createPSpend,
  createPSpendType,
  createPSpendSubType,
} from "../../../services/Budget/projectionSpendService";
import type { PSpendType, PSpendSubType, Department } from "../../../models/Budget/PSpendType";
import { createDepartment } from "../../../services/Budget/SpendService"; // o tu service que crea dept

function useMutationFn<TPayload, TResult>(fn: (p: TPayload) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function mutate(payload: TPayload): Promise<TResult> {
    setLoading(true); setError(null);
    try { return await fn(payload); }
    catch (err: any) { setError(err?.message ?? "Error de red"); throw err; }
    finally { setLoading(false); }
  }
  return { mutate, loading, error };
}

export function useCreateDepartment() {
  return useMutationFn<{ name: string }, Department>(createDepartment);
}
export function useCreatePSpendType() {
  return useMutationFn<{ name: string; departmentId: number }, PSpendType>(createPSpendType);
}
export function useCreatePSpendSubType() {
  return useMutationFn<{ name: string; pSpendTypeId: number }, PSpendSubType>(createPSpendSubType);
}
export function useCreatePSpendEntry() {
  return useMutationFn<CreatePSpendDTO, PSpend>(createPSpend);
}
