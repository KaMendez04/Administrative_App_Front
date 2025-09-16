import { useCallback, useEffect, useState } from "react";
import type { Extraordinary } from "../../../models/Budget/extraordinary/extraordinaryInterface";
import { listExtraordinary } from "../../../services/Budget/extraordinary/ExtraordinaryService";

export function useExtraordinaryList() {
  const [data, setData] = useState<Extraordinary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listExtraordinary();
      setData(rows);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
