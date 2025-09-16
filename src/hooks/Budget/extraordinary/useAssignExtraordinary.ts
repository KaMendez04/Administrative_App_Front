import { useCallback, useState } from "react";
import type { AssignExtraordinaryDto } from "../../../models/Budget/extraordinary/AssignInterface";
import { assignExtraordinary } from "../../../services/Budget/extraordinary/ExtraordinaryService";

export function useAssignExtraordinary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const submit = useCallback(async (dto: AssignExtraordinaryDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await assignExtraordinary(dto);
      setLastResult(res);
      return res;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, lastResult };
}
