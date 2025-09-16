import { useCallback, useState } from "react";
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";
import {
  createExtraordinary,
  deleteExtraordinary,
  allocateExtraordinary,
  remainingExtraordinary,
} from "../../../services/Budget/extraordinary/ExtraordinaryService";

export function useExtraordinaryCrud() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const create = useCallback(async (body: Pick<Extraordinary, "name" | "amount" | "date">) => {
    setLoading(true); setError(null);
    try { return await createExtraordinary(body); }
    catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  }, []);

  const remove = useCallback(async (id: number) => {
    setLoading(true); setError(null);
    try { await deleteExtraordinary(id); }
    catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  }, []);

  const allocate = useCallback(async (id: number, amount: number) => {
    setLoading(true); setError(null);
    try { return await allocateExtraordinary(id, amount); }
    catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  }, []);

  const remaining = useCallback(async (id: number) => {
    setLoading(true); setError(null);
    try { return await remainingExtraordinary(id); }
    catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  }, []);

  return { create, remove, allocate, remaining, loading, error };
}
