import { useEffect, useState } from "react";
import type { Department, IncomeSubType, IncomeType } from "../../../models/Budget/incomeProjectionType";
import { listDepartments, listIncomeSubTypes, listIncomeTypes } from "../../../services/Budget/projectionIncomeService";




// Departamentos
export function useDepartments() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listDepartments()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// IncomeTypes (dependen de departamento)
export function useIncomeTypes(departmentId?: number) {
  const [data, setData] = useState<IncomeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    setLoading(true);
    listIncomeTypes(departmentId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [departmentId]);

  return { data, loading, error };
}

// IncomeSubTypes (dependen de type)
export function useIncomeSubTypes(incomeTypeId?: number) {
  const [data, setData] = useState<IncomeSubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!incomeTypeId) return;
    setLoading(true);
    listIncomeSubTypes(incomeTypeId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [incomeTypeId]);

  return { data, loading, error };
}
