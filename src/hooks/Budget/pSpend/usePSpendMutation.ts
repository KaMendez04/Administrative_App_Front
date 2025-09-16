import { useState } from "react";
import type { CreatePSpendDTO, PSpend } from "../../../models/Budget/PSpendType";
import { createPSpend } from "../../../services/Budget/projectionSpendService";

function useMutationFn<TPayload, TResult>(fn: (payload: TPayload) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(payload: TPayload): Promise<TResult> {
    setLoading(true);
    setError(null);
    try {
      return await fn(payload);
    } catch (err: any) {
      setError(err?.message ?? "Error de red");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { mutate, loading, error };
}

export function useCreatePSpendEntry() {
  return useMutationFn<CreatePSpendDTO, PSpend>(createPSpend);
}
