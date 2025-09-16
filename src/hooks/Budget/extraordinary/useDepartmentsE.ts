import { useCallback, useEffect, useState } from "react";
import type { Department } from "../../../models/Budget/IncomeType";
import { fetchDepartments } from "../../../services/Budget/extraordinary/ExtraordinaryService";

export function useDepartmentsE() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchDepartments();
      setData(rows as unknown as Department[]); // si tus tipos Dept/Department difieren, unifica el modelo
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
